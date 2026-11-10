import ipaddress
import os
import socket
from urllib.parse import urljoin, urlparse
from urllib import robotparser
import requests
from bs4 import BeautifulSoup

TIMEOUT = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "6"))
USER_AGENT = "InternGuardScreeningBot/1.0 (+local demonstration; public pages only)"

def _public_host(hostname: str) -> bool:
    try:
        addresses = socket.getaddrinfo(hostname, None)
        return bool(addresses) and all(not ipaddress.ip_address(address[4][0]).is_private and not ipaddress.ip_address(address[4][0]).is_loopback and not ipaddress.ip_address(address[4][0]).is_link_local for address in addresses)
    except (socket.gaierror, ValueError):
        return False

def _signal(name, value, description, confidence=0.8):
    return {"signal": name, "value": value, "source": "Public website analysis", "confidence": confidence, "description": description}

def analyze_website(website: str, company_name: str = ""):
    parsed = urlparse(website)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        return {"reachable": None, "url": website, "score": 0, "signals": [_signal("Invalid public website URL", False, "Only public HTTP(S) website addresses can be analyzed.", 1)], "note": "No request was made."}
    if not _public_host(parsed.hostname):
        return {"reachable": None, "url": website, "score": 0, "signals": [_signal("Non-public host rejected", False, "The address does not resolve to a public host and was not requested.", 1)], "note": "No request was made."}
    signals = [_signal("HTTPS enabled" if parsed.scheme == "https" else "HTTP URL submitted", parsed.scheme == "https", "The submitted website URL uses HTTPS." if parsed.scheme == "https" else "The submitted website URL does not use HTTPS.", 1)]
    try:
        robots = robotparser.RobotFileParser()
        robots.set_url(urljoin(website, "/robots.txt"))
        robots.read()
        if not robots.can_fetch(USER_AGENT, website):
            return {"reachable": None, "url": website, "score": 0, "signals": signals + [_signal("Robots policy respected", True, "The site disallows this public-page check, so no content was fetched.", 1)], "note": "No content was fetched because robots.txt disallows this request."}
    except Exception:
        # An unavailable robots.txt is not treated as a negative signal. One modest public request follows.
        pass
    try:
        response = requests.get(website, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT, allow_redirects=True, stream=True)
        response.raise_for_status()
        content = response.raw.read(500_000, decode_content=True)
        soup = BeautifulSoup(content, "html.parser")
        text = soup.get_text(" ", strip=True)[:100_000]
        title = soup.title.get_text(" ", strip=True) if soup.title else ""
        links = {urlparse(urljoin(response.url, link.get("href", ""))).path.lower() for link in soup.find_all("a")}
        has_contact = any("contact" in link for link in links) or "contact" in text.lower()
        has_privacy = any("privacy" in link for link in links) or "privacy policy" in text.lower()
        has_terms = any("terms" in link for link in links) or "terms of" in text.lower()
        company_match = bool(company_name) and company_name.lower() in f"{title} {text[:8000]}".lower()
        emails = sorted(set(__import__("re").findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}", text)))[:10]
        signals.extend([
            _signal("Website reachable", True, f"Public homepage responded with HTTP {response.status_code}.", 0.95),
            _signal("Contact page found", has_contact, "A public contact reference was found." if has_contact else "No contact reference was found on the inspected public page.", 0.8),
            _signal("Privacy policy found", has_privacy, "A public privacy reference was found." if has_privacy else "No privacy reference was found on the inspected public page.", 0.8),
            _signal("Terms found", has_terms, "A public terms reference was found." if has_terms else "No terms reference was found on the inspected public page.", 0.75),
        ])
        if company_name:
            signals.append(_signal("Company name visible on website", company_match, "The submitted organization name was found in the inspected public content." if company_match else "The submitted organization name was not found in the inspected public content; context review may be useful.", 0.75))
        score = min(20, (0 if parsed.scheme == "https" else 4) + (0 if has_contact else 4) + (0 if has_privacy else 3) + (0 if has_terms else 2) + (5 if company_name and not company_match else 0))
        return {"reachable": True, "url": response.url, "status_code": response.status_code, "title": title, "emails": emails, "signals": signals, "score": score, "note": "Only publicly accessible, unauthenticated content was inspected. No security testing was performed."}
    except requests.RequestException as error:
        return {"reachable": False, "url": website, "score": 12, "signals": signals + [_signal("Website unavailable", False, "The public website could not be reached during this check.", 0.85)], "note": f"Public availability check did not complete: {str(error)[:160]}"}
