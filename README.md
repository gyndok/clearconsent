# ClearConsent

This project is a Next.js prototype for the ClearConsent platform.

## Database Migrations

PostgreSQL is used via [Prisma](https://www.prisma.io/). The schema
is defined in [`prisma/schema.prisma`](prisma/schema.prisma) and the
initial SQL migration is located under [`prisma/migrations`](prisma/migrations).

### Running Migrations

1. Copy `.env.example` to `.env` and update `DATABASE_URL` with your
   PostgreSQL connection string.
2. Install dependencies and run Prisma migrations:

```bash
pnpm install
pnpm prisma migrate deploy
```

This will create the required tables in your database and generate
the Prisma client.
