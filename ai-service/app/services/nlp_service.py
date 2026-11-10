import os
from pathlib import Path
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

MODEL_VERSION = "Internship Risk Classifier v1"
PHRASES = [
    "registration fee", "application fee", "security deposit", "processing fee", "guaranteed job",
    "guaranteed placement", "pay before joining", "certificate fee", "training fee", "urgent payment",
    "limited seats", "whatsapp only", "crypto payment", "immediate payment", "joining fee",
    "membership fee", "refundable deposit", "personal account", "guaranteed certificate",
    "100% placement", "pay and start", "no interview needed", "act fast", "expires in 24 hours",
]
LEGITIMATE_CUES = [
    "monthly stipend", "official offer letter", "official appointment letter", "interview",
    "mentor", "mentorship", "careers portal", "careers page", "verified company email",
    "faculty guidance", "supervisor guidance", "no payment is required",
]
BASE_TRAINING = [
    # Legitimate internships (label 0)
    ("Work with a mentor on React components. Selection includes a portfolio review and interview. No payment is required.", 0),
    ("Three month data analysis internship with monthly stipend and official offer letter after interview.", 0),
    ("Contribute to supervised Python automation tasks. Apply through the careers portal.", 0),
    ("Campus research internship with faculty guidance and transparent selection criteria.", 0),
    ("Remote design internship, paid stipend, regular check-ins, and published contact details.", 0),
    ("Full-stack development internship with code review and mentoring sessions in a team environment.", 0),
    ("Apply via LinkedIn or the company website with your resume and portfolio for review.", 0),
    ("Selected candidates will receive an official appointment letter via verified company email.", 0),
    ("Cloud infrastructure internship with hands-on AWS and DevOps exposure under senior engineers.", 0),
    ("Mobile app development role with structured training plan, team meetings, and project milestones.", 0),
    ("Content writing internship with editorial feedback, published bylines, and a completion certificate.", 0),
    ("Digital marketing internship in an established agency with real client projects and analytics access.", 0),
    ("Cybersecurity research internship with university lab partnership and published results.", 0),
    ("Machine learning project internship with published dataset and supervisor guidance throughout.", 0),
    ("UI/UX design internship with Figma access, design system work, and peer review sessions.", 0),
    ("Quality assurance internship with test automation and agile methodology in daily standups.", 0),
    ("Government-sponsored AICTE internship with verified institution partnership and official records.", 0),
    ("Paid internship in embedded systems with hardware lab access and mentor supervision.", 0),
    ("Backend engineering internship with structured onboarding, code reviews, and documentation tasks.", 0),
    ("Selected interns receive an appointment letter signed by the HR department after the interview.", 0),
    ("Internship requires no payment and provides a monthly stipend. Apply through our careers page.", 0),
    # Suspicious internships (label 1)
    ("Pay a registration fee to secure your guaranteed placement immediately.", 1),
    ("Limited seats. Send urgent payment for your certificate and guaranteed job.", 1),
    ("Contact us on WhatsApp only and make a security deposit before joining.", 1),
    ("Processing fee required today for a guaranteed internship offer.", 1),
    ("Pay before joining through crypto payment to receive your training certificate.", 1),
    ("Guaranteed placement after paying a one-time application fee of INR 5000.", 1),
    ("Send money via UPI to confirm your internship seat before the deadline.", 1),
    ("No interview needed, just pay the registration amount and start immediately.", 1),
    ("Transfer the security deposit to our personal bank account to begin.", 1),
    ("Pay training fee of INR 3000 to receive materials and guaranteed certificate.", 1),
    ("WhatsApp us at this number only to get guaranteed high-paying internship.", 1),
    ("Urgent: limited seats remaining. Pay immediately to reserve your spot.", 1),
    ("Certificate will be issued only after you complete the payment of INR 2000.", 1),
    ("Guaranteed internship with 100% job placement after course completion.", 1),
    ("Act fast, this guaranteed offer expires in 24 hours. Send payment now.", 1),
    ("No interview or selection process, just pay and get your offer letter.", 1),
    ("Personal account payment only. We do not accept company transfers.", 1),
    ("Free laptop and stipend guaranteed after you pay the refundable deposit.", 1),
    ("Join our premium internship network by paying a membership fee.", 1),
    ("Earn INR 50000 per month guaranteed, just pay the joining fee first.", 1),
]

def _model_path():
    return Path(os.getenv("MODEL_PATH", "app/models/internship_risk_classifier.joblib"))

def build_model():
    texts, labels = zip(*BASE_TRAINING)
    return Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), stop_words="english", min_df=1)),
        ("classifier", LogisticRegression(max_iter=500, class_weight="balanced", random_state=42)),
    ]).fit(texts, labels)

def load_model():
    path = _model_path()
    if path.exists():
        return joblib.load(path)
    return build_model()

def matched_phrases(text: str):
    normalized = text.lower()
    return [phrase for phrase in PHRASES if phrase in normalized]

def analyze_internship(payload):
    text = " ".join(filter(None, [payload.title or "", payload.description, payload.application_method or ""]))
    indicators = matched_phrases(text)
    legitimate_cues = [cue for cue in LEGITIMATE_CUES if cue in text.lower()]
    try:
        model = load_model()
        probability = float(model.predict_proba([text])[0][1])
        model_note = MODEL_VERSION
    except Exception:
        probability = min(0.95, len(indicators) * 0.18)
        model_note = "Rule-based fallback v1"
    # Keep a single phrase from producing an overconfident score; combine interpretable features.
    phrase_floor = min(0.92, len(indicators) * 0.16)
    probability = max(probability, phrase_floor)
    if not indicators and len(legitimate_cues) >= 2:
        probability = min(probability, 0.30)
    score = round(probability * 100)
    classification = "HIGH RISK" if score > 60 else "MEDIUM RISK" if score > 30 else "LOW RISK"
    explanation = [f"Screening phrase detected: {phrase}." for phrase in indicators]
    if not explanation:
        explanation = ["No common suspicious screening phrases were detected in the submitted description."]
    if legitimate_cues:
        explanation.append(f"Legitimate screening cues detected: {', '.join(legitimate_cues)}.")
    explanation.append("This result is a screening signal, not a legal determination of fraud.")
    return {"risk_probability": round(probability, 4), "risk_score": score, "classification": classification, "matched_indicators": indicators, "explanation": explanation, "model_version": model_note}
