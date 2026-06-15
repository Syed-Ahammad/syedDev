# Features List

Legend: 🟢 v1 (build now) · 🟡 v1 if time · 🔵 roadmap (later)

## Public site — Home page sections (target ≥8)
| # | Section | Priority | Notes |
|---|---------|----------|-------|
| H1 | Hero (60-70vh, animated headline, CTAs, availability pill) | 🟢 | One interactive element required |
| H2 | Highlights / "What I bring" strip (3-4 USPs) | 🟢 | Stat badges (years, projects, clients) |
| H3 | Featured Projects (4 cards, 4-per-row desktop) | 🟢 | From DB; skeleton loader; link to listing |
| H4 | Services (cards, same-size grid) | 🟢 | Card grid rules apply |
| H5 | Stats counter (projects shipped, leads converted, etc.) | 🟢 | Animates on viewport-in |
| H6 | Endorsements / Testimonials wall | 🟢 | Only `status: approved` endorsements |
| H7 | Blog preview (3 latest posts) | 🟢 | Card grid; "Read more" → /blog |
| H8 | FAQ accordion | 🟢 | 5-6 common questions |
| H9 | Newsletter / CTA band | 🟢 | Email capture → leads with `source: newsletter` |

## Public site — Other pages & features
| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| P1 | Tech-stack marquee strip | 🟢 | Done (design) |
| P2 | Projects listing `/projects` with search + filter + sort + pagination | 🟢 | URL-driven; ≥2 filter fields |
| P3 | Project detail `/projects/[slug]` (overview, key info, endorsements, related) | 🟢 | Publicly accessible |
| P4 | About page | 🟢 | Story + facts panel |
| P5 | Contact page (form + map + socials) | 🟢 | Core conversion |
| P6 | Blog index `/blog` | 🟢 | Newest first; tag chips |
| P7 | Blog detail `/blog/[slug]` | 🟢 | Markdown; cover; share buttons |
| P8 | CV download button | 🟢 | Links to Blob-hosted CV.pdf |
| P9 | Dark mode toggle (navbar) | 🟢 | Cookie persisted; respects system pref |
| P10 | SEO meta + OG image + sitemap | 🟢 | Auto-generated |
| P11 | Email notification on new lead | 🟡 | Resend |
| P12 | Multi-language (EN/BN/AR) | 🔵 | |

## Auth
| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| AU1 | Registration `/register` (email + password + name) | 🟢 | bcrypt |
| AU2 | Login `/login` (credentials + Google OAuth) | 🟢 | NextAuth |
| AU3 | Demo login buttons (Demo User + Demo Admin) | 🟢 | Auto-fill + submit |
| AU4 | Role-based redirect (`user` → `/dashboard`, `admin` → `/admin`) | 🟢 | On post-login |
| AU5 | Forgot password / reset flow | 🔵 | |

## Registered user dashboard `/dashboard` (≥4 menu items)
| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| U1 | Overview (welcome + 3 stat cards: bookmarks, endorsements, quotes) | 🟢 | |
| U2 | Bookmarks page (saved projects grid) | 🟢 | |
| U3 | My Endorsements page (list with status: pending / approved) | 🟢 | |
| U4 | Quote Requests page (list with status) | 🟢 | |
| U5 | Profile editor (name, avatar upload, bio) | 🟢 | Avatar → Vercel Blob |
| U6 | Profile dropdown in navbar (Profile, Settings, Logout) | 🟢 | "Advanced menu" rule |

## Admin dashboard `/admin` (≥6 menu items)
| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| A1 | Overview stats cards | 🟢 | Messages, visits, projects, pending endorsements |
| A2 | Leads inbox + unread badge + status flow | 🟢 | Filter + paginate |
| A3 | Project CRUD | 🟢 | |
| A3a | Project image upload (Vercel Blob) | 🟢 | Drag-drop, ≤4 MB, image/* only |
| A4 | Draft/live/in-progress status | 🟢 | Draft hidden publicly |
| A5 | Blog CRUD (title, slug, cover, tag, Markdown, published flag) | 🟢 | |
| A6 | Endorsement moderation (pending list → approve/reject) | 🟢 | |
| A7 | User management (list, role change, suspend) | 🟢 | Filter + paginate |
| A8 | Analytics — ≥3 charts (visits/week line, leads-by-status pie, endorsements/week bar) | 🟢 | Real data |
| A9 | Profile & skills editor | 🟢 | |
| A10 | Lead tags (lead/inquiry/source) | 🟡 | |
| A11 | Full analytics (sources, top pages) | 🔵 | |
| A12 | Site settings (SEO text, socials) | 🔵 | |

## Cross-cutting rules
- **Card grid:** every card has same height, width, border radius, layout. Desktop: 4 per row. Mobile: 1 per row.
- **Loading:** skeleton loaders for all data-fetched grids (projects, blog, endorsements, leads).
- **Forms:** every form has label-connected inputs, client + server validation, loading state, success + error messages.
- **Toasts:** all save/delete actions emit a toast.
- **Empty states:** every list page has a designed empty state.
- **Design system:** tokens in `tech-stack.md`. Reusable UI components (Button, Input, Badge, Card, Modal, Skeleton, Toast).
- **No placeholder content:** all copy is real (no lorem ipsum, no "Coming soon").
