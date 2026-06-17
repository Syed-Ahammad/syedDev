import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validations";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      // NOTE: Upstash rate limiting (10/hr per IP) is wired in step 3.25.
      await dbConnect();
      const user = await User.findOne({ email: parsed.data.email.toLowerCase() });
      if (!user || !user.passwordHash || user.suspended) return null;

      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;

      user.lastLoginAt = new Date();
      await user.save();

      return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        role: user.role,
      };
    },
  }),
];

// Only register Google when configured, so dev/build works without OAuth creds.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authConfig: NextAuthConfig = {
  // v5 prefers AUTH_SECRET; fall back to the NEXTAUTH_SECRET used in our docs.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    // Google has no DB adapter here, so create/verify the user ourselves.
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      await dbConnect();
      const email = user.email?.toLowerCase();
      if (!email) return false;

      const existing = await User.findOne({ email });
      if (existing) {
        // Only link if the existing account is also Google (avoid takeover).
        return existing.provider === "google" && !existing.suspended;
      }

      await User.create({
        name: user.name ?? email,
        email,
        image: user.image ?? undefined,
        role: "user",
        provider: "google",
        providerAccountId: account.providerAccountId,
      });
      return true;
    },
    // Persist id + role on the token at sign-in; reused on every later request.
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email.toLowerCase() });
        if (dbUser) {
          token.id = String(dbUser._id);
          token.role = dbUser.role;
        }
        return token;
      }
      if (user) {
        if (user.id) token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Expose id + role to the session consumed by server/client.
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
