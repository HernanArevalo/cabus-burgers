# CABUS - Database Setup Guide

## Overview

The backend uses **PostgreSQL** with **Prisma ORM** on **Supabase**. The frontend has been updated to make API calls instead of using mock data.

## Environment Variables

Make sure these environment variables are set in your `.env.local`:

```env
# Supabase Database URLs (provided by Supabase integration)
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
```

If using Neon instead of Supabase:
```env
DATABASE_URL=postgresql://...
```

## Setup Steps

### 1. Generate Prisma Client

The Prisma client is automatically generated when you build, but you can also generate it manually:

```bash
npm run db:generate
```

### 2. Push the Schema to Database

This creates all the tables in your PostgreSQL database:

```bash
npm run db:push
```

### 3. Seed Initial Data (Optional)

Populate the database with sample products, categories, and other data:

```bash
npm run db:seed
```

This seed script creates:
- Store configuration
- Categories (Hamburguesas, Papas, Bebidas, Combos)
- Products with variants and extras
- Shipping and payment methods
- Sample orders

### 4. Run the Development Server

```bash
npm run dev
```

The app will now:
- Fetch real data from the database via API routes
- Allow admin panel CRUD operations to persist to the database
- Store orders in the database

## Architecture

### Database Layer
- `/prisma/schema.prisma` - Complete schema definition
- `/lib/prisma.ts` - Prisma client singleton

### API Routes (Server)
- `/app/api/products` - Product CRUD
- `/app/api/categories` - Category CRUD
- `/app/api/extras` - Extras CRUD
- `/app/api/orders` - Order CRUD with status management
- `/app/api/shipping-methods` - Shipping methods
- `/app/api/payment-methods` - Payment methods
- `/app/api/store` - Store configuration

### Frontend (Client)
- `/lib/api.ts` - API client functions (async, no SWR)
- Components fetch data in `useEffect` and maintain local state
- Cart and checkout use in-memory context until order is submitted

## Key Models

### Product
- Has many variants (Simple/Doble, Chica/Grande, etc.)
- Each variant has its own price
- Many-to-many relationship with extras
- Belongs to a category

### Order
- Contains items with selected variants and extras
- Tracks customer info, shipping method, and payment method
- Has 7 possible statuses: PENDIENTE → CONFIRMADO → EN_PREPARACION → LISTO → ENVIADO → ENTREGADO
- Can be marked as CANCELADO

### Category
- Groups products
- Can be active/inactive
- Ordered visually

## Troubleshooting

### "Module not found: Can't resolve '@prisma/client'"

Run: `npm run db:generate`

### "Error: connect ECONNREFUSED" 

Your database connection URL is invalid. Check that:
1. The `POSTGRES_PRISMA_URL` env var is correctly set
2. Your Supabase/Neon project is active
3. You have network access to the database

### "Table already exists"

If you've already pushed the schema, running `db push` again is safe - it will only apply new changes.

### Orders not persisting

Make sure:
1. The API routes are working (`/api/orders`)
2. The database connection is active
3. Check browser console for fetch errors

## Next Steps

1. **Customize Store Config**: Update values in admin panel at `/admin`
2. **Add Products**: Use admin panel to create products with variants
3. **Configure Shipping & Payment**: Set up methods in admin panel
4. **Test Orders**: Place test orders and manage them in admin dashboard
