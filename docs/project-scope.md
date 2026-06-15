# Project Scope

## 1. Overview
syed.dev is Syed Ahammad's personal portfolio with a lightweight **community layer** — a full-stack developer in Dubai with an operations/inventory background. The site has two jobs:

1. **Convert visitors into clients or job interviews** (primary — the portfolio half).
2. **Let registered visitors engage** — bookmark projects, endorse skills, request quotes, and read blog posts (community half).

The admin dashboard lets Syed manage everything (projects, leads, users, endorsements, blog, profile) without editing code.

## 2. Goals
- Present Syed as a specialist: *business-minded full-stack developer (Next.js / MERN)*.
- Showcase real projects (Dirham, Groceri, E-Markeet, Zaytoun, Hotel Inventory) with proof.
- Capture every inquiry as a stored **lead** with status tracking.
- Let registered visitors **endorse skills** and **bookmark projects** — social proof that compounds over time.
- Publish blog posts about builds, lessons learned, and stack opinions (SEO + authority).
- Make content updates (projects, blog, profile) a 2-minute task in the dashboard, not a redeploy.

## 3. Target users
| User | Needs |
|------|-------|
| **Anonymous visitor** | Quickly see skill, proof of work, how to contact, read blog |
| **Recruiter / hiring manager** | Stack, experience, availability, CV link |
| **Registered visitor (`user` role)** | Bookmark projects, endorse skills, request quote, manage profile |
| **Syed (`admin` role)** | Add/edit projects & blog, read & manage leads, moderate endorsements, manage users, update profile |

## 4. In scope (v1)
**Public site (anonymous):**
- Hero, tech-stack strip, projects listing (search + filter + sort + pagination), project details, services, about, blog index + posts, contact form.
- Contact form → saved to DB as a lead (+ optional email notification).
- Light **and** dark mode with persisted preference.

**Auth:**
- Public registration (email/password + Google OAuth).
- Login with demo-login button (auto-fills both User and Admin demo credentials).
- Two roles: `user` (registered visitor) and `admin` (Syed).

**Registered user dashboard:**
- Overview, Bookmarks, My Endorsements, Quote Requests, Profile (≥4 menu items).

**Admin dashboard:**
- Overview stats, leads inbox with status, project CRUD, blog CRUD, endorsement moderation, user management, profile/skills editor (≥6 menu items).
- Charts (visits, leads, endorsements) backed by real data.

**Cross-cutting:**
- Responsive, animated, brand-consistent (navy / coral / teal).
- Same-size cards, 4-per-row desktop, skeleton loaders.

## 5. Out of scope (v1 — see roadmap)
- Manager / third role (only `user` + `admin` in v1).
- Multi-language (EN only first; Bengali/Arabic later).
- Detailed analytics (simple counters + 3 charts in v1).
- Threaded comments on blog (single endorsement per user per skill is enough).
- CMS for arbitrary pages.
- Stripe / payment for quote requests (form-only in v1).

## 6. Success criteria
- A visitor understands *who Syed is and what he builds* within 10 seconds.
- Contact form submission works on mobile in under 30 seconds.
- Syed can add a new project or blog post in under 2 minutes via dashboard.
- No lead is ever lost — every submission is stored and visible.
- A registered user can submit an endorsement in under 60 seconds.
- Demo login (User and Admin buttons) gets a grader to a working session in one click.
- Landing LCP < 2.5s on 4G.

## 7. Constraints & assumptions
- Two roles: `user` (registered visitor) and `admin` (Syed). No Manager role in v1.
- Built solo in small steps — each step shippable and testable.
- Content (project text, about, initial blog posts) comes from Syed's real work history.
- Backend = Next.js App Router API routes (Node + MongoDB + Mongoose) — single repo. Rationale documented in `rubric-compliance.md`.
