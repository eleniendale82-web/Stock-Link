# API Specification

Base URL: `/api/v1`

All responses follow the standard format defined in `docs/api/response-format.md`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/config/public` | Public app config |
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/register` | Register user |
| GET | `/users/me` | Get current user |
| GET | `/products` | List products |
| GET | `/products/:id` | Get product |
| GET | `/categories` | List categories |
| GET | `/businesses` | List businesses |
| GET | `/inventory` | Get inventory |
| POST | `/orders` | Create order |
| GET | `/orders/:id` | Get order |
