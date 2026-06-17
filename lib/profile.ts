import { cache } from "react";
import { dbConnect } from "@/lib/db";
import { Profile, type IProfile } from "@/models/Profile";
import type { AdminProfile } from "@/types";
import type { AdminProfileInput } from "@/lib/validations";

function mapProfile(doc: Partial<IProfile> | null): AdminProfile {
  return {
    headline: doc?.headline ?? "",
    subline: doc?.subline ?? "",
    about: doc?.about ?? [],
    facts: doc?.facts ?? [],
    skills: doc?.skills ?? [],
    socials: doc?.socials ?? [],
    availability: doc?.availability ?? true,
    cvUrl: doc?.cvUrl ?? "",
    faq: doc?.faq ?? [],
  };
}

// Cached per render so multiple public components can read the singleton
// without each firing its own query.
export const getProfile = cache(async (): Promise<AdminProfile> => {
  await dbConnect();
  const doc = await Profile.findById("singleton").lean();
  return mapProfile(doc);
});

export async function updateProfile(
  input: AdminProfileInput,
): Promise<AdminProfile> {
  await dbConnect();
  // Singleton: always _id 'singleton', never insert a second profile doc.
  const doc = await Profile.findByIdAndUpdate(
    "singleton",
    { $set: input },
    { upsert: true, new: true, runValidators: true },
  ).lean();
  return mapProfile(doc);
}
