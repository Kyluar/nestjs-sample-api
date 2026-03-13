# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `pnpm` as the package manager.

```bash
# Development
pnpm start:dev          # Watch mode with hot-reload (loads .env.development)
pnpm build              # Compile TypeScript to dist/

# Testing
pnpm test               # Unit tests (sequential)
pnpm test:watch         # Unit tests in watch mode
pnpm test:cov           # Unit tests with coverage
pnpm test:e2e           # E2E tests

# Code quality
pnpm lint               # Biome check with auto-fix (src/ and test/)
pnpm format             # Biome format (src/ and test/)

# Commits
pnpm commit             # Interactive commit via gitmoji-cli (triggers lint-staged + commitlint)

# Prisma (wraps prisma CLI with correct env)
pnpm prisma:dev <cmd>   # e.g. pnpm prisma:dev migrate dev
pnpm prisma:test <cmd>  # e.g. pnpm prisma:test migrate reset

# Docker (via makefile)
make build              # Incremental Docker build
make fresh-build        # Build without cache
make up                 # Create and start containers
make logs               # Stream container logs
make down               # Remove containers
make clean              # Remove containers and volumes
```

**Environment files:** `.env.development`, `.env.test`, `.env.production` — see `.env.example` for required variables.

## Architecture

**Stack:** NestJS 11 + TypeScript, MySQL, Prisma ORM, Zod validation, Passport JWT, Swagger.

**Pattern:** `Repository → Service → Controller` with interface-driven services (`IUserService`, `IPostService` in `src/lib/types/`).

**Module structure:**
- `src/modules/` — Feature modules: `auth`, `user`, `post`, `health`
- `src/lib/` — Shared infrastructure:
  - `config/env/` — Zod-validated environment config loaded at startup
  - `config/prisma/` — Extended Prisma client with custom model extensions (e.g., `User.authenticate()`)
  - `dtos/` — Zod-based DTOs for request validation
  - `filters/` — Global Prisma exception filter
  - `pipes/` — Global Zod validation pipe
  - `decorators/` — `@Public()` to bypass the global JWT guard

**Auth flow:** All routes are JWT-protected by default (global `JwtAuthGuard`). Mark public routes with `@Public()`. JWT payload: `{ sub: userUuid }`.

**Swagger:** Available at `/api` in development. Bearer token auth is documented.

**Docker (production):** Multi-stage Dockerfile in `docker/dockerfile`. `entrypoint.sh` runs `prisma migrate deploy` + `prisma db seed` before starting the app. Orchestrated via `docker/docker-compose.prod.yml`.

**Path alias:** `@/*` maps to `src/*` (configured in `tsconfig.json`).

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) with a gitmoji prefix:

```
:emoji: type(scope): title
```

**Examples:**
```
:sparkles: feat(auth): add refresh token support
:bug: fix(user): correct password hashing on update
:recycle: refactor(post): extract repository interface
:memo: docs(readme): update setup instructions
:white_check_mark: test(user): add e2e tests for delete endpoint
```

**Common types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

**Scope:** module or area affected (e.g., `auth`, `user`, `post`, `prisma`, `docker`)

**Tooling:** Husky enforces the convention automatically:
- `pre-commit` — runs `lint-staged` (Biome check on staged `.ts` files)
- `commit-msg` — runs `commitlint` to validate the message format

Use `pnpm commit` for the interactive gitmoji-cli flow, which generates the correct format and triggers both hooks.
