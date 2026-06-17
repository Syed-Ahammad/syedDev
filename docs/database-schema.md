# Database Schema (MongoDB / Mongoose)

Database: MongoDB Atlas. ODM: Mongoose. All collections use `{ timestamps: true }`.

Two seeded users exist on first deploy: **`admin@syed.dev` (admin)** and **`demo@syed.dev` (user)** — both used by the demo-login buttons.

---

## `users` (multi-user with roles)
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required |
| `email` | String | required, unique, lowercase |
| `passwordHash` | String | bcrypt; **optional** (OAuth users have no password) |
| `role` | String | enum: `user` \| `admin`, default `user` |
| `image` | String | optional avatar URL (Vercel Blob for uploads, OAuth URL for Google) |
| `bio` | String | optional, max 280 chars |
| `provider` | String | `credentials` \| `google`; identifies how the account was created |
| `providerAccountId` | String | OAuth subject id; required when `provider !== 'credentials'` |
| `suspended` | Boolean | default `false`; suspended users cannot sign in |
| `lastLoginAt` | Date | updated on every successful login |

```ts
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: String,
  role: { type: String, enum: ['user','admin'], default: 'user', index: true },
  image: String,
  bio: { type: String, maxlength: 280 },
  provider: { type: String, enum: ['credentials','google'], default: 'credentials' },
  providerAccountId: String,
  suspended: { type: Boolean, default: false },
  lastLoginAt: Date,
}, { timestamps: true });

UserSchema.index({ provider: 1, providerAccountId: 1 }, {
  unique: true,
  partialFilterExpression: { provider: { $ne: 'credentials' } },
});
```

---

## `projects`
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required, e.g. "Dirham" |
| `slug` | String | unique, e.g. "dirham" |
| `tagline` | String | one-line summary |
| `description` | String | longer text for detail page |
| `type` | String | e.g. "SaaS", "Marketplace", "Client demo" |
| `stack` | [String] | e.g. `["Next.js","MongoDB"]` |
| `status` | String | enum: `live` \| `in-progress` \| `draft`, default `draft` |
| `problem` | String | detail page — "The problem" section |
| `approach` | String | detail page — "My approach" section |
| `outcome` | String | detail page — "Outcome" section |
| `year` | Number | detail page — key info |
| `role` | String | detail page — key info (e.g. "Lead developer") |
| `links` | [{label, href}] | detail page — key info links |
| `liveUrl` | String | optional |
| `repoUrl` | String | optional |
| `image` | String | optional Vercel Blob URL |
| `gallery` | [String] | extra screenshots (detail page) |
| `keyInfo` | [{label, value}] | "Role", "Duration", "Team size"… (detail page) |
| `order` | Number | display order |
| `views` | Number | default 0 |
| `endorsementCount` | Number | denormalized count of approved endorsements (for sort) |

```ts
const ProjectSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  tagline: String,
  description: String,
  type: { type: String, index: true },
  stack: { type: [String], index: true },
  status: { type: String, enum: ['live','in-progress','draft'], default: 'draft', index: true },
  liveUrl: String,
  repoUrl: String,
  image: String,
  gallery: [String],
  keyInfo: [{ label: String, value: String, _id: false }],
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  endorsementCount: { type: Number, default: 0 },
}, { timestamps: true });

ProjectSchema.index({ name: 'text', tagline: 'text', description: 'text' });
```

---

## `leads` (contact-form messages + quote requests)
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | required |
| `email` | String | required |
| `message` | String | required |
| `projectType` | String | optional |
| `status` | String | enum: `new` \| `read` \| `replied` \| `closed`, default `new` |
| `source` | String | enum: `portfolio` \| `newsletter` \| `quote-request`, default `portfolio` |
| `userId` | ObjectId | optional ref to `users` (set when a logged-in user submits) |

```ts
const LeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  projectType: String,
  status: { type: String, enum: ['new','read','replied','closed'], default: 'new', index: true },
  source: { type: String, enum: ['portfolio','newsletter','quote-request'], default: 'portfolio' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
}, { timestamps: true });
```

---

## `endorsements`

Endorsement = a registered user vouches for one of Syed's skills, with free-text reasoning. Public site shows only `status: 'approved'`.

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | ref `users`, required |
| `skill` | String | must be one of `profile.skills` |
| `text` | String | required, 20-500 chars |
| `status` | String | enum: `pending` \| `approved` \| `rejected`, default `pending` |
| `projectId` | ObjectId | optional ref `projects` — endorsement attached to a project |

```ts
const EndorsementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skill: { type: String, required: true, index: true },
  text: { type: String, required: true, minlength: 20, maxlength: 500 },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', index: true },
}, { timestamps: true });

EndorsementSchema.index({ userId: 1, skill: 1 }, { unique: true });
```

When an endorsement is approved and has a `projectId`, the project's `endorsementCount` is incremented atomically (and decremented on rejection/delete).

---

## `bookmarks`

A user saves a project to their dashboard. One row per (user, project).

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | ref `users`, required |
| `projectId` | ObjectId | ref `projects`, required |

```ts
const BookmarkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
}, { timestamps: true });

BookmarkSchema.index({ userId: 1, projectId: 1 }, { unique: true });
```

---

## `blogposts`

Markdown blog posts authored by admin.

| Field | Type | Notes |
|-------|------|-------|
| `title` | String | required |
| `slug` | String | unique, kebab-case |
| `excerpt` | String | 1-2 sentences for preview cards |
| `coverImage` | String | Vercel Blob URL |
| `tag` | String | e.g. "Next.js", "Career", "Stack notes" |
| `body` | String | Markdown |
| `published` | Boolean | default `false` (draft) |
| `publishedAt` | Date | set when `published` flips to `true` |

```ts
const BlogPostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: String,
  coverImage: String,
  tag: { type: String, index: true },
  body: { type: String, required: true },
  published: { type: Boolean, default: false, index: true },
  publishedAt: Date,
}, { timestamps: true });
```

---

## `profile` (single document)

Stored as **one document with `_id: 'singleton'`**. Seed script (`scripts/seed.ts`) upserts this on first run.

| Field | Type | Notes |
|-------|------|-------|
| `_id` | String | always `'singleton'` |
| `headline` | String | hero headline parts |
| `subline` | String | hero paragraph |
| `about` | [String] | paragraphs |
| `facts` | [{label, value}] | Based in / Stack / Availability… |
| `skills` | [String] | stack strip (also the allowed `endorsements.skill` values) |
| `socials` | [{label, url}] | GitHub, LinkedIn, Upwork |
| `availability` | Boolean | shows the green pill |
| `cvUrl` | String | Vercel Blob URL for CV.pdf |
| `faq` | [{q, a}] | home-page FAQ accordion items |

```ts
const ProfileSchema = new Schema({
  _id: { type: String, default: 'singleton' },
  headline: String,
  subline: String,
  about: [String],
  facts: [{ label: String, value: String, _id: false }],
  skills: [String],
  socials: [{ label: String, url: String, _id: false }],
  availability: { type: Boolean, default: true },
  cvUrl: String,
  faq: [{ q: String, a: String, _id: false }],
}, { timestamps: true, _id: false });
```

---

## `visits` (simple analytics)
| Field | Type | Notes |
|-------|------|-------|
| `_id` | String | "YYYY-MM-DD" (one doc per day) |
| `count` | Number | incremented atomically |

```ts
const VisitSchema = new Schema({
  _id: { type: String },
  count: { type: Number, default: 0 },
}, { timestamps: true, _id: false });
```

## Indexes (summary)
- `users.email` unique · `users.role` · `users.(provider, providerAccountId)` unique partial
- `projects.slug` unique · `projects.status` · `projects.stack` · `projects.type` · text index on (name, tagline, description) for search
- `leads.status` · `leads.userId`
- `endorsements.(userId, skill)` unique · `endorsements.status` · `endorsements.projectId`
- `bookmarks.(userId, projectId)` unique
- `blogposts.slug` unique · `blogposts.published` · `blogposts.tag`
- `profile._id` = `'singleton'` (convention) · `visits._id` = date string
