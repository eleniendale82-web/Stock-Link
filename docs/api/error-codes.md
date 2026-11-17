# Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body failed validation |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVICE_UNAVAILABLE` | 503 | A required dependency is unavailable |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

Prisma known errors are translated to safe public errors: unique constraints (`P2002`) map to `CONFLICT`, missing records (`P2025`) map to `NOT_FOUND`, relation constraints (`P2003`, `P2014`) map to `VALIDATION_ERROR`, and database availability/timeouts (`P1001`, `P1002`, `P1008`, `P2024`) map to `SERVICE_UNAVAILABLE`. Raw database messages and metadata are not returned.
