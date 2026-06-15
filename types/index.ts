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
