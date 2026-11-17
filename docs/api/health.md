# Health Check API

`GET /api/v1/health` is a public readiness check. It requires no authentication or request body.

## Ready response — HTTP 200

```json
{
  "success": true,
  "message": "Health check passed",
  "data": {
    "status": "healthy",
    "service": "StockLink API",
    "version": "1.0.0",
    "environment": "development",
    "timestamp": "2026-11-08T18:30:00.000Z",
    "uptime": 3600,
    "dependencies": {
      "database": { "status": "connected", "responseTime": 12 }
    }
  },
  "meta": null
}
```

`status` is the overall readiness state; `service` and `version` identify the API; `environment` is development, staging, or production; `timestamp` is server time in ISO 8601 format; `uptime` is process uptime in seconds; `dependencies.database` reports PostgreSQL connectivity and, when connected, query time in milliseconds.

## Not ready response — HTTP 503

```json
{
  "success": false,
  "message": "A critical dependency is unavailable",
  "error": { "code": "SERVICE_UNAVAILABLE" },
  "data": {
    "status": "unhealthy",
    "service": "StockLink API",
    "timestamp": "2026-11-08T18:30:00.000Z",
    "dependencies": { "database": { "status": "disconnected" } }
  },
  "meta": null
}
```

An unexpected internal health-check failure returns HTTP 500 with a generic message. Error details are never included in responses.
