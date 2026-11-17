# Products API

`GET /api/v1/products` returns a public, paginated product list. It does not require authentication. Products soft-deleted with `deletedAt`, products assigned to inactive or deleted categories, and products belonging to deleted businesses are excluded. The schema has no publish or stock status, so this endpoint does not apply those filters or expose `businessId`.

## Query parameters

| Parameter | Behavior |
|---|---|
| `page` | Positive integer, default `1` |
| `limit` | Positive integer, default `10`, maximum `100` |
| `search` | Case-insensitive match against name, description, or SKU |
| `categoryId` | Category UUID |
| `minPrice`, `maxPrice` | Inclusive non-negative price bounds; minimum must not exceed maximum |
| `sortBy` | `createdAt`, `price`, or `name`; defaults to `createdAt` |
| `sortOrder` | `asc` or `desc`; defaults to `desc` |

All supplied filters combine. Invalid values return HTTP 422 with `VALIDATION_ERROR`. Empty matches return HTTP 200 and an empty `data` array. Database errors use the shared sanitized error format; recognized temporary connection errors return HTTP 503 and unexpected errors return HTTP 500.

## Success response

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

Product records use the existing `images` field and include category `id` and `name`. Prices are serialized as numbers from the database decimal values.

The repository had a Category model but no Product or Business models. Product and Business models and migrations were added using the existing TypeScript types and relationship documentation. Apply migrations and regenerate Prisma Client before starting the endpoints:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Product details

`GET /api/v1/products/:id` returns a single public product and is also unauthenticated. IDs must be UUIDs. Product images are returned in their stored array order; the category includes its ID, name, and slug; the `shop` object includes only public business ID, name, description, logo URL, and verification status. Products that are soft-deleted or belong to a deleted business or hidden category are returned as 404.

The current schema has one product price and no currency or variant model, so the details response returns only `price` and does not invent currency or a price range. It also has no separate image model, shop slug, location, or public contact fields.
