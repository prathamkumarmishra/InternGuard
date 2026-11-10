from app.models.schemas import InternshipRequest, WebsiteRequest
from app.services.nlp_service import analyze_internship, matched_phrases, build_model


def test_suspicious_payment_language_is_explained():
    result = analyze_internship(InternshipRequest(description="Pay a registration fee for a guaranteed placement."))
    assert "registration fee" in result["matched_indicators"]
    assert "guaranteed placement" in result["matched_indicators"]
    assert result["risk_score"] > 20


def test_legitimate_internship_scores_low():
    result = analyze_internship(InternshipRequest(
        description="Three month data analysis internship with monthly stipend and official offer letter after technical interview."
    ))
    assert result["risk_score"] <= 30
    assert result["classification"] == "LOW RISK"
    assert len(result["matched_indicators"]) == 0


def test_multiple_suspicious_phrases_elevate_score():
    result = analyze_internship(InternshipRequest(
        description="Pay registration fee for guaranteed placement. Limited seats available. Send urgent payment via WhatsApp only."
    ))
    assert len(result["matched_indicators"]) >= 3
    assert result["risk_score"] > 48


def test_matched_phrases_are_case_insensitive():
    matches = matched_phrases("PAY A REGISTRATION FEE for GUARANTEED PLACEMENT")
    assert "registration fee" in matches
    assert "guaranteed placement" in matches


def test_model_builds_successfully():
    model = build_model()
    proba = model.predict_proba(["Pay registration fee for guaranteed job"])[0]
    assert len(proba) == 2
    assert proba[1] > 0.5, "Model should flag suspicious text with high probability"


def test_model_predicts_legitimate_as_low_risk():
    model = build_model()
    proba = model.predict_proba(["Research internship with faculty guidance and stipend"])[0]
    assert proba[0] > 0.5, "Model should classify legitimate text as low risk"


def test_explanation_always_includes_disclaimer():
    result = analyze_internship(InternshipRequest(
        description="Normal software internship with mentorship and no fees required for this opportunity."
    ))
    assert any("not a legal determination" in exp.lower() for exp in result["explanation"])


def test_result_contains_all_required_fields():
    result = analyze_internship(InternshipRequest(
        description="Internship description for testing the response structure completely."
    ))
    assert "risk_probability" in result
    assert "risk_score" in result
    assert "classification" in result
    assert "matched_indicators" in result
    assert "explanation" in result
    assert "model_version" in result
