# ER Diagram

> Full ER diagram to be generated from `prisma/schema.prisma` once models are defined.

## Core Entities

- **User** — all platform users; role determines access
- **Business** — owned by a User with role `owner`
- **Location** — physical branch of a Business
- **Member** — User assigned to a Business with a role
- **Product** — item catalog entry for a Business
- **Category** — hierarchical product classification
- **InventoryItem** — stock level of a Product at a Location
- **StockMovement** — record of every stock change
- **Order** — customer purchase
- **OrderItem** — line item on an Order
- **Payment** — payment record linked to an Order
- **Delivery** — fulfillment record for an Order
