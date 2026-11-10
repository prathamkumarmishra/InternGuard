# API reference

Base URL: `http://localhost:8080/api`. JSON requests use `Content-Type: application/json`; protected endpoints require `Authorization: Bearer <JWT>`.

## Auth

- `POST /auth/register` — `{ fullName, email, password, role? }`; only `STUDENT` and `ORGANIZATION` roles can self-register.
- `POST /auth/login` — `{ email, password }` returns a token and safe user profile.
- `GET /auth/me` — authenticated profile.

## Organizations and internships

- `GET /organizations?q=&riskLevel=&state=&registrationStatus=&page=&limit=` — paginated public directory.
- `POST /organizations` — organization/admin/verifier roles.
- `GET /organizations/:id` — organization plus recent assessments, internships, and report summary.
- `PUT /organizations/:id` — organization/admin/verifier roles.
- `GET /internships?q=&page=&limit=` and `GET /internships/:id` are public.
- `POST /internships` — organization/admin/verifier roles.

## Screening

- `POST /verification/company` — name, CIN, website, or email. Reports `MATCHED`, `NEEDS_REVIEW`, or `NOT_FOUND` with source-aware signals.
- `POST /verification/website` — `{ website, companyName?, organizationId? }`. It only checks public, unauthenticated pages.
- `POST /analysis/internship` — `{ description, title?, recruiter_email? }` returns model probability, score, indicators, explanations, and model version.
- `POST /analysis/complaint` — description-based category suggestion.
- `POST /risk/assessment` — authenticated. Requires `organizationId`; supports internship, text, recruiter, and website context. Returns the persisted explainable assessment.
- `GET /risk/history?page=&limit=` — authenticated. Returns the requesting user's saved assessments, newest first.
- `GET /risk/:organizationId` — recent assessments.

## Reports and administration

- `GET/POST /complaints` — authenticated. Students see only their own reports; reviewers/admins see the review set.
- `GET /complaints/:id` — owner or reviewer/admin.
- `GET /admin/dashboard`, `/admin/reviews`, `/admin/analytics`, `/admin/audit-logs` — admin/verifier roles.
- `PUT /admin/reviews/:id` — update moderated report status.
- `PUT /admin/organizations/:id/status` — update organization verification status and write an audit event.

Errors use `{ error: { message, details? } }` and validation failures return HTTP 422.
