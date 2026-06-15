# Changelog

Format based on Keep a Changelog. Versions: design `0.x`, first live deploy `1.0.0`.

## [Unreleased]
### Planned
- Phase 2: convert designs to Next.js components (small steps, see roadmap)
- Phase 3: back-end (models → public API → auth → admin API)

---

## [0.2.0] — 2026-06-14
### Changed (Path B — Kaizen 2.0 Update-1 compliance)
- **Project scope** now layers a community layer onto the portfolio (`project-scope.md`).
- **Two roles** introduced: `user` (registered visitor) + `admin` (Syed). `users` schema adds `role`, OAuth fields, `suspended`, `lastLoginAt`.
- **Auth** expanded: public `/register`, Google OAuth provider, two demo-login buttons (User + Admin).
- **Home page** target raised to ≥8 sections (Hero, Highlights, Featured Projects, Services, Stats, Endorsements wall, Blog preview, FAQ, Newsletter).
- **Projects listing** (`/projects`) gains keyword search + ≥2 filters + sort + pagination.
- **Project detail** gains Endorsements + Related sections.
- **Blog** added (`/blog`, `/blog/[slug]`) — admin CRUD with Markdown.
- **Endorsements** (user-submitted, admin-moderated) replace static testimonials.
- **Bookmarks** added (user saves projects to their dashboard).
- **User dashboard** (`/dashboard`) with 5 menu items: Overview, Bookmarks, Endorsements, Quotes, Profile.
- **Admin dashboard** expanded to 8 menu items + 3 real-data charts (Recharts).
- **Dark mode** added via `next-themes` (cookie-persisted).
- **Quote requests** added (logged-in users send leads with `source: quote-request`).
- **Rubric mapping** documented in new `docs/rubric-compliance.md`.
- Justification for keeping Next.js Route Handlers as backend documented in §11 of compliance doc.

### Added
- `docs/rubric-compliance.md` — single source of truth for graders.

---

## [0.1.0] — 2026-06-13
### Added
- Full documentation set (12 docs + README)
- **Public portfolio design** (`frontend/index.html`) — animated hero, stack strip, 5 real projects (Dirham, Groceri, E-Markeet, Restaurant POS, Hotel Inventory), services, about, contact CTA; navy/coral/teal identity with Space Grotesk + Inter + JetBrains Mono
- **Admin dashboard design** (`frontend/admin-dashboard.html`) — overview stats, leads inbox with unread states and tags, weekly visits chart, project management table with live/in-progress/draft statuses
- Design tokens + component breakdown documented in tech-stack.md
- Clean-code conventions defined in folder-structure.md

### Notes
- Front-end design phase only; no code yet.
- v1 scope: portfolio + leads + project CRUD + profile editor. Blog/analytics → roadmap.
