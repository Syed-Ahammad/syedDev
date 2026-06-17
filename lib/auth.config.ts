import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config: NO database or bcrypt imports, so `middleware.ts`
 * can run it on the edge runtime. The full config (lib/auth.ts) spreads this and
 * adds the Credentials/Google providers + the DB-backed jwt/signIn callbacks.
 */
export const authConfig: NextAuthConfig = {
  // v5 prefers AUTH_SECRET; fall back to the NEXTAUTH_SECRET used in our docs.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Real providers are added in lib/auth.ts; the edge instance only reads tokens.
  providers: [],
  callbacks: {
    // Expose id + role (already on the issued token) to the session.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    // Role-aware route protection, evaluated for the matched routes only.
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) {
        if (!user) return false; // → signIn page
        if (user.role !== "admin") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/dashboard")) {
        return Boolean(user); // any signed-in user (incl. admin)
      }

      if (pathname === "/login" || pathname === "/register") {
        if (user) {
          const dest = user.role === "admin" ? "/admin" : "/dashboard";
          return Response.redirect(new URL(dest, nextUrl));
        }
      }

      return true;
    },
  },
};
