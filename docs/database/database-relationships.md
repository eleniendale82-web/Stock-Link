# Database Relationships

## Key Relationships

```
User 1──* Member *──1 Business
Business 1──* Location
Business 1──* Product
Product *──1 Category
Location 1──* InventoryItem *──1 Product
InventoryItem 1──* StockMovement
User(customer) 1──* Order
Order 1──* OrderItem *──1 Product
Order 1──1 Payment
Order 1──1 Delivery
```

## Role Membership

A `Member` record links a `User` to a `Business` with a specific role:
- `owner` — full control over the business
- `manager` — inventory and operations
- `seller` — POS and sales
- `delivery` — assigned deliveries
