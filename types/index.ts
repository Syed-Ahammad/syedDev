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
};
