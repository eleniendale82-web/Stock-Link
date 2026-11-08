# Coding Conventions

## TypeScript

- Strict mode enabled
- Prefer `interface` for object shapes, `type` for unions/intersections
- No `any` — use `unknown` and narrow

## Naming

- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Constants: `SCREAMING_SNAKE_CASE`
- Variables/functions: `camelCase`

## Components

- One component per file
- Co-locate feature components under `src/features/<domain>/`
- Shared components under `src/components/`

## API Routes

- All under `src/app/api/v1/`
- Use `successResponse` / `errorResponse` from `src/lib/api-response.ts`
- Validate input with Zod schemas
