import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analysis import router as analysis_router

app = FastAPI(title="InternGuard AI Service", version="1.0.0", description="Explainable NLP and public-website screening signals. Results are decision support, not legal determinations.")
origins = [origin.strip() for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8080").split(",")]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["GET", "POST"], allow_headers=["Content-Type", "Authorization"])
app.include_router(analysis_router, prefix="/api/analyze", tags=["analysis"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "internguard-ai", "model": "Internship Risk Classifier v1"}
