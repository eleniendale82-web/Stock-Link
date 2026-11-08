# Database Design

StockLink uses **PostgreSQL** via Prisma ORM.

## Design Principles

- UUID primary keys for all entities
- `createdAt` / `updatedAt` timestamps on all tables
- Soft deletes via `deletedAt` where applicable
- Foreign key constraints enforced at DB level
- Indexes on frequently queried columns (userId, businessId, locationId)

## Core Tables

- `users`
- `businesses`
- `locations`
- `members` (user ↔ business join with role)
- `products`
- `categories`
- `inventory_items`
- `stock_movements`
- `orders`
- `order_items`
- `payments`
- `deliveries`
- `notifications`
