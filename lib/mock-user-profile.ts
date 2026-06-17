import type { UserProfile } from "@/types";

export const MOCK_USER_PROFILE: UserProfile = {
  name: "Demo User",
  email: "demo@syed.dev",
  bio: "Operations lead at a small UAE F&B group. I use this dashboard to bookmark builds I want to copy ideas from and to brief Syed on internal tools we're scoping.",
  avatarUrl: "",
  notifications: {
    newsletter: true,
    endorsementUpdates: true,
    quoteReplies: true,
  },
};
