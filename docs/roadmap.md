# Roadmap — small, manageable steps

Each step is sized to finish in one sitting, leaves the app working, and ends with a commit. Never start a step before the previous one runs.

> **Rule of thumb:** One step → run it → commit it → next step. If a step feels big, split it again.

## Phase 1 — Design ✅
- [x] 1.1 Public portfolio design (HTML reference)
- [x] 1.2 Admin dashboard design (HTML reference)
- [x] 1.3 Documentation set (incl. Update-1 Path B revision)

## Phase 2 — Front-end build (one section at a time)
- [x] 2.1 Scaffold: `create-next-app` (TS + Tailwind v4 + ESLint) — runs locally
- [x] 2.1a Set up Vitest + RTL + Playwright (one trivial passing test each); add `test`, `test:e2e` scripts
- [x] 2.2 Add fonts + design tokens + dark/light theme variables to Tailwind config + globals
- [x] 2.2a Wire `next-themes` (`ThemeProvider` in root layout + `ThemeToggle` in navbar)
- [x] 2.3 Public `Navbar` (logged-out variant) — sticky, ≥4 routes, dark-mode toggle
- [x] 2.4 Build `Hero` (60-70vh, static first, animation after — one interactive element)
- [x] 2.5 Build `Highlights` + `StackStrip` (marquee)
- [x] 2.6 Build `FeaturedProjects` + `ProjectCard` (4-per-row desktop, skeleton loader) using **mock data**
- [x] 2.7 Build `Services` cards
- [x] 2.8 Build `Stats` (animated counters)
- [x] 2.9 Build `EndorsementsWall` (mock data — same card grid rules)
- [x] 2.10 Build `BlogPreview` (3 latest mock posts)
- [x] 2.11 Build `Faq` accordion + `Newsletter` band
- [x] 2.12 Build `ContactForm` (UI only, no submit yet) + `Footer`
- [x] 2.13 Compose all into `app/page.tsx` (≥8 sections); responsive pass (320 → 1440)
- [x] 2.14 Build `/projects` listing UI (search + filter chips + sort + pagination — URL-driven, mock data)
- [x] 2.15 Build `/projects/[slug]` detail UI (overview / key info / endorsements / related — mock)
- [x] 2.16 Build `/blog` index + `/blog/[slug]` detail (mock Markdown)
- [x] 2.17 Build `/about` + `/contact` pages
- [x] 2.18 Build `/login` (credentials form + Google button + 2 demo buttons) + `/register` (UI only)
- [x] 2.19 Admin shell: `Sidebar` + `app/admin/layout.tsx` (no auth yet, mock session); 7 menu items
- [x] 2.20 User dashboard shell: `Sidebar` + `app/dashboard/layout.tsx` (mock session); 5 menu items
- [x] 2.21 Profile dropdown component (used in both dashboards)
- [x] 2.22 Admin pages with mock data: overview, projects table + `ProjectForm`, leads table, blog table + `BlogForm`, endorsement queue, users table, analytics (3 chart types with mock data)
- [x] 2.23 User dashboard pages with mock data: overview, bookmarks, endorsements (with submit form), quotes (with submit form), profile editor
- [x] 2.24 Add Framer Motion reveals + reduced-motion check
- [x] 2.25 Lighthouse pass (Performance / Accessibility / SEO > 90 in both themes)
- [ ] 2.26 Deploy this UI version to Vercel ✦ *(already shareable!)*

## Phase 3 — Back-end (one route at a time)
- [x] 3.1 `lib/db.ts` cached Mongo connection + test ping
- [x] 3.2 Models: `User`, `Project`, `Lead` (these three first)
- [x] 3.3 `GET /api/projects` (with search/filter/sort/pagination) → swap mock for real
- [x] 3.4 `GET /api/projects/[slug]` + related projects → wire detail page
- [x] 3.5 `POST /api/leads` + Zod validation → wire ContactForm
- [x] 3.6 NextAuth setup: Credentials provider + `session.user.role` augmentation
- [x] 3.6a `POST /api/auth/register` (Zod, bcrypt) → wire Register page
- [x] 3.6b Google OAuth provider — auto-creates `user` role on first sign-in
- [x] 3.7 `scripts/seed.ts` (idempotent): admin user + demo user + Profile singleton + sample projects + sample blog posts; add `"seed": "tsx scripts/seed.ts"` script
- [x] 3.7a Wire **Demo User** and **Demo Admin** buttons on `/login` (read from `NEXT_PUBLIC_DEMO_*` env)
- [x] 3.8 `middleware.ts` → role-aware redirects (`/admin/*` → admin only; `/dashboard/*` → user/admin; logged-in users skipping `/login` → their dashboard)
- [x] 3.9 `requireSession()` + `requireRole()` helpers → guard all `/api/admin/*` and `/api/user/*`
- [x] 3.10 Admin leads CRUD (`GET`, `PATCH`, `DELETE`)
- [x] 3.11 Admin projects CRUD
- [x] 3.11a `POST /api/admin/upload` (Vercel Blob, ≤4 MB, image/*) → wire `ProjectForm` and user avatar upload
- [x] 3.12 Models: `Endorsement`, `Bookmark`, `BlogPost`
- [x] 3.13 User bookmarks routes → wire `/dashboard/bookmarks` + "Bookmark" buttons on detail page
- [x] 3.14 User endorsements routes (rate-limited 10/hr/user) → wire submit form
- [x] 3.15 Admin endorsements moderation routes + atomic `endorsementCount` update → wire queue
- [x] 3.16 Public `GET /api/endorsements?projectId=` → wire `EndorsementsWall` + detail page
- [x] 3.17 Admin blog CRUD + public `GET /api/blog` & `GET /api/blog/[slug]` → wire blog pages
- [x] 3.18 User quote requests route → wire `/dashboard/quotes`
- [x] 3.19 User profile route (incl. avatar upload) → wire `/dashboard/profile`
- [x] 3.20 Admin users route (list / role change / suspend / delete with cascade) → wire `/admin/users`
- [x] 3.21 Admin stats route → real overview numbers
- [x] 3.22 Admin analytics route → wire 3 charts (signups/leads/endorsements)
- [x] 3.23 `revalidatePath` after all admin writes per `api-structure.md` table
- [x] 3.24 `Profile` editor (admin) → wire (+ public Hero/FAQ/Footer/About/Stack now read the singleton)
- [x] 3.25 `lib/ratelimit.ts` (Upstash) → apply to `/api/leads`, `/api/auth/register`, `authorize()`, `/api/user/endorsements` (+ quote requests)

## Phase 4 — Polish & launch
- [x] 4.1 Toasts, loading skeletons, empty states across every page
- [x] 4.2 SEO: metadata, OG image, sitemap (auto-includes blog + projects), robots.txt
- [x] 4.2a Write Playwright specs: `e2e/contact`, `e2e/auth`, `e2e/demo-login`, `e2e/projects` (search/filter/sort), `e2e/endorsements`, `e2e/bookmarks`, `e2e/blog`, `e2e/dark-mode`
- [ ] 4.3 Full testing-checklist pass (`npm run lint && npm run test && npm run test:e2e && npm run build`)
- [ ] 4.4 Real content: project screenshots, CV link, real socials, 3+ real blog posts, 5+ FAQ
- [ ] 4.5 Deploy → custom domain → **v1.0.0** 🎉
- [ ] 4.6 Update `rubric-compliance.md` with live demo URL + final screenshot links
- [ ] 4.7 Share on LinkedIn / add to Fiverr & Upwork profiles

## Phase 5 — Growth (later)
- [ ] Chatbot (AI assistent)
- [ ] Email notification on new lead (Resend)
- [ ] Manager / 3rd role
- [ ] Threaded comments on blog
- [ ] Multi-language (EN/BN/AR)
- [ ] Stripe / payment for quote requests
- [ ] Full analytics (sources, top pages)
