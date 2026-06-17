import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Edge-safe instance: decodes the session token and applies the `authorized`
// callback (role-aware redirects) from lib/auth.config.ts.
export default NextAuth(authConfig).auth;

export const config = {
  // Run only where auth matters; everything else skips the middleware.
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
