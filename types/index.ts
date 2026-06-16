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

export type Endorsement = {
  id: string;
  skill: string;
  text: string;
  endorserName: string;
  endorserRole: string;
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
