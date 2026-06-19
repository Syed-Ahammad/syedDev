# syed.dev — Portfolio Website & Community Layer

A full-stack personal platform for Syed Ahammad (full-stack developer, Dubai). It has two jobs:

1. **Convert visitors into clients/interviews** — a fast, polished public portfolio (projects, services, blog, about, contact).
2. **A lightweight community layer** — registered visitors can bookmark projects, endorse skills, and request quotes; an admin dashboard lets Syed manage everything without touching code.

This repo is **both** the deployable site **and** a portfolio artifact — the code and commit history are meant to be read.

> **Status:** Phases 1–3 complete (design, front-end, back-end). Phase 4 (polish & launch) in progress — see [docs/roadmap.md](docs/roadmap.md).

---

## Tech stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript 5** (strict)
- **Tailwind CSS v4** (PostCSS-only, `@theme` tokens) · **next-themes** (dark/light)
- **MongoDB Atlas** + **Mongoose**
- **NextAuth** (Credentials + Google OAuth) — `user` / `admin` roles
- **Zod** + **React Hook Form** for all forms
- **Vercel Blob** uploads · **Upstash Redis** rate limiting · **Recharts** admin analytics
- **Vitest** + **React Testing Library** (unit) · **Playwright** (E2E)

Full rationale: [docs/tech-stack.md](docs/tech-stack.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Mongo, NextAuth, Upstash, Blob keys
npm run seed                 # idempotent: admin + demo user + sample data
npm run dev                  # http://localhost:3000
```

Required environment variables are documented in [docs/deployment-guide.md](docs/deployment-guide.md).

## Common commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run test:watch   # Vitest (watch)
npm run test:e2e     # Playwright (auto-starts dev server)
npm run seed         # Seed the database
```

## Repo layout

```
syedDev/
├── app/            # App Router: public pages, /admin, /dashboard, /api
├── components/     # admin · dashboard · public · ui (one section = one component)
├── lib/            # db, auth, validations (Zod), ratelimit
├── models/         # Mongoose models (User, Project, Lead, Endorsement, …)
├── types/          # Shared TypeScript types + NextAuth augmentation
├── scripts/        # seed.ts, lighthouse.mjs
├── e2e/            # Playwright specs
├── tests/          # Vitest unit tests
├── docs/           # Project documentation (source of truth)
└── frontend/       # Original HTML design references
```

## Roles & route protection

- **`user`** — registered visitor; owns `/dashboard/*`.
- **`admin`** — Syed; owns `/admin/*`.
- `middleware.ts` redirects unauthenticated users; `requireRole()` in `lib/auth.ts` guards every protected API handler. **Both layers — never trust just one.**

> A **Demo User** and **Demo Admin** button on `/login` let recruiters explore both roles instantly (credentials are intentionally public).

## Documentation

| Doc | What it covers |
|-----|----------------|
| [project-scope.md](docs/project-scope.md) | Goals, in/out of v1 |
| [requirements.md](docs/requirements.md) | Functional & non-functional requirements |
| [features-list.md](docs/features-list.md) | Every feature, by priority |
| [user-flow.md](docs/user-flow.md) | Visitor and admin journeys |
| [database-schema.md](docs/database-schema.md) | MongoDB collections (Mongoose) |
| [api-structure.md](docs/api-structure.md) | API routes, contracts & caching rules |
| [tech-stack.md](docs/tech-stack.md) | Tools + design tokens |
| [folder-structure.md](docs/folder-structure.md) | Codebase layout |
| [deployment-guide.md](docs/deployment-guide.md) | Ship it live (Vercel + Atlas) + env vars |
| [testing-checklist.md](docs/testing-checklist.md) | Pre-launch checks |
| [roadmap.md](docs/roadmap.md) | Small-step build plan + future work |
| [changelog.md](docs/changelog.md) | What changed, when |
