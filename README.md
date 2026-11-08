# StockLink

A multi-tenant inventory management and marketplace platform built with Next.js 14, Prisma, PostgreSQL, and Redis.

## Features

- **Multi-role dashboards** — Owner, Manager, Seller, Customer, Delivery, Admin
- **Inventory management** — stock tracking, movements, adjustments, transfers
- **Marketplace** — product listings, search, inquiries, orders
- **Real-time** — notifications and live updates via WebSockets
- **Maps** — shop locator with geographic search

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma |
| Cache | Redis |
| Auth | NextAuth.js |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Validation | Zod |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker-compose up
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check |
| `npm test` | Run tests |
| `npm run db:studio` | Open Prisma Studio |

## Documentation

- [System Architecture](docs/architecture/system-architecture.md)
- [API Specification](docs/api/api-specification.md)
- [Database Design](docs/database/database-design.md)
- [Coding Conventions](docs/development/coding-conventions.md)
- [Git Workflow](docs/development/git-workflow.md)

## License

See [LICENSE](LICENSE).
