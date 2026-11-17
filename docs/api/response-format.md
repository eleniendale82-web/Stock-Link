# Response Format

## Success

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": { "id": "product-123", "name": "White Rice" },
  "meta": null
}
```

## Paginated Success

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [{ "id": "product-1", "name": "White Rice" }],
  "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
}
```

## Error

```json
{
  "success": false,
  "message": "Request validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [{ "field": "name", "message": "Name is required" }]
  },
  "data": null,
  "meta": null
}
```

Error `details` is optional and is primarily used for field-level validation issues. Unexpected errors return a generic message; internal exception details are logged by name only and are never included in the response.
