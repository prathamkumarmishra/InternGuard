from fastapi import APIRouter
from app.models.schemas import InternshipRequest, WebsiteRequest
from app.services.nlp_service import analyze_internship
from app.services.website_service import analyze_website

router = APIRouter()

@router.post("/internship")
def internship_analysis(payload: InternshipRequest):
    return analyze_internship(payload)

@router.post("/website")
def website_analysis(payload: WebsiteRequest):
    return analyze_website(payload.website, payload.company_name or "")
