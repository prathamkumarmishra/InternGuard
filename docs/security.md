# Security notes

- Set a unique, long `JWT_SECRET` and production MongoDB credentials in managed environment configuration.
- Run the API behind TLS and set the exact `FRONTEND_URL` CORS allow-list.
- Use a managed MongoDB deployment with least-privilege credentials, backups, and network restrictions.
- User passwords are bcrypt-hashed; raw passwords and secrets are not logged.
- Helmet, request-rate limiting, validation, body-size limits, and unsafe-key rejection are enabled.
- Website checks are constrained to public HTTP(S) pages and must not be expanded into security probing.
- This MVP accepts only evidence metadata/URLs. Add malware scanning, encrypted object storage, retention controls, and reviewer access policies before accepting uploads in production.
