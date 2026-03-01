# Repository Guidelines (Microservices Monorepo)

## Project Structure & Module Organization
- This is a microservices monorepo.
- Each top-level folder is a module, grouped by type:
  - `services/` — NestJS backend microservices (e.g., `services/access-service/`)
  - `apps/` — React applications (e.g., `apps/web-app/`)
  - `packages/` — shared libraries (e.g., `packages/shared-types/`, `packages/config/`)
  - `tests/` — cross-service integration/E2E tests and shared test utilities
  - `infra/` — Docker, Kubernetes, IaC, CI helpers (if applicable)

### Service layout (NestJS)
- Keep each service isolated and independently runnable.
- Recommended structure:
  - `services/<service-name>/src/`
  - `services/<service-name>/test/` (unit + e2e where applicable)
  - `services/<service-name>/prisma/` (schema + migrations)
  - `services/<service-name>/README.md` (setup, env, run, test, migrations)

### Shared code
- Put shared DTOs/types, configs, lint rules, and utilities in `packages/`.
- Avoid tight coupling between services:
  - Prefer contracts (DTOs, events, OpenAPI specs) over importing internal service logic.

### Tests & fixtures
- Tests live close to code when possible:
  - `services/<service>/test/`
  - `apps/<app>/src/**/__tests__/`
- Shared fixtures:
  - `tests/fixtures/`
- Module-specific assets/fixtures:
  - `services/<service>/assets/` or `apps/<app>/assets/`

## Build, Test, and Development Commands
- Prefer running commands from the module root.

### NestJS services (Node)
- Install:
  - `npm ci`
- Dev:
  - `npm run start:dev`
- Build:
  - `npm run build`
- Test:
  - `npm test`
  - `npm run test:e2e` (if present)

### React apps
- Install:
  - `npm ci`
- Dev:
  - `npm run dev` or `npm start` (per app)
- Build:
  - `npm run build`
- Test:
  - `npm test`

### Prisma & Postgres
- Prisma is the ORM; each service owns its schema and migrations.
- Common commands (per service):
  - `npx prisma generate`
  - `npx prisma migrate dev`
  - `npx prisma migrate deploy`
  - `npx prisma studio` (optional)

> Keep DB setup documented per service in `services/<service>/README.md`.

## Coding Style & Naming Conventions
- Formatting/linting:
  - Use ESLint + Prettier (and TypeScript defaults) where configured.
  - Run format/lint before committing.
- Indentation: 2 spaces (JS/TS ecosystem default) unless the repo already enforces something else.
- Files: UTF-8 with LF line endings.

### Naming
- Folders/files: kebab-case (e.g., `access-service`, `user.controller.ts`)
- Types/classes/interfaces: PascalCase
- Variables/functions: camelCase
- Env vars: SCREAMING_SNAKE_CASE

### Service design rules
- Keep modules cohesive and boundaries clear:
  - Controllers handle request/transport concerns.
  - Services contain business logic.
  - Repositories/data-access layer isolates Prisma queries.
- Prefer explicit DTOs and validation at boundaries (request, message bus, etc.).
- Avoid sharing database tables across services unless intentionally part of the same bounded context.

## Testing Guidelines
- Write tests for changed behavior; aim for strong coverage on modified code paths.
- Unit tests close to code; integration/E2E tests per module or in root `tests/`.

### NestJS
- Unit tests: `*.spec.ts`
- E2E tests: `test/*.e2e-spec.ts` (or similar)
- Use `@nestjs/testing` and mock external dependencies (DB, network calls) in unit tests.
- For integration tests involving Postgres:
  - Prefer a disposable database (Docker) or test containers.
  - Ensure tests clean up state (transactions/teardown).

### React
- Unit/component tests: `*.test.tsx` / `*.spec.tsx`
- Prefer React Testing Library patterns over implementation-detail tests.

## Commit & Pull Request Guidelines
- Use Conventional Commits:
  - `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
  - Example: `feat(access-service): add role-based access checks`
- One logical change per commit.
- Reference issues where relevant (e.g., `Closes #123`).

### PR requirements
- Include:
  - Summary of changes
  - How to verify (commands + steps)
  - Screenshots/logs for UI/behavior changes
  - Notes on rollout/risk (especially for migrations)

## Security & Configuration
- Never commit secrets.
- Use environment variables; provide `.env.example` per module where needed.
- Validate inputs at boundaries (HTTP, events, queues) using class-validator/zod (as configured).
- Avoid logging PII. Keep test logs minimal.
- For service-to-service communication:
  - Use authenticated channels/credentials (documented per environment).
  - Don’t hardcode URLs, tokens, or connection strings.

## Database & Migration Policy (Postgres + Prisma)
- Each service owns its database schema (or its schema namespace) and Prisma migrations.
- Prisma schema lives in `services/<service>/prisma/schema.prisma`.
- Migrations must be checked into version control.
- Any PR that changes the schema must include:
  - Migration files
  - Updated Prisma client generation instructions (if needed)
  - A short note on migration impact (downtime, backfill, locks)

## Agent-Specific Instructions
- Keep changes minimal and localized to the relevant module (service/app/package).
- Follow existing patterns and structure in that module.
- Update the module `README.md` when setup, env vars, commands, or migrations change.
- Add or update tests whenever behavior changes.