# Database

MongoDB collections are `User`, `Organization`, `Internship`, `Complaint`, `RiskAssessment`, `Verification`, `Evidence`, and `AuditLog`. Organization indices cover name, CIN, domain/website, email, score, and risk level. Complaint/report access is role- and ownership-aware; evidence is represented as metadata/reference records in this MVP rather than raw file uploads.

The seed script deletes only the InternGuard development collections before inserting 20 synthetic organizations, 30 synthetic internships, 50 synthetic reports, verification histories, assessments, and demonstration accounts. Do not run it against production data.
