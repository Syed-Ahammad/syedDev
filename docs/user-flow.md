# User Flow

## 1. Anonymous visitor — becoming a lead (the money flow)
```
Land on syed.dev
   → Hero (60-70vh): who is this? what does he build? (10-second test)
   → Scroll: stack strip → featured projects → services → stats → endorsements
            → blog preview → FAQ → newsletter
   → Click "Start a project" (or scroll to contact)
   → Contact form (name, email, message, project type)
   → Submit → client validates → server validates → save lead
   → Success state: "Thanks — I'll reply within 24 hours."
```
**Failure paths:** invalid email → inline error; server error → friendly retry, form data kept.

## 2. Anonymous visitor — recruiter scanning
```
Land → Hero (role + stack) → Featured projects → About facts
     → CV download → LinkedIn link → leave
```

## 3. Anonymous visitor — browsing projects
```
Click "Projects" in nav → /projects (listing)
   → Search bar (keyword) + filter chips (stack, type) + sort dropdown
        (recent / most-endorsed) + pagination
   → Click card → /projects/[slug]
        • Overview / Key info / Endorsements (approved) / Related projects
   → "Bookmark" or "Endorse" → prompted to register/login
```

## 4. Registration & first login
```
Click "Register" (or "Login → Create account")
   → /register: name + email + password   OR   "Continue with Google"
   → Submit → server validates (Zod) → user created (role: 'user') → auto sign-in
   → Redirect: role-based → /dashboard
```

## 5. Demo login (for graders)
```
/login → click "Demo User" button → credentials auto-fill → submit → /dashboard
/login → click "Demo Admin" button → credentials auto-fill → submit → /admin
```
Both demo accounts are seeded by `scripts/seed.ts` and documented in `rubric-compliance.md`.

## 6. Registered user — engaging
```
/dashboard (Overview)
   → Bookmarks: see saved projects → click to detail
   → My Endorsements: see status (pending / approved)
        → "Endorse a skill" → pick skill from profile.skills → text → submit
        → status = pending → toast "Awaiting moderation"
   → Quote Requests: list past requests → "+ New quote request"
        → projectType, message → submit → saved as lead (source: quote-request)
   → Profile: edit name, avatar, bio → save → toast
   → Logout (profile dropdown)
```

## 7. Anonymous → user — bookmark gating
```
Click "Bookmark" on /projects/[slug] without session
   → Redirect to /login?next=/projects/<slug>
   → Login or register
   → Bounce back to /projects/<slug> → bookmark auto-applied → toast
```

## 8. Admin — login
```
/admin → middleware redirects to /login (if no session) or /dashboard (if user role)
   → email + password OR Demo Admin button
   → success → /admin (overview)
```

## 9. Admin — handling a new lead
```
Overview shows "3 new messages"
   → Leads → Open lead (status auto: new → read)
   → Read message, copy email, reply from own inbox
   → Mark as "replied" (later "closed")
```

## 10. Admin — adding a project
```
Projects → "+ Add project"
   → Fill: name, slug, type, description, stack tags, links, status
   → Drag-drop image → uploads to Vercel Blob → URL stored on save
   → Save as draft → preview at /projects/[slug] → switch to "live"
   → Public site updates (revalidate)
```

## 11. Admin — moderating endorsements
```
Overview shows "2 pending endorsements"
   → Endorsements → see pending queue with user + skill + text + project link
   → Approve → status flips, project's endorsementCount++, revalidate detail
   → Reject → status flips, hidden from public, user sees "rejected"
```

## 12. Admin — managing users
```
Users → list (filter by role, search by email)
   → Promote a user → admin (rare; logs the action)
   → Suspend account → user cannot sign in
   → Delete (cascades bookmarks + endorsements)
```

## 13. Admin — blog CRUD
```
Blog → "+ New post"
   → Title, slug, cover image (Blob), tag, Markdown body
   → Save as draft → preview at /blog/[slug]?preview=1
   → Toggle Published → publishedAt set → appears on /blog
```

## 14. Dark mode
```
Anyone clicks 🌙/☀️ in navbar
   → next-themes toggles `.dark` on <html> → cookie persists
   → All components re-render via CSS variables
   → No flash on next page load (SSR-aware)
```

## Route map
| Route | Who | Purpose |
|-------|-----|---------|
| `/` | Public | Landing — composes ≥8 sections |
| `/projects` | Public | Listing with search/filter/sort/pagination |
| `/projects/[slug]` | Public | Project detail (overview, key info, endorsements, related) |
| `/blog` | Public | Blog index |
| `/blog/[slug]` | Public | Blog post |
| `/about` | Public | About page |
| `/contact` | Public | Contact page |
| `/login` | Public | Login (credentials + Google + 2 demo buttons) |
| `/register` | Public | Registration |
| `/dashboard` | User | Overview |
| `/dashboard/bookmarks` | User | Saved projects |
| `/dashboard/endorsements` | User | Submit + history |
| `/dashboard/quotes` | User | Quote requests |
| `/dashboard/profile` | User | Edit profile |
| `/admin` | Admin | Overview |
| `/admin/projects` | Admin | Project CRUD |
| `/admin/blog` | Admin | Blog CRUD |
| `/admin/leads` | Admin | Leads inbox |
| `/admin/endorsements` | Admin | Moderation queue |
| `/admin/users` | Admin | User management |
| `/admin/analytics` | Admin | Charts |
| `/admin/profile` | Admin | Site profile / skills |
