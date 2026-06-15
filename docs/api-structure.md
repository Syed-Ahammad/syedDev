# API Structure

Next.js App Router Route Handlers (`app/api/.../route.ts`). JSON responses, convention:
`{ success: boolean, data?: ..., error?: string }`

---

## Public

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/projects` | Listing with search + filter + sort + pagination |
| GET | `/api/projects/[slug]` | One project (also increments `views`) + related |
| GET | `/api/profile` | Profile data for hero/about/skills/FAQ |
| GET | `/api/blog` | List published posts (newest first), supports `?tag=` and `?page=` |
| GET | `/api/blog/[slug]` | One published post |
| GET | `/api/endorsements?projectId=` | Approved endorsements (public read for project detail + home wall) |
| POST | `/api/leads` | Submit contact form (anonymous or logged-in) |

**GET /api/projects — query params**

| Param | Default | Notes |
|-------|---------|-------|
| `q` | — | Full-text search on name/tagline/description |
| `stack` | — | Comma-separated, e.g. `Next.js,MongoDB` (matches any) |
| `type` | — | e.g. `SaaS` |
| `sort` | `recent` | `recent` \| `endorsed` (uses `endorsementCount`) |
| `page` | `1` | |
| `limit` | `12` | Max 24 |

Response: `{ data: { items: Project[], total: number, page: number, totalPages: number } }`.

**POST /api/leads — body**
```json
{
  "name": "Omar Al-Rashid",
  "email": "omar@example.com",
  "message": "We run two cafés in JLT…",
  "projectType": "Restaurant site",
  "source": "portfolio"
}
```
**201** → `{ "success": true, "data": { "id": "..." } }`
Validation (Zod): name ≥ 2, valid email, message ≥ 10. Rate-limited (Upstash) — **5 requests / 10 min per IP**. Origin check enforced. Lead `message` always rendered as text in admin inbox.

---

## Auth

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Email/password registration; creates `user` role |
| ALL | `/api/auth/[...nextauth]` | NextAuth: Credentials + Google providers, session, logout |

**POST /api/auth/register — body**
```json
{ "name": "Aisha", "email": "aisha@example.com", "password": "•••••••••" }
```
Validation: name ≥ 2, valid email (must not already exist), password ≥ 8 chars with at least one number. Returns `{ success: true }` and signs the user in (sets session cookie). Rate-limited — **5 / hr per IP**.

**NextAuth providers:**
- **Credentials** — email/password against `users.passwordHash`. `authorize()` rate-limited (Upstash, **10 / hr per IP**).
- **Google OAuth** — creates a `users` doc on first sign-in with `role: 'user'`, `provider: 'google'`. Existing email = link to that user (only if `provider` matches).

Session callback adds `role` and `id` to `session.user`.

---

## Registered user (`user` role — session required)

### Profile
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/user/profile` | Own profile (incl. counts) |
| PATCH | `/api/user/profile` | Update name, bio, image |

### Bookmarks
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/user/bookmarks` | List with populated project |
| POST | `/api/user/bookmarks` | Body: `{ projectId }`. Idempotent (unique index) |
| DELETE | `/api/user/bookmarks/[id]` | Remove |

### Endorsements
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/user/endorsements` | Own endorsements (all statuses) |
| POST | `/api/user/endorsements` | Body: `{ skill, text, projectId? }`. Rate-limited 10/hr/user |
| DELETE | `/api/user/endorsements/[id]` | Withdraw (only own) |

### Quote requests
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/user/quote-requests` | Own quote requests (filtered from `leads` by `userId` + `source: quote-request`) |
| POST | `/api/user/quote-requests` | Body: `{ projectType, message }`. Pre-fills name/email from session. Inserts into `leads` |

---

## Admin (`admin` role — session required)

### Leads
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/admin/leads?status=&page=` | List/filter, paginated |
| PATCH | `/api/admin/leads/[id]` | Update status |
| DELETE | `/api/admin/leads/[id]` | Delete |

### Projects
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/admin/projects?page=` | All incl. drafts, paginated |
| POST | `/api/admin/projects` | Create |
| PATCH | `/api/admin/projects/[id]` | Update (incl. status) |
| DELETE | `/api/admin/projects/[id]` | Delete |

### Blog
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/admin/blog?page=` | All posts incl. drafts |
| POST | `/api/admin/blog` | Create |
| PATCH | `/api/admin/blog/[id]` | Update; if `published` flips `false`→`true`, sets `publishedAt` |
| DELETE | `/api/admin/blog/[id]` | Delete |

### Endorsements (moderation)
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/admin/endorsements?status=pending&page=` | Moderation queue |
| PATCH | `/api/admin/endorsements/[id]` | Body `{ status: 'approved' \| 'rejected' }` — atomically updates project's `endorsementCount` |

### Users
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/admin/users?role=&page=` | List + filter |
| PATCH | `/api/admin/users/[id]` | Update `role` or `suspended` |
| DELETE | `/api/admin/users/[id]` | Delete (cascades bookmarks + endorsements) |

### Profile, stats, uploads
| Method | Route | Purpose |
|--------|-------|---------|
| GET/PATCH | `/api/admin/profile` | Read / update profile singleton |
| GET | `/api/admin/stats` | Counts for overview cards |
| GET | `/api/admin/analytics?range=` | Time-series for charts (visits/leads/endorsements per week) |
| POST | `/api/admin/upload` | Upload image to Vercel Blob, returns `{ url }` |

**POST /api/admin/upload** — `multipart/form-data` with one `file` field (≤4 MB, `image/*` only — Zod + magic-byte check). Returns `{ success: true, data: { url } }`. Uses `@vercel/blob`'s `put()` with `access: 'public'`.

**GET /api/admin/analytics** — returns:
```json
{
  "visitsByWeek": [{ "week": "2026-W23", "count": 142 }, ...],
  "leadsByStatus": [{ "status": "new", "count": 8 }, ...],
  "endorsementsByWeek": [{ "week": "2026-W23", "count": 3 }, ...]
}
```

---

## Error codes
| Code | Meaning |
|------|---------|
| 200/201 | OK |
| 400 | Validation error (Zod message in `error`) |
| 401 | Not logged in |
| 403 | Wrong role |
| 404 | Not found |
| 409 | Duplicate (e.g. existing email on register) |
| 429 | Rate limited |
| 500 | Server error |

## Caching & revalidation

**Public pages** (`/`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`) are static by default and revalidate on demand from writes.
**Dashboard pages** (`/admin/*`, `/dashboard/*`) opt out with `export const dynamic = 'force-dynamic'`.

| Write | Revalidate |
|-------|------------|
| `POST/PATCH/DELETE /api/admin/projects[...]` | `revalidatePath('/')`, `revalidatePath('/projects', 'page')`, `revalidatePath('/projects/[slug]', 'page')` for the affected slug |
| `POST/PATCH/DELETE /api/admin/blog[...]` (published only) | `revalidatePath('/')` (preview section), `revalidatePath('/blog', 'page')`, `revalidatePath('/blog/[slug]', 'page')` |
| `PATCH /api/admin/profile` | `revalidatePath('/')` |
| `PATCH /api/admin/endorsements/[id]` (approve) | `revalidatePath('/')` (testimonials wall), `revalidatePath('/projects/[slug]', 'page')` if attached |
| `POST /api/admin/upload` | none (caller's next write triggers revalidate) |
| `POST /api/leads`, `PATCH /api/admin/leads/[id]` | none |
| view-counter `$inc` | none |

## Implementation notes
- One handler file per resource; shared Zod schemas in `lib/validations.ts`.
- `requireSession()` and `requireRole('admin' | 'user')` helpers guard handlers (one line per route).
- Centralized error handler wraps every route — returns the right status + Zod message; logs server errors without leaking stack traces.
