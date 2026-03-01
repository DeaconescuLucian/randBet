# Access Service (NestJS)

User registration and login service using JWT. Owns its database (User and UserPassword tables) via Prisma + Postgres.

## Quick Start
- Install deps: `npm ci`
- Env: copy `.env.example` to `.env` and set values
- DB (dev): ensure Postgres is running; update `DATABASE_URL`
- Generate client: `npx prisma generate`
- Migrate: `npx prisma migrate dev --name init`
- Dev: `npm run start:dev`

## Environment
- `DATABASE_URL` (required): Postgres URL (e.g., `postgresql://user:pass@localhost:5432/access_service`)
- `JWT_SECRET` (required): secret for JWT signing
- `JWT_EXPIRES` (optional, default `60m`)

## API
- `POST /api/v1/auth/register` { email, password } → 201
- `POST /api/v1/auth/login` { email, password } → { accessToken, tokenType }
- `GET /api/v1/auth/me` (Bearer token) → { id, email }

## Scripts
- `npm run start:dev` – watch mode
- `npm run build` / `npm run start:prod` – build and run compiled app
- `npm test` – unit tests (placeholder)

## Migrations
- Update schema in `prisma/schema.prisma`, then run `npx prisma migrate dev`.
- Commit migration files under `prisma/migrations/`.
