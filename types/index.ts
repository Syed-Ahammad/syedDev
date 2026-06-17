export type ProjectStatus = "live" | "in-progress" | "draft";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  type: string;
  stack: string[];
  status: ProjectStatus;
  order: number;
};

export type ProjectDetail = {
  problem: string;
  approach: string;
  outcome: string;
  year: number;
  role: string;
  links?: { label: string; href: string }[];
};

export type EndorsementStatus = "pending" | "approved" | "rejected";

export type Endorsement = {
  id: string;
  skill: string;
  text: string;
  endorserName: string;
  endorserRole: string;
  status: EndorsementStatus;
  submittedAt: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  publishedAt: string;
  readMinutes: number;
  body: string;
};

export type LeadStatus = "new" | "responded" | "won" | "archived";

export type Lead = {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  status: LeadStatus;
  source: string;
  receivedAt: string;
};

export type UserRole = "user" | "admin";

export type UserStatus = "active" | "suspended";

// Real counts for the admin overview cards (GET /api/admin/stats).
export type AdminStats = {
  projects: { total: number; published: number };
  leads: { total: number; unread: number };
  endorsements: { total: number; pending: number };
  users: { total: number; suspended: number };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastActiveAt: string;
};

export type VisitPoint = {
  label: string;
  visits: number;
};

export type LeadBreakdown = {
  source: string;
  count: number;
};

export type EndorsementByProject = {
  project: string;
  count: number;
};

export type Bookmark = {
  id: string;
  projectSlug: string;
  projectName: string;
  projectTagline: string;
  projectType: string;
  stack: string[];
  bookmarkedAt: string;
};

export type QuoteStatus = "new" | "in-review" | "responded" | "closed";

export type QuoteRequest = {
  id: string;
  title: string;
  projectType: string;
  budget: string;
  timeline: string;
  brief: string;
  status: QuoteStatus;
  submittedAt: string;
  reply?: string;
};

export type UserEndorsement = {
  id: string;
  projectSlug: string;
  projectName: string;
  skill: string;
  text: string;
  status: EndorsementStatus;
  submittedAt: string;
};

export type UserNotificationPrefs = {
  newsletter: boolean;
  endorsementUpdates: boolean;
  quoteReplies: boolean;
};

export type UserProfile = {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  notifications: UserNotificationPrefs;
};
