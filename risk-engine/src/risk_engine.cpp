#include <algorithm>
#include <cctype>
#include <iostream>
#include <map>
#include <memory>
#include <optional>
#include <queue>
#include <regex>
#include <sstream>
#include <stack>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace internguard {

std::string lower(std::string value) {
  std::transform(value.begin(), value.end(), value.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
  return value;
}

std::string escape_json(const std::string& value) {
  std::string output;
  for (char ch : value) {
    if (ch == '"' || ch == '\\') output += '\\';
    if (ch == '\n') output += "\\n";
    else if (ch != '\n') output += ch;
  }
  return output;
}

class Trie {
 public:
  void insert(const std::string& phrase) {
    Node* current = &root_;
    for (char ch : lower(phrase)) {
      auto& next = current->children[ch];
      if (!next) next = std::make_unique<Node>();
      current = next.get();
    }
    current->terminal = true;
    current->phrase = phrase;
  }

  std::vector<std::string> find_in_text(const std::string& text) const {
    const std::string normalized = lower(text);
    std::unordered_set<std::string> matches;
    for (std::size_t start = 0; start < normalized.size(); ++start) {
      const Node* current = &root_;
      for (std::size_t index = start; index < normalized.size(); ++index) {
        auto it = current->children.find(normalized[index]);
        if (it == current->children.end()) break;
        current = it->second.get();
        if (current->terminal) matches.insert(current->phrase);
      }
    }
    return {matches.begin(), matches.end()};
  }

 private:
  struct Node {
    std::unordered_map<char, std::unique_ptr<Node>> children;
    bool terminal = false;
    std::string phrase;
  };
  Node root_;
};

class RelationshipGraph {
 public:
  void connect(const std::string& first, const std::string& second) {
    edges_[first].push_back(second);
    edges_[second].push_back(first);
  }

  std::size_t connected_count(const std::string& source) const {
    if (!edges_.count(source)) return 0;
    std::queue<std::string> pending;
    std::unordered_set<std::string> visited;
    pending.push(source);
    visited.insert(source);
    while (!pending.empty()) {
      auto current = pending.front();
      pending.pop();
      for (const auto& next : edges_.at(current)) {
        if (visited.insert(next).second) pending.push(next);
      }
    }
    return visited.size();
  }

 private:
  std::unordered_map<std::string, std::vector<std::string>> edges_;
};

std::optional<std::string> json_string(const std::string& json, const std::string& key) {
  const std::regex pattern("\\\"" + key + "\\\"\\s*:\\s*\\\"((?:\\\\.|[^\\\"])*)\\\"");
  std::smatch match;
  if (!std::regex_search(json, match, pattern)) return std::nullopt;
  std::string result;
  bool escaped = false;
  for (char ch : match[1].str()) {
    if (escaped) { result += ch == 'n' ? '\n' : ch; escaped = false; }
    else if (ch == '\\') escaped = true;
    else result += ch;
  }
  return result;
}

int json_int(const std::string& json, const std::string& key) {
  const std::regex pattern("\\\"" + key + "\\\"\\s*:\\s*(-?\\d+)");
  std::smatch match;
  return std::regex_search(json, match, pattern) ? std::stoi(match[1].str()) : 0;
}

bool json_bool(const std::string& json, const std::string& key, bool default_value = false) {
  const std::regex pattern("\\\"" + key + "\\\"\\s*:\\s*(true|false)");
  std::smatch match;
  if (!std::regex_search(json, match, pattern)) return default_value;
  return match[1].str() == "true";
}

int clamp(int value, int minimum, int maximum) { return std::max(minimum, std::min(value, maximum)); }

int binary_search_identifier(const std::vector<std::string>& sorted_identifiers, const std::string& target) {
  auto found = std::lower_bound(sorted_identifiers.begin(), sorted_identifiers.end(), target);
  return found != sorted_identifiers.end() && *found == target ? static_cast<int>(found - sorted_identifiers.begin()) : -1;
}

struct Indicator {
  int weight;
  std::string signal;
  bool operator<(const Indicator& other) const { return weight < other.weight; }
};

int run(const std::string& input) {
  const auto description = json_string(input, "internshipDescription").value_or("");
  const auto company = json_string(input, "companyName").value_or("Submitted organization");
  const int complaint_count = std::max(0, json_int(input, "complaintCount"));
  const int payment_complaints = std::max(0, json_int(input, "paymentComplaints"));
  const bool company_name_match = json_bool(input, "companyNameMatch", true);

  const std::vector<std::string> phrases = {"registration fee", "application fee", "security deposit", "processing fee", "guaranteed job", "guaranteed placement", "pay before joining", "certificate fee", "training fee", "urgent payment", "limited seats", "whatsapp only", "crypto payment"};
  Trie trie;
  for (const auto& phrase : phrases) trie.insert(phrase);
  auto matches = trie.find_in_text(description);
  std::sort(matches.begin(), matches.end());

  // Demonstrate hash-map lookup for indicator counts and company/domain indexing.
  std::unordered_map<std::string, int> indicator_counts;
  std::unordered_map<std::string, std::string> company_lookup{{lower(company), "submitted"}};
  for (const auto& match : matches) ++indicator_counts[match];

  // Demonstrate binary search against sorted organization identifiers.
  std::vector<std::string> identifiers{"alpha", "submitted", "verified"};
  const bool company_known = binary_search_identifier(identifiers, company_lookup[lower(company)]) >= 0;

  RelationshipGraph graph;
  graph.connect("company:" + lower(company), "website:submitted");
  graph.connect("company:" + lower(company), "email:submitted");
  if (!company_name_match) graph.connect("website:submitted", "company:unmatched");
  const int relationship_risk = !company_name_match ? 20 : (graph.connected_count("company:" + lower(company)) > 4 ? 10 : 0);

  const int keyword_risk = clamp(static_cast<int>(matches.size()) * 18, 0, 100);
  const int complaint_risk = clamp(complaint_count * 8 + payment_complaints * 10, 0, 100);
  std::vector<Indicator> indicators;
  for (const auto& match : matches) indicators.push_back({18, "Screening phrase detected: " + match});
  if (payment_complaints > 0) indicators.push_back({payment_complaints * 10, "Payment-related reports require context review"});
  if (!company_name_match) indicators.push_back({20, "Submitted website and organization name need verification"});
  std::sort(indicators.begin(), indicators.end(), [](const Indicator& a, const Indicator& b) { return a.weight > b.weight; });

  // Priority queue prioritizes high-risk cases; stack records review history; queue models pending work.
  std::priority_queue<Indicator> high_risk_queue;
  std::queue<std::string> review_queue;
  std::stack<std::string> review_history;
  for (const auto& indicator : indicators) { high_risk_queue.push(indicator); review_queue.push(indicator.signal); review_history.push(indicator.signal); }

  std::vector<std::string> signals;
  while (!high_risk_queue.empty()) { signals.push_back(high_risk_queue.top().signal); high_risk_queue.pop(); }
  std::cout << "{\"keywordRisk\":" << keyword_risk
            << ",\"matchedKeywords\":[";
  for (std::size_t index = 0; index < matches.size(); ++index) {
    if (index) std::cout << ',';
    std::cout << '\"' << escape_json(matches[index]) << '\"';
  }
  std::cout << "],\"complaintRisk\":" << complaint_risk
            << ",\"relationshipRisk\":" << relationship_risk
            << ",\"companyIdentifierKnown\":" << (company_known ? "true" : "false")
            << ",\"riskSignals\":[";
  for (std::size_t index = 0; index < signals.size(); ++index) {
    if (index) std::cout << ',';
    std::cout << '\"' << escape_json(signals[index]) << '\"';
  }
  std::cout << "],\"engineVersion\":\"InternGuard C++17 DSA Engine v1\"}";
  return 0;
}

}  // namespace internguard

int main() {
  std::ostringstream buffer;
  buffer << std::cin.rdbuf();
  if (buffer.str().empty()) {
    std::cout << "{\"error\":\"Input JSON is required\"}";
    return 1;
  }
  try { return internguard::run(buffer.str()); }
  catch (const std::exception& error) { std::cout << "{\"error\":\"" << internguard::escape_json(error.what()) << "\"}"; return 1; }
}
