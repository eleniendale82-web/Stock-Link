# Git Workflow

## Branches

- `main` — production-ready code
- `develop` — integration branch
- `feature/<name>` — new features
- `fix/<name>` — bug fixes
- `chore/<name>` — non-feature work (deps, config)

## Commit Convention

```
type(scope): short description

Types: feat | fix | chore | docs | refactor | test | style
```

## PR Process

1. Branch from `develop`
2. Open PR against `develop`
3. At least 1 review approval required
4. Merge with squash
