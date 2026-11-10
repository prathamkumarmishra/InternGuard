from pathlib import Path
import sys
import joblib

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.nlp_service import build_model, _model_path  # noqa: E402

if __name__ == "__main__":
    model = build_model()
    path = _model_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)
    print(f"Saved Internship Risk Classifier v1 to {path}")
