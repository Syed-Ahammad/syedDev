import { Schema, model, models, type Model } from "mongoose";

export interface IProfileFact {
  label: string;
  value: string;
}
export interface IProfileSocial {
  label: string;
  url: string;
}
export interface IProfileFaq {
  q: string;
  a: string;
}

export interface IProfile {
  _id: string;
  headline?: string;
  subline?: string;
  about: string[];
  facts: IProfileFact[];
  skills: string[];
  socials: IProfileSocial[];
  availability: boolean;
  cvUrl?: string;
  faq: IProfileFaq[];
  createdAt: Date;
  updatedAt: Date;
}

// Single document keyed `_id: 'singleton'` — never insert a second profile doc.
const ProfileSchema = new Schema<IProfile>(
  {
    _id: { type: String, default: "singleton" },
    headline: String,
    subline: String,
    about: [String],
    facts: [{ label: String, value: String, _id: false }],
    skills: [String],
    socials: [{ label: String, url: String, _id: false }],
    availability: { type: Boolean, default: true },
    cvUrl: String,
    faq: [{ q: String, a: String, _id: false }],
  },
  { timestamps: true, _id: false },
);

export const Profile: Model<IProfile> =
  (models.Profile as Model<IProfile>) || model<IProfile>("Profile", ProfileSchema);

export default Profile;
