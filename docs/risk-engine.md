# C++17 DSA engine

`risk-engine` reads a single JSON request from standard input and writes one JSON response to standard output. The Node API launches it with a five-second timeout and validates returned JSON. A fallback rule engine is clearly labelled when the executable is unavailable or malformed.

The module demonstrates: a Trie for phrase matching; `unordered_map` for company/indicator indexing; substring matching; `lower_bound` binary lookup; `std::sort` ranking; `priority_queue` prioritization; `stack` review history; `queue` pending review work; and a relationship graph traversed with BFS.

Example input:

```json
{"companyName":"Example Technologies","internshipDescription":"Pay registration fee for guaranteed placement","complaintCount":5,"paymentComplaints":3,"websiteSignals":{"companyNameMatch":false}}
```

Example output includes `keywordRisk`, `matchedKeywords`, `complaintRisk`, `relationshipRisk`, `riskSignals`, and `engineVersion`. No output field is a statement of fraud.
