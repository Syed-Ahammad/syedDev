# Requirements

## Functional requirements

### Public site (anonymous)
- **FR-1** Show hero (height 60-70vh) with name, role, value statement, CTA buttons, and one interactive element (animated headline or rotating skill chips).
- **FR-2** Show projects from the database: name, description, stack, type, status, link.
- **FR-3** Show services (what Syed offers) and about section (story + facts).
- **FR-4** Show skills/stack strip.
- **FR-5** Contact form: name, email, message, optional project-type select.
- **FR-6** Validate the form (required fields, valid email) client- and server-side.
- **FR-7** On submit: save as a lead in DB, show success state.
- **FR-8** Fully responsive; animations respect reduced motion.
- **FR-19** Home page renders ≥8 meaningful sections (Hero, Highlights, Featured Projects, Services, Stats, Endorsements, Blog Preview, FAQ, Newsletter / CTA — final list in `features-list.md`).
- **FR-20** Listing page (`/projects`) supports: keyword search, ≥2 filter fields (stack, type), sort (recent / most-endorsed), and pagination — fully functional, URL-driven.
- **FR-21** Project detail page (`/projects/[slug]`) has separate sections: Overview, Key information / stack, Endorsements, Related projects.
- **FR-22** Blog: index page lists posts (newest first), each post has its own `/blog/[slug]` page with Markdown content, cover image, published date, tag.
- **FR-23** Light **and** dark mode toggle in navbar; preference persisted (cookie) and respects `prefers-color-scheme` on first visit. Contrast meets WCAG AA in both modes.
- **FR-24** Navbar shows ≥4 routes when logged out (Home, Projects, Blog, About, Login) and ≥6 routes when logged in (Home, Projects, Blog, Dashboard, Profile dropdown, Logout). Sticky position; advanced profile dropdown menu when authenticated.

### Auth
- **FR-25** Public registration page (`/register`): email + password + name; client + server validation; bcrypt-hashed password.
- **FR-26** Login supports email/password **and** Google OAuth (one-click).
- **FR-27** Login page shows two demo-login buttons: **Demo User** and **Demo Admin** — each auto-fills credentials and signs in.
- **FR-28** Two roles: `user` (registered visitor) and `admin` (Syed). Role stored on User document; checked server-side on every protected route.

### Registered user (`user` role)
- **FR-29** User dashboard (`/dashboard`) with ≥4 menu items: Overview, Bookmarks, My Endorsements, Quote Requests, Profile.
- **FR-30** Bookmark / un-bookmark a project (auth required); bookmarks appear in user dashboard.
- **FR-31** Submit an endorsement on a skill (auth required; status = `pending` until admin approves; one endorsement per user per skill).
- **FR-32** Submit a quote request (auth required; pre-fills name/email from profile; stored as a lead with `source = 'quote-request'`).
- **FR-33** Edit own profile: name, avatar (image upload), bio. Avatar uploaded to Vercel Blob.

### Admin (`admin` role)
- **FR-9** Login required; all `/admin` routes protected.
- **FR-10** Overview: new-message count, weekly visits, live project count, recent leads, pending endorsements count.
- **FR-11** Leads inbox: list messages with status `new` → `read` → `replied` → `closed`. Filtering + pagination.
- **FR-12** Update lead status; view full message.
- **FR-13** Projects: create, edit, delete; fields incl. name, description, stack, type, status (`live`/`in-progress`/`draft`), order, links.
- **FR-14** Draft projects do NOT show on the public site.
- **FR-15** Profile editor: headline, about text, facts (location, availability), skills list, social links.
- **FR-16** Changes reflect on the public site immediately (revalidate).
- **FR-17** Admin can upload a project screenshot (≤ 4 MB, `image/*`) from the project form; URL stored in `projects.image`. Storage: Vercel Blob.
- **FR-18** Admin can upload / replace `CV.pdf`; the public CV-download button links to the current Blob URL.
- **FR-34** Admin dashboard sidebar has ≥6 items: Overview, Projects, Blog, Leads, Endorsements, Users, Analytics, Profile.
- **FR-35** Blog CRUD: title, slug, cover image, tag, Markdown body, published flag, published-at date. Drafts hidden publicly.
- **FR-36** Endorsement moderation: list pending endorsements; approve (publishes on project detail) or reject (deletes).
- **FR-37** User management: list users (email, role, registered date, last login); promote `user` → `admin` or demote; suspend account.
- **FR-38** Analytics: ≥3 charts backed by real data — Visits per week (line), Leads by status (pie), Endorsements per week (bar).
- **FR-39** All admin tables (Leads, Projects, Users, Endorsements) support filtering and pagination.

## Non-functional requirements
- **NFR-1 Performance** — Landing LCP < 2.5s on 4G; dashboard actions < 200ms perceived.
- **NFR-2 Security** — bcrypt-hashed passwords; server-side session checks on every `/api/admin/*` and `/api/user/*`; server-side Zod validation on all writes; Upstash rate-limit on `/api/leads` (5/10min), `/api/auth/register` (5/hr), `authorize()` (10/hr), and `/api/endorsements` (10/hr per user); lead `message` and endorsement `text` rendered as **text** only (never `dangerouslySetInnerHTML`) — relies on React's auto-escaping for XSS; same-origin enforcement on `/api/leads` via origin check; security headers set in `next.config.ts` (CSP, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy); OAuth callback URL whitelist + state parameter (handled by NextAuth).
- **NFR-3 Accessibility** — Keyboard navigation, visible focus, contrast (AA in both light + dark), reduced motion, form labels connected to inputs.
- **NFR-4 SEO** — Meta tags, Open Graph image, semantic HTML, sitemap (auto-includes blog posts + project details), `robots.txt`.
- **NFR-5 Maintainability** — TypeScript everywhere, small components, each file < ~150 lines where practical.
- **NFR-6 Code quality** — Clean, readable, commented where non-obvious — this repo IS the portfolio. No console logs in production builds.
- **NFR-7 Forms** — Every form has: label-connected inputs, client validation, server validation, loading state (disabled button + spinner), success message, error message.

## Priority (MoSCoW)
- **Must:** FR-1–9, FR-11, FR-13–14, FR-17, FR-19–32, FR-34–37, FR-39, NFR-1–4, NFR-7
- **Should:** FR-10, FR-12, FR-15–16, FR-18, FR-33, FR-38
- **Could:** Visit-source breakdown, blog comments
- **Won't (v1):** Manager role, payments, multi-language, full analytics
