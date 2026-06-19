# Testing Checklist

Run before every release.

## Automated (must pass before manual QA)
- [x] `npm run lint` clean
- [x] `npm run test` — Vitest unit suite (validations, ratelimit, auth role guards, components) green
- [x] `npm run test:e2e` — Playwright `contact`, `auth`, `demo-login`, `projects`, `endorsements`, `bookmarks`, `blog`, `dark-mode` specs green
- [x] `npm run build` — no type errors

## Public site
- [ ] Home page renders ≥8 sections in order
- [ ] Hero is 60-70vh on desktop; one interactive element present (animated headline / rotating chips)
- [ ] Hero animation respects `prefers-reduced-motion`
- [ ] All sections render 320px → 1440px+ without overflow
- [ ] All card grids: same width/height/border-radius, 4-per-row desktop, 1-per-row mobile
- [ ] Skeleton loaders show while data is loading (projects, blog, endorsements)
- [ ] Empty states show on no data (no leads / no projects / no blog)
- [ ] Projects show only `live` / `in-progress` (never `draft`)
- [ ] Project listing: search returns filtered results
- [ ] Project listing: ≥2 filter fields (stack, type) work
- [ ] Project listing: sort (recent / most-endorsed) reorders results
- [ ] Project listing: pagination works (URL reflects page)
- [ ] Project detail page has 4 sections: Overview, Key info, Endorsements, Related
- [ ] Blog index lists posts newest first
- [ ] Draft blog posts hidden publicly
- [ ] Contact form: empty/invalid fields show inline errors
- [ ] Contact form: valid submit shows success toast + state
- [ ] Submitted lead appears in admin inbox as `new`
- [ ] Form keeps user input after server error
- [ ] CV download links to live Blob URL
- [ ] Keyboard-only navigation works; focus visible
- [ ] Meta title/description + OG image correct (test share on WhatsApp/LinkedIn)
- [ ] Sitemap includes all projects + blog posts
- [ ] Lighthouse (both themes): Performance > 90 · Accessibility > 90 · SEO > 90

## Dark / light mode
- [ ] Toggle in navbar switches theme instantly
- [ ] Preference persists across reload (cookie)
- [ ] First visit respects `prefers-color-scheme`
- [ ] No flash of wrong theme on page load (SSR-aware)
- [ ] All text meets WCAG AA contrast in both modes
- [ ] All accents (coral / teal / gold) remain brand-consistent

## Navbar
- [ ] Logged-out: ≥4 routes (Home, Projects, Blog, About, Login)
- [ ] Logged-in: ≥6 routes incl. profile dropdown (Profile, Settings, Logout)
- [ ] Sticky position on scroll
- [ ] Fully responsive (hamburger on mobile)

## Auth — registration & login
- [ ] `/register`: rejects existing email (409)
- [ ] `/register`: rejects weak password (< 8 chars or no number)
- [ ] `/register`: success → auto sign-in → role-based redirect
- [ ] `/login` Demo User button → autofills + signs in → `/dashboard`
- [ ] `/login` Demo Admin button → autofills + signs in → `/admin`
- [ ] Google OAuth → creates `user` doc on first sign-in
- [ ] Wrong password → clear error, no crash
- [ ] Session survives refresh; logout re-protects routes
- [ ] Suspended user cannot sign in

## Role-based routing
- [ ] Anonymous: `/admin` and `/dashboard` redirect to `/login?next=...`
- [ ] `user` role: `/admin/*` returns 403 / redirects to `/dashboard`
- [ ] `admin` role: can access both `/admin` and `/dashboard`
- [ ] Logged-in user hitting `/login` → bounced to their dashboard

## User dashboard
- [ ] Sidebar has ≥4 menu items + profile dropdown
- [ ] Overview shows real counts (bookmarks, endorsements, quotes)
- [ ] Bookmark a project from detail page → appears in `/dashboard/bookmarks`
- [ ] Remove bookmark → disappears
- [ ] Submit endorsement → appears as `pending` in dashboard
- [ ] Endorsement cannot be submitted for a skill the user already endorsed (unique constraint)
- [ ] Quote request → appears in `/dashboard/quotes` AND in admin leads as `source: quote-request`
- [ ] Profile edit: name, bio, avatar (Blob upload) save and persist

## Admin dashboard
- [ ] Sidebar has ≥6 menu items + profile dropdown
- [ ] Overview counts match reality (new leads, projects, pending endorsements)
- [ ] Unread badge updates when a lead is opened
- [ ] Lead status flow works: new → read → replied → closed
- [ ] Leads table: filter + pagination work
- [ ] Project create → appears in table → set `live` → appears publicly (revalidation)
- [ ] Project edit (incl. slug change) updates public site, old slug 404s
- [ ] Project image upload (≤4 MB image/*) → Blob URL stored
- [ ] Project delete removes it everywhere
- [ ] Blog: create draft → preview works → publish → appears on `/blog`
- [ ] Endorsement approve → project's endorsementCount++; appears on detail page
- [ ] Endorsement reject → hidden publicly; user sees rejected status
- [ ] Users: promote / demote / suspend works; delete cascades bookmarks + endorsements
- [ ] All admin tables (Leads, Projects, Users, Endorsements, Blog) support filter + pagination
- [ ] Analytics page renders 3 charts (line / pie / bar) with real data
- [ ] Profile edits reflect on landing page

## API / security
- [ ] `POST /api/leads` validates server-side (try bypassing form with curl)
- [ ] `POST /api/leads` rejects foreign `Origin` header (curl wrong origin → 403)
- [ ] `POST /api/auth/register` rejects duplicate email (409)
- [ ] `/api/admin/*` returns 401 without session, 403 if `user` role
- [ ] `/api/user/*` returns 401 without session
- [ ] Contact endpoint rate-limit triggers (spam test) → 429
- [ ] Register rate-limit triggers (5/hr) → 429
- [ ] Login rate-limit triggers after 10 failed attempts/hr → 429
- [ ] Endorsement rate-limit triggers (10/hr/user) → 429
- [ ] Lead message containing `<script>` renders as plain text in admin (no execution)
- [ ] Endorsement text containing `<script>` renders as plain text on detail page (no execution)
- [ ] Blog Markdown sanitized — `<script>` in body is stripped
- [ ] Security headers present (`curl -I`): X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy
- [ ] No secrets in client bundle (`next build` + inspect)
- [ ] Passwords stored hashed only (never logged, never returned by API)
- [ ] OAuth callback URL whitelist enforced

## Cross-browser / device
- [ ] Chrome, Safari, Firefox desktop
- [ ] iOS Safari + Android Chrome (real devices)

## Code quality (this repo is the portfolio!)
- [ ] No `console.log` left in production code
- [ ] README up to date with screenshots
- [ ] All commits have meaningful messages (recruiters read commit history)
