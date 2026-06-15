# Folder Structure (Next.js App Router)

Small files, clear names — every component does one job.

```
syed-portfolio/
├── app/
│   ├── page.tsx                       # Landing — composes ≥8 section components
│   ├── layout.tsx                     # Root: fonts, ThemeProvider, SessionProvider, metadata
│   ├── globals.css
│   ├── projects/
│   │   ├── page.tsx                   # Listing (search + filter + sort + pagination)
│   │   └── [slug]/page.tsx            # Detail (overview, key info, endorsements, related)
│   ├── blog/
│   │   ├── page.tsx                   # Blog index
│   │   └── [slug]/page.tsx            # Blog post (Markdown)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx                 # Email/pw + Google + Demo User + Demo Admin buttons
│   ├── register/page.tsx              # Email/pw + Google
│   ├── dashboard/                     # User role
│   │   ├── layout.tsx                 # Sidebar shell + requireRole('user')
│   │   ├── page.tsx                   # Overview (stat cards)
│   │   ├── bookmarks/page.tsx
│   │   ├── endorsements/page.tsx
│   │   ├── quotes/page.tsx
│   │   └── profile/page.tsx
│   ├── admin/                         # Admin role
│   │   ├── layout.tsx                 # Sidebar shell + requireRole('admin')
│   │   ├── page.tsx                   # Overview
│   │   ├── projects/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── endorsements/page.tsx      # Moderation
│   │   ├── users/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── profile/page.tsx
│   └── api/
│       ├── projects/route.ts
│       ├── projects/[slug]/route.ts
│       ├── profile/route.ts
│       ├── blog/route.ts
│       ├── blog/[slug]/route.ts
│       ├── endorsements/route.ts      # Public read (approved only)
│       ├── leads/route.ts
│       ├── auth/
│       │   ├── register/route.ts
│       │   └── [...nextauth]/route.ts
│       ├── user/
│       │   ├── profile/route.ts
│       │   ├── bookmarks/route.ts
│       │   ├── bookmarks/[id]/route.ts
│       │   ├── endorsements/route.ts
│       │   ├── endorsements/[id]/route.ts
│       │   └── quote-requests/route.ts
│       └── admin/
│           ├── leads/route.ts
│           ├── leads/[id]/route.ts
│           ├── projects/route.ts
│           ├── projects/[id]/route.ts
│           ├── blog/route.ts
│           ├── blog/[id]/route.ts
│           ├── endorsements/route.ts
│           ├── endorsements/[id]/route.ts
│           ├── users/route.ts
│           ├── users/[id]/route.ts
│           ├── profile/route.ts
│           ├── stats/route.ts
│           ├── analytics/route.ts
│           └── upload/route.ts
│
├── components/
│   ├── public/                        # One file per landing/site section
│   │   ├── Navbar.tsx                 # Public navbar (logged-out + logged-in views)
│   │   ├── Hero.tsx
│   │   ├── Highlights.tsx
│   │   ├── StackStrip.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── Services.tsx
│   │   ├── Stats.tsx
│   │   ├── EndorsementsWall.tsx
│   │   ├── BlogPreview.tsx
│   │   ├── Faq.tsx
│   │   ├── Newsletter.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectListing.tsx         # Search + filters + sort + pagination
│   │   ├── BlogCard.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx            # Dark mode switch
│   ├── dashboard/                     # User dashboard
│   │   ├── Sidebar.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── BookmarkGrid.tsx
│   │   ├── EndorsementList.tsx
│   │   └── QuoteRequestList.tsx
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── StatCard.tsx
│   │   ├── LeadTable.tsx
│   │   ├── ProjectTable.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── BlogTable.tsx
│   │   ├── BlogForm.tsx
│   │   ├── EndorsementModeration.tsx
│   │   ├── UserTable.tsx
│   │   ├── VisitsChart.tsx
│   │   ├── LeadsPieChart.tsx
│   │   └── EndorsementsBarChart.tsx
│   └── ui/                            # Button, Input, Badge, Card, Toast, Modal, Skeleton, Pagination, TablePagination, DemoLoginButton
│
├── lib/
│   ├── db.ts                          # Cached Mongoose connection
│   ├── auth.ts                        # NextAuth config (Credentials + Google), requireSession, requireRole
│   ├── ratelimit.ts                   # Upstash limiters (leads, register, login, endorsements)
│   ├── validations.ts                 # Zod schemas (lead, project, profile, upload, register, endorsement, blog, user-profile)
│   ├── blob.ts                        # Vercel Blob helpers
│   └── markdown.ts                    # Markdown → safe HTML for blog
│
├── models/
│   ├── User.ts
│   ├── Project.ts
│   ├── Lead.ts
│   ├── Endorsement.ts
│   ├── Bookmark.ts
│   ├── BlogPost.ts
│   ├── Profile.ts
│   └── Visit.ts
│
├── scripts/
│   └── seed.ts                        # Creates admin + demo user + Profile singleton + sample projects + sample blog posts
│
├── tests/                             # Vitest + RTL
│   ├── validations.test.ts
│   ├── ratelimit.test.ts
│   ├── auth.test.ts                   # Role guards (requireRole)
│   └── components/
│       ├── ContactForm.test.tsx
│       ├── ProjectCard.test.tsx
│       ├── ProjectListing.test.tsx
│       ├── ThemeToggle.test.tsx
│       └── EndorsementForm.test.tsx
│
├── e2e/                               # Playwright
│   ├── contact.spec.ts                # Anonymous submits contact → lead in admin
│   ├── auth.spec.ts                   # Register → login → role-based redirect
│   ├── demo-login.spec.ts             # Demo User and Demo Admin buttons work
│   ├── projects.spec.ts               # Listing search + filter + sort + paginate; detail; draft hidden
│   ├── dark-mode.spec.ts              # Toggle persists across navigation
│   ├── endorsements.spec.ts           # User submits → admin approves → appears on detail
│   ├── bookmarks.spec.ts              # User bookmarks → shows in dashboard
│   └── blog.spec.ts                   # Public can read; draft hidden
│
├── types/index.ts                     # Shared types (User, Project, Lead, Endorsement, Bookmark, BlogPost…) — incl. NextAuth session augmentation (`role`)
├── public/                            # OG image, favicon, screenshots
├── docs/                              # This documentation
├── middleware.ts                      # Protects /admin/* and /dashboard/* (role-aware redirects)
├── .env.local
├── .env.example
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json                       # Scripts: dev, build, start, lint, test, test:e2e, seed
```

## Conventions (clean-code rules for this repo)
1. **One section = one component.** `page.tsx` only composes; no logic inside.
2. **Components < ~150 lines.** If bigger, split.
3. **Server components by default**; add `"use client"` only where state/interaction needs it (forms, charts, theme toggle).
4. **All validation in `lib/validations.ts`** — never duplicate rules.
5. **No `any`.** Shared types in `types/`. NextAuth `Session.user` extended with `role` and `id`.
6. **Name things by what they do:** `LeadTable`, not `Card2`.
7. **Route guards live in `middleware.ts` (redirect) + `requireRole()` (API).** Both layers — never trust just one.
