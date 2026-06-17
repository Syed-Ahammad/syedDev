import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import type { UserProfile } from "@/types";
import type { ProfileUpdateInput } from "@/lib/validations";

const FIELDS = "name email bio image notifications";

type LeanUser = {
  name: string;
  email: string;
  bio?: string;
  image?: string;
  notifications?: {
    newsletter?: boolean;
    endorsementUpdates?: boolean;
    quoteReplies?: boolean;
  };
};

const toProfile = (u: LeanUser): UserProfile => ({
  name: u.name,
  email: u.email,
  bio: u.bio ?? "",
  avatarUrl: u.image ?? "",
  notifications: {
    newsletter: u.notifications?.newsletter ?? true,
    endorsementUpdates: u.notifications?.endorsementUpdates ?? true,
    quoteReplies: u.notifications?.quoteReplies ?? true,
  },
});

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  await dbConnect();
  const user = await User.findById(userId).select(FIELDS).lean();
  return user ? toProfile(user) : null;
}

/** Update the signed-in user's own profile (email is not editable). */
export async function updateUserProfile(
  userId: string,
  input: ProfileUpdateInput,
): Promise<UserProfile | null> {
  await dbConnect();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.bio !== undefined) patch.bio = input.bio;
  if (input.image !== undefined) patch.image = input.image;
  if (input.notifications !== undefined) patch.notifications = input.notifications;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: patch },
    { new: true, runValidators: true },
  )
    .select(FIELDS)
    .lean();
  return user ? toProfile(user) : null;
}
