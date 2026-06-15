# syed.dev — Portfolio Website & Admin Dashboard

A personal portfolio platform: a public site that wins clients (projects, services, about, contact) and a private admin dashboard where Syed manages projects, reads client messages (leads), and updates his profile — without touching code.

> **Status:** Front-end design phase ✅ — back-end documented, not yet built.

---

## What's in this repo

```
Syed-portfolio/
├── docs/                     # Full project documentation (start here)
├── frontend/
│   ├── index.html            # Public portfolio (design reference)
│   └── admin-dashboard.html  # Admin dashboard (design reference)
└── README.md
```

## Quick links

| Doc | What it covers |
|-----|----------------|
| [project-scope.md](docs/project-scope.md) | Goals, in/out of v1 |
| [requirements.md](docs/requirements.md) | Functional & non-functional requirements |
| [features-list.md](docs/features-list.md) | Every feature, by priority |
| [user-flow.md](docs/user-flow.md) | Visitor and admin journeys |
| [database-schema.md](docs/database-schema.md) | MongoDB collections (Mongoose) |
| [api-structure.md](docs/api-structure.md) | API routes & contracts |
| [tech-stack.md](docs/tech-stack.md) | Tools + design tokens |
| [folder-structure.md](docs/folder-structure.md) | Codebase layout |
| [deployment-guide.md](docs/deployment-guide.md) | Ship it live (Vercel + Atlas) |
| [testing-checklist.md](docs/testing-checklist.md) | Pre-launch checks |
| [changelog.md](docs/changelog.md) | What changed, when |
| [roadmap.md](docs/roadmap.md) | Small-step build plan + future |

## Why an admin dashboard for a portfolio?

Because the portfolio is a **lead machine**, not a brochure:
- Every contact-form submission is saved as a **lead** (not lost in email).
- Projects are **data**, so adding a new one takes 2 minutes, no redeploy.
- Visit stats show **which projects clients actually look at**.

## Tech stack (summary)

Next.js (App Router) · React · TypeScript · Tailwind CSS · MongoDB Atlas · Mongoose · NextAuth · Vercel.

## Build order — small steps

1. ✅ **Design** — public site + admin dashboard (this phase)
2. ⏳ **Front-end build** — convert to Next.js components (one section at a time)
3. ⏳ **Back-end** — models → public API → auth → admin API (one route at a time)
4. ⏳ **Integration & testing**
5. ⏳ **Deploy**

See [roadmap.md](docs/roadmap.md) for the full step-by-step plan.
