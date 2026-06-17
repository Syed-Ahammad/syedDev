import { Schema, model, models, type Model } from "mongoose";

export type ProjectStatus = "live" | "in-progress" | "draft";

export interface IProjectKeyInfo {
  label: string;
  value: string;
}

export interface IProject {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  type?: string;
  stack: string[];
  status: ProjectStatus;
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
  gallery: string[];
  keyInfo: IProjectKeyInfo[];
  order: number;
  views: number;
  endorsementCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: String,
    description: String,
    type: { type: String, index: true },
    stack: { type: [String], index: true },
    status: {
      type: String,
      enum: ["live", "in-progress", "draft"],
      default: "draft",
      index: true,
    },
    liveUrl: String,
    repoUrl: String,
    image: String,
    gallery: [String],
    keyInfo: [{ label: String, value: String, _id: false }],
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    endorsementCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Full-text search across the fields surfaced in the listing search box.
ProjectSchema.index({ name: "text", tagline: "text", description: "text" });

export const Project: Model<IProject> =
  (models.Project as Model<IProject>) || model<IProject>("Project", ProjectSchema);

export default Project;
