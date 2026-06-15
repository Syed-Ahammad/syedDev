<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# syed.dev — Project Guide for AI Agents

## What this is
**syed.dev** — Syed Ahammad's portfolio + lightweight community layer. Full-stack developer in Dubai. The site has two jobs:
1. Convert visitors into clients/interviews (portfolio).
2. Let registered visitors bookmark projects, endorse skills, request quotes, read blog posts (community).

This repo is **both** the deployable site **and** a portfolio artifact — recruiters read the commit history and code. Keep it tidy.

## Status
- **Phase 1 (design)** ✅ — docs in `docs/`, design HTMLs in `frontend/`.
- **Phase 2 step 2.1 + 2.1a** ✅ — Next.js scaffolded, Vitest + RTL + Playwright wired with one passing test each.
- **Phase 2 step 2.2 onward** ⏳ — see `docs/roadmap.md`. Build one section per step, run/commit, then next.

Check `docs/roadmap.md` before starting work to know which step is next.

## Tech stack
- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (PostCSS-only setup, no `tailwind.config.ts` for v4)
- **MongoDB Atlas** + **Mongoose**
- **NextAuth** (Credentials + Google OAuth) — two roles: `user`, `admin`
- **Zod** + **React Hook Form** for all forms
- **Vercel Blob** for uploads (≤4 MB, image/* validated)
- **Upstash Redis** + `@upstash/ratelimit`
- **next-themes** for dark/light mode (cookie-persisted)
- **Recharts** for admin analytics
- **Vitest** + **React Testing Library** + **jsdom** for unit tests
- **Playwright** for E2E

Full stack table + rationale: `docs/tech-stack.md`.

## Common commands
```bash
npm run dev          # Next dev server (http://localhost:3000)
npm run build        # Production build (Turbopack)
npm run lint         # ESLint
npm test             # Vitest run-once
npm run test:watch   # Vitest watch
npm run test:e2e     # Playwright (auto-starts dev server)
npm run seed         # Idempotent DB seed (admin + demo user + sample data) — added in Phase 3
```

After meaningful changes, run `npm run lint && npm test && npm run build` before committing. For UI changes also `npm run test:e2e`.

## Where to find what
| Question | Read |
|---|---|
| What are we building (scope, goals, users)? | `docs/project-scope.md` |
| What's the feature list / priorities? | `docs/features-list.md` |
| What are the functional / non-functional requirements? | `docs/requirements.md` |
| What's the data model? | `docs/database-schema.md` |
| What API routes exist + caching/revalidation rules? | `docs/api-structure.md` |
| Where does code live (folder map)? | `docs/folder-structure.md` |
| What's the user journey through the app? | `docs/user-flow.md` |
| What's the build sequence? | `docs/roadmap.md` |
| How do we deploy + what env vars are required? | `docs/deployment-guide.md` |
| What must pass before release? | `docs/testing-checklist.md` |
| How does the spec map to the grading rubric? | `docs/rubric-compliance.md` |

## Roles & route protection
- **`user` role** — registered visitor. Owns `/dashboard/*`.
- **`admin` role** — Syed. Owns `/admin/*`.
- `middleware.ts` redirects unauth users; `requireRole()` in `lib/auth.ts` guards every protected API handler. **Both layers — never trust just one.**

## Conventions (load-bearing — follow these)
1. **One section = one component.** `page.tsx` only composes; no logic inside.
2. **Components < ~150 lines.** If bigger, split.
3. **Server components by default.** Add `"use client"` only where state/interaction needs it (forms, charts, theme toggle).
4. **All validation in `lib/validations.ts`** — never duplicate Zod rules between client and server.
5. **No `any`.** Shared types in `types/`. NextAuth `Session.user` extended with `role` and `id` (declared in `types/next-auth.d.ts`).
6. **Name things by what they do** (`LeadTable`, not `Card2`).
7. **One step → run → commit → next step** (`docs/roadmap.md`). Repo never stays broken > 30 min.
8. **No `console.log` in production code.** No placeholder/lorem-ipsum content.
9. **All cards same width/height/radius/layout.** Desktop 4-per-row. Skeleton loaders for every data-fetched grid.
10. **Every form** has: label-connected inputs, client + server validation, loading state, success + error messages.

## Gotchas
- **Tailwind v4 is PostCSS-only here** — no `tailwind.config.ts`. Theme tokens live in `app/globals.css` via `@theme`. Don't recreate the v3 config file.
- **Next.js 16 changed APIs from your training data** — Read `node_modules/next/dist/docs/` for the route handler / metadata / dynamic-route signatures before writing code.
- **The directory is `D:\syedDev\` (capital D)**. `npm`/`create-next-app` rejects capital letters in package names — the scaffold workaround is recorded in `package.json` (`"name": "syed-portfolio"`). Don't try to rename the directory.
- **MongoDB Profile singleton** uses `_id: 'singleton'` — never insert a second profile doc. Always `Profile.findByIdAndUpdate('singleton', patch, { upsert: true, new: true })`.
- **Demo login credentials are intentionally public** (exposed as `NEXT_PUBLIC_DEMO_*` in client bundle). That's the point of "Demo User / Demo Admin" buttons. See `docs/deployment-guide.md` §3.
- **PostCSS config** is `postcss.config.mjs`, not `.js`. Same for ESLint flat config (`eslint.config.mjs`).
- **Path alias** `@/*` → repo root (configured in `tsconfig.json` and mirrored in `vitest.config.ts`).
- **Playwright autostart**: `playwright.config.ts` runs `npm run dev` via `webServer` — don't start a separate dev server before `npm run test:e2e`.

## Tool / library docs
For any library/framework question, prefer **Context7 MCP** (`mcp__context7__resolve-library-id` then `mcp__context7__query-docs`) over assumptions from training data — Next.js 16, Tailwind v4, NextAuth v5 all have recent breaking changes.

## Commit etiquette
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`.
- Small, frequent commits. Recruiters read the history.
- Never commit without running lint + tests + build (see Common commands).
- Never use `--no-verify` or `--no-gpg-sign` unless explicitly instructed.

## When in doubt
- Check `docs/` first (it's the source of truth — kept in sync with code).
- For Update-1 rubric questions, check `docs/rubric-compliance.md`.
- Ask the user before destructive operations (delete, rebase, force-push, schema drop).
