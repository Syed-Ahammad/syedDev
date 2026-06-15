# Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router, Turbopack)** | Front-end + API in one repo; SEO; Vercel-native |
| Language | **TypeScript** | The repo itself is portfolio proof — typed, clean |
| UI | **React 19** | |
| Styling | **Tailwind CSS v4** (PostCSS-only setup) | Matches token system; class-based dark mode |
| Theme | **`next-themes`** | Cookie-persisted dark/light toggle; SSR-safe |
| Animation | **Framer Motion** | Hero word reveal, scroll reveals |
| Database | **MongoDB Atlas** | Free tier; Syed's stack |
| ODM | **Mongoose** | Schemas + validation |
| Auth | **NextAuth (Credentials + Google OAuth)** | Multi-user, role-based |
| Password hashing | **bcrypt** | Industry standard |
| Validation | **Zod** | Shared client/server |
| Forms | **React Hook Form** + Zod resolver | All forms (contact, register, project, blog, endorsement, profile, quote) |
| Markdown | **`react-markdown`** + `rehype-sanitize` | Blog post body rendering, XSS-safe |
| Charts | **Recharts** | Admin analytics (line, pie, bar) |
| Email (🟡) | **Resend** | "New lead" notification |
| File storage | **Vercel Blob** (`@vercel/blob`) | Project screenshots, CV.pdf, user avatars, blog cover images |
| Rate limit | **Upstash Redis** + `@upstash/ratelimit` | `/api/leads`, `/api/auth/register`, login `authorize()`, `/api/user/endorsements` |
| Unit tests | **Vitest** + **React Testing Library** | Fast, TS-native, Jest-compatible API |
| E2E tests | **Playwright** | Real-browser checks for contact, auth, role-based redirects, dark mode |
| Lint / format | **ESLint** (next/core-web-vitals) + **Prettier** | Recruiter-readable repo |
| Icons | **Lucide** | |
| Hosting | **Vercel** | Zero-config deploys |

## Design tokens (from approved design)

Dark mode is the default ("brand mode"); light mode is a fully-tuned alternate.

**Colors — Dark (default)**
| Token | Hex | Use |
|-------|-----|-----|
| `navy` | `#0b1622` | Background |
| `surf` | `#13243a` | Cards, surfaces |
| `paper` | `#ece7df` | Primary text |
| `dim` | `#8ea0b2` | Secondary text |
| `coral` | `#ff6b5c` | Primary accent, CTAs |
| `teal` | `#5ec4b6` | Secondary accent, success |
| `gold` | `#e8b34b` | "In progress" states (admin) |

**Colors — Light**
| Token | Hex | Use |
|-------|-----|-----|
| `paper` (bg) | `#f5f1ea` | Background |
| `paper-card` | `#ffffff` | Cards |
| `ink` | `#0b1622` | Primary text |
| `ink-dim` | `#4b5d72` | Secondary text |
| `coral` / `teal` / `gold` | same | Accents stay constant for brand recall |

Implementation: Tailwind v4 `@theme` with two custom variants — `.dark` class on `<html>` toggled by `next-themes`. All components use semantic tokens (`bg-surface`, `text-foreground`) that resolve per theme — never raw `bg-navy` outside theme definitions.

**Type**
- Display/headings: **Space Grotesk** (600–700)
- Body: **Inter** (400–500)
- Labels/code/meta: **JetBrains Mono**

**Signature elements**
- Word-by-word animated hero headline
- "Available for work" pulsing pill
- Dotted ambient background
- `// section` mono eyebrows
- Hover-slide project rows with → arrow
- Skeleton shimmer for loading grids

## Card grid rules
- All cards (Project, Blog, Endorsement, Service): same width, same height, same border radius (`rounded-2xl`), same padding.
- Desktop: **4 cards per row** (grid-cols-4). Tablet: 2. Mobile: 1.
- Skeleton loader matches card dimensions to prevent layout shift.

## Form rules
- Every input has a connected `<label>` (`htmlFor`).
- Loading state: button shows spinner, becomes `disabled`.
- Errors: inline below input + `aria-describedby`.
- Success: toast + optional inline confirmation.

## Why not X?
- **No CMS (Sanity/Strapi)** — the admin dashboard IS the CMS.
- **No separate Express server** — route handlers count as backend (see `rubric-compliance.md` §11).
- **No Redux** — server components + small client state.
- **No third role (Manager) in v1** — adds menu items but no real flow; defer to v2.
