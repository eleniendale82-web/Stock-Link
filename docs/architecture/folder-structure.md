# Folder Structure

See the root-level directory tree for a full overview. Key conventions:

- `src/app/` — Next.js App Router pages and API routes
- `src/features/` — Feature modules (components, hooks, actions, schemas per domain)
- `src/components/` — Shared UI components (not feature-specific)
- `src/lib/` — Utility libraries (prisma client, auth, logger, etc.)
- `src/types/` — Shared TypeScript type definitions
- `src/config/` — App-wide configuration constants
- `prisma/` — Database schema, migrations, seed
- `tests/` — Unit, integration, API, and e2e tests
