# Deployment Guide

## Prerequisites
- GitHub account · Vercel account (free) · MongoDB Atlas (free M0) · Google Cloud project (for OAuth)

## 1. Database — MongoDB Atlas
1. Create free **M0 cluster** (region: closest to UAE, e.g. `me-central` or `eu-west`).
2. Database Access → add user (username + strong password).
3. Network Access → `0.0.0.0/0`.
4. Copy connection string:
   `mongodb+srv://<user>:<pass>@cluster.xxxx.mongodb.net/portfolio`

## 2. Google OAuth
1. Google Cloud Console → APIs & Services → Credentials → "OAuth 2.0 Client ID" (type: Web).
2. Authorized JavaScript origins: `http://localhost:3000` + your production URL.
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` + `<prod>/api/auth/callback/google`.
4. Copy Client ID + Client Secret.

## 3. Environment variables
`.env.local` (and mirror in Vercel → Settings → Environment Variables):
```
# database
MONGODB_URI=mongodb+srv://...

# auth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000     # prod: your live URL
GOOGLE_CLIENT_ID=<from Google Cloud>
GOOGLE_CLIENT_SECRET=<from Google Cloud>

# seed (used once, then remove from environment)
ADMIN_EMAIL=admin@syed.dev
ADMIN_PASSWORD=<choose-strong>
DEMO_USER_EMAIL=demo@syed.dev
DEMO_USER_PASSWORD=<choose-strong>

# demo login buttons (exposed to client — these are PUBLIC by design)
NEXT_PUBLIC_DEMO_USER_EMAIL=demo@syed.dev
NEXT_PUBLIC_DEMO_USER_PASSWORD=<same as DEMO_USER_PASSWORD>
NEXT_PUBLIC_DEMO_ADMIN_EMAIL=admin@syed.dev
NEXT_PUBLIC_DEMO_ADMIN_PASSWORD=<same as ADMIN_PASSWORD>

# file storage (project images, blog covers, user avatars, CV)
BLOB_READ_WRITE_TOKEN=<from Vercel → Storage → Blob → token>

# rate limiting (Upstash Redis REST)
UPSTASH_REDIS_REST_URL=https://<id>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>

# optional
RESEND_API_KEY=...
```

> ⚠️ **Demo credentials are public.** The whole point of "Demo User / Demo Admin" buttons is one-click access for graders, so the `NEXT_PUBLIC_*` values are intentionally exposed in the client bundle. Rotate them if abused, and never reuse these passwords on a real account. Demo accounts have no write access to anything that isn't owned by them (admin actions still go through normal auth + role checks).

> **Vercel Blob:** create the store in Vercel → Storage → Blob → "Create Store" → copy `BLOB_READ_WRITE_TOKEN`. Locally, run `vercel env pull .env.local` after linking the project.
> **Upstash Redis:** create a free database at upstash.com → REST API tab → copy URL + token.

## 4. Seed the database (one-time)
```bash
npm run seed   # runs `tsx scripts/seed.ts`
```

`scripts/seed.ts` is **idempotent** — re-running is safe. It:
1. Connects to Mongo via `lib/db.ts`.
2. Upserts the **admin user** (`ADMIN_EMAIL`, bcrypt-hashed `ADMIN_PASSWORD`, role `admin`).
3. Upserts the **demo user** (`DEMO_USER_EMAIL`, bcrypt-hashed `DEMO_USER_PASSWORD`, role `user`).
4. Upserts the **Profile singleton** with `_id: 'singleton'` and starter content (headline, about, facts, skills, socials, FAQ).
5. Upserts 5 sample projects (the ones in `project-scope.md`) with `status: 'live'`.
6. Upserts 2 sample blog posts with `published: true`.

After running, **remove** `ADMIN_PASSWORD` and `DEMO_USER_PASSWORD` from your environment (the `NEXT_PUBLIC_*` mirrors are required to stay for the demo buttons to work). To rotate later: set them again, re-run `npm run seed`, then remove.

> **Windows note:** `openssl rand -base64 32` is not installed by default. Use either `npx auth secret` or PowerShell: `[Convert]::ToBase64String((1..32 | %{[byte](Get-Random -Max 256)}))`.

## 5. GitHub
```bash
git init && git add . && git commit -m "feat: initial portfolio"
git branch -M main
git remote add origin https://github.com/<you>/syed-portfolio.git
git push -u origin main
```
> Commit small and often with clear messages (`feat:`, `fix:`, `docs:`) — recruiters read commit history.

## 6. Vercel
1. New Project → import repo → Next.js auto-detected.
2. Add all env vars → **Deploy**.
3. Update `NEXTAUTH_URL` to the live URL → redeploy.
4. Add the production URL to Google OAuth authorized origins + redirects.

## 7. Custom domain
- Vercel → Domains → add `syed.dev` (or whichever you buy).
- Point DNS as instructed. Update `NEXTAUTH_URL` + Google OAuth config.

## 8. Security headers (`next.config.ts`)
```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value:
        "default-src 'self'; " +
        "img-src 'self' data: https://*.public.blob.vercel-storage.com https://lh3.googleusercontent.com; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
        "font-src 'self' fonts.gstatic.com; " +
        "connect-src 'self' *.upstash.io; " +
        "frame-src accounts.google.com" },
    ],
  }];
}
```
> Note: `lh3.googleusercontent.com` is the source for Google profile avatars; required when OAuth users sign in.

## 9. Password rotation / account recovery
- **Admin / demo accounts:** set the new password env var, re-run `npm run seed`, then clear the env var.
- **Regular `user` accounts:** "Forgot password" flow is on the roadmap (Phase 5). For now, an admin can suspend/delete the account from `/admin/users` and the user can re-register.
- **Lost admin password + lost env access:** connect to Atlas with `mongosh`, delete the admin user doc, re-seed.

## 10. Post-deploy checks
- [ ] Contact form saves a lead (check in admin)
- [ ] `/register` creates a `user` doc
- [ ] Google OAuth sign-in creates a `user` doc with `provider: 'google'`
- [ ] Demo User button → `/dashboard` works
- [ ] Demo Admin button → `/admin` works
- [ ] Draft project hidden publicly
- [ ] Draft blog post hidden publicly
- [ ] Dark mode toggle persists across reload
- [ ] OG image shows when link shared on LinkedIn/WhatsApp
- [ ] Test on a real phone

## 11. Rollback
Vercel → Deployments → promote any previous build.

## 12. Local dev
```bash
npm install
npm run seed   # one-time after setting env vars
npm run dev    # http://localhost:3000
```
