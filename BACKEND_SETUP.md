# Backend Setup (Prisma + PostgreSQL)

1. Copy env vars:

```bash
cp .env.example .env
```

2. Set your PostgreSQL credentials in `.env`.

3. Install deps:

```bash
pnpm install
```

4. Initialize Prisma:

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

5. Start app:

```bash
pnpm dev
```

## APIs wired to DB

- `GET /api/store`
- `GET /api/categories?active=true`
- `GET /api/products?inStock=true`
- `POST /api/orders`
