from typing import Optional
from pydantic import BaseModel, Field, HttpUrl

class InternshipRequest(BaseModel):
    title: Optional[str] = Field(default="", max_length=180)
    description: str = Field(min_length=20, max_length=10000)
    stipend: Optional[str] = None
    duration: Optional[str] = None
    work_mode: Optional[str] = None
    location: Optional[str] = None
    application_method: Optional[str] = None
    recruiter_email: Optional[str] = None
    recruiter_phone: Optional[str] = None
    website: Optional[str] = None

class WebsiteRequest(BaseModel):
    website: str = Field(min_length=8, max_length=2048)
    company_name: Optional[str] = Field(default="", max_length=180)
