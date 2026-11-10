# Architecture

InternGuard is a four-service local architecture: Next.js renders the user interface; Express coordinates identity, persistence, validation, scoring, and audit events; FastAPI supplies explainable ML/public-page signals; and a C++ process supplies deterministic DSA signals over a stable JSON contract.

The Express service is intentionally resilient: if the local C++ executable or AI service is unavailable, it records a labelled fallback result rather than failing silently. Production operations should monitor those fallbacks and fix the underlying dependency.

```mermaid
sequenceDiagram
  participant U as User
  participant W as Next.js
  participant A as Express API
  participant M as MongoDB
  participant P as FastAPI
  participant C as C++ engine
  U->>W: Submit check
  W->>A: REST request
  A->>M: Retrieve organization/reports
  A->>P: Analyze text/site
  A->>C: JSON screening input
  P-->>A: Explainable AI signals
  C-->>A: Keyword/report/relationship signals
  A->>M: Persist assessment and evidence
  A-->>W: Score, factors, signals, recommendations
```

All scores are screening signals, not legal fraud determinations.
