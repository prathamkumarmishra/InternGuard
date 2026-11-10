# AI model and website signals

The MVP classifier is a scikit-learn pipeline: cleaned internship text → TF-IDF unigrams/bigrams → Logistic Regression → probability → risk band. The service exposes model version `Internship Risk Classifier v1` and uses an interpretable phrase fallback if the trained model cannot load.

Train a persistent artifact with `python training/train_model.py` while in `ai-service`. The included dataset and training examples are small synthetic demonstrations, not a representative production corpus. A production model requires documented labelling criteria, holdout evaluation, bias testing, calibration, versioning, and a review loop.

Website analysis only uses public HTTP(S) content. It rejects non-public IP targets, checks robots policy where available, uses a modest response limit and timeout, and looks for non-invasive indicators like HTTPS, reachability, contact/privacy/terms references, public email addresses, and submitted name visibility. It does not perform penetration testing or assess security posture.
