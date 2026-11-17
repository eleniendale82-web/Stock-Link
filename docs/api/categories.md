# Categories API

`GET /api/v1/categories` returns active, non-deleted categories for browsing and filtering. It is publicly accessible and does not require authentication.

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category-id",
      "name": "Electronics",
      "slug": "electronics",
      "description": null,
      "image": null
    }
  ],
  "meta": null
}
```

An empty database result returns HTTP 200 with `data: []`. Unexpected database errors return a sanitized HTTP 500 response; Prisma errors recognized as temporary database availability failures return HTTP 503. Categories are returned by name, with ID as a deterministic tie-breaker. A Product relation now exists in the schema, but this endpoint omits product counts because they are not required for its response.

Errors use the shared envelope and never include database details:

```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "error": { "code": "INTERNAL_ERROR" },
  "data": null,
  "meta": null
}
```

The schema and initial migration create the categories table. Apply migrations and regenerate Prisma Client before running the API:

```bash
npx prisma migrate deploy
npx prisma generate
```
