import { Schema, model, models, type Model, type Types } from "mongoose";

export type LeadStatus = "new" | "read" | "replied" | "closed";
export type LeadSource = "portfolio" | "newsletter" | "quote-request";

export interface ILead {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  status: LeadStatus;
  source: LeadSource;
  userId?: Types.ObjectId;
  // Quote-request extras (source: 'quote-request'); unused for contact leads.
  title?: string;
  budget?: string;
  timeline?: string;
  reply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    projectType: String,
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
      index: true,
    },
    source: {
      type: String,
      enum: ["portfolio", "newsletter", "quote-request"],
      default: "portfolio",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    title: String,
    budget: String,
    timeline: String,
    reply: String,
  },
  { timestamps: true },
);

export const Lead: Model<ILead> =
  (models.Lead as Model<ILead>) || model<ILead>("Lead", LeadSchema);

export default Lead;
