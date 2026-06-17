import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/models/User";

// Augment NextAuth so `session.user` and the JWT carry our `id` + `role`.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

// JWT is declared in @auth/core/jwt; next-auth/jwt only re-exports it, so the
// augmentation must target the declaring module to actually merge.
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
