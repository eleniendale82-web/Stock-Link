# System Architecture

## Overview

StockLink is a multi-tenant inventory and marketplace platform built with Next.js 14 (App Router), Prisma, PostgreSQL, Redis, and WebSockets.

## Architecture Diagram

```
Client (Browser)
       │
       ▼
  Next.js App Router
  ├── (public)      → Public marketplace pages
  ├── (auth)        → Authentication pages
  ├── (dashboard)   → Role-based dashboards
  │   ├── owner
  │   ├── manager
  │   ├── seller
  │   ├── customer
  │   ├── delivery
  │   └── admin
  └── api/v1        → REST API routes
       │
       ├── Prisma ORM → PostgreSQL
       ├── Redis       → Caching & sessions
       └── Socket.IO   → Real-time events
```

## Key Design Decisions

- **App Router** with route groups for clean URL structure without group prefix in URLs
- **Role-based access** enforced at middleware level
- **API versioning** under `/api/v1` for forward compatibility
- **Feature-based** folder structure under `src/features/` for co-located logic
