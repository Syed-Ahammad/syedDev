/**
 * Idempotent database seed: admin + demo user, Profile singleton, sample
 * projects (from the mock data the UI used) and sample blog posts.
 *
 * Run with `npm run seed` after setting MONGODB_URI (and optionally the
 * ADMIN_/DEMO_ credentials) in .env.local. Re-running upserts — never dupes.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { dbConnect } from "../lib/db";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { BlogPost } from "../models/BlogPost";
import { Profile } from "../models/Profile";
import { Endorsement } from "../models/Endorsement";
import { MOCK_PROJECTS } from "../lib/mock-projects";
import { MOCK_PROJECT_DETAILS } from "../lib/mock-project-details";
import { MOCK_BLOG_POSTS } from "../lib/mock-blog";
import { MOCK_ENDORSEMENTS } from "../lib/mock-endorsements";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      // optional — fall back to whatever is already in process.env
    }
  }
}

const env = (key: string, fallback: string) => process.env[key] ?? fallback;

async function seedUsers() {
  // Demo credentials are intentionally public (see AGENTS.md). Defaults match
  // the NEXT_PUBLIC_DEMO_* values the login buttons read, so they work as-is.
  const accounts = [
    {
      name: "Syed Ahammad",
      role: "admin" as const,
      email: env("ADMIN_EMAIL", env("NEXT_PUBLIC_DEMO_ADMIN_EMAIL", "admin@syed.dev")),
      password: env(
        "ADMIN_PASSWORD",
        env("NEXT_PUBLIC_DEMO_ADMIN_PASSWORD", "demo-admin-pass"),
      ),
    },
    {
      name: "Demo User",
      role: "user" as const,
      email: env("DEMO_USER_EMAIL", env("NEXT_PUBLIC_DEMO_USER_EMAIL", "demo@syed.dev")),
      password: env(
        "DEMO_USER_PASSWORD",
        env("NEXT_PUBLIC_DEMO_USER_PASSWORD", "demo-user-pass"),
      ),
    },
  ];

  for (const account of accounts) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    await User.findOneAndUpdate(
      { email: account.email.toLowerCase() },
      {
        $set: {
          name: account.name,
          role: account.role,
          provider: "credentials",
          passwordHash,
          suspended: false,
        },
      },
      { upsert: true, new: true },
    );
  }

  return accounts.map((a) => `${a.role} (${a.email})`);
}

async function seedProjects() {
  for (const project of MOCK_PROJECTS) {
    const detail = MOCK_PROJECT_DETAILS[project.slug];
    await Project.findOneAndUpdate(
      { slug: project.slug },
      {
        $set: {
          name: project.name,
          tagline: project.tagline,
          type: project.type,
          stack: project.stack,
          status: project.status,
          order: project.order,
          ...(detail
            ? {
                problem: detail.problem,
                approach: detail.approach,
                outcome: detail.outcome,
                year: detail.year,
                role: detail.role,
                links: (detail.links ?? []).map((l) => ({
                  label: l.label,
                  href: l.href,
                })),
              }
            : {}),
        },
      },
      { upsert: true, new: true },
    );
  }
  return MOCK_PROJECTS.length;
}

async function seedBlog() {
  for (const post of MOCK_BLOG_POSTS) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        $set: {
          title: post.title,
          excerpt: post.excerpt,
          tag: post.tag,
          body: post.body,
          published: true,
          publishedAt: new Date(post.publishedAt),
        },
      },
      { upsert: true, new: true },
    );
  }
  return MOCK_BLOG_POSTS.length;
}

// Display-only endorser accounts (credentials provider, no passwordHash → they
// can't log in). The mock's "role" line becomes each endorser's public bio.
function emailFromName(name: string) {
  const handle = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return `${handle}@example.com`;
}

async function seedEndorsements() {
  const projects = await Project.find().select("_id").sort({ order: 1 }).lean();

  for (let i = 0; i < MOCK_ENDORSEMENTS.length; i++) {
    const e = MOCK_ENDORSEMENTS[i];
    const endorser = await User.findOneAndUpdate(
      { email: emailFromName(e.endorserName) },
      {
        $set: {
          name: e.endorserName,
          role: "user",
          provider: "credentials",
          bio: e.endorserRole,
          suspended: false,
        },
      },
      { upsert: true, new: true },
    );
    if (!endorser) continue;

    // Round-robin across projects so detail pages get endorsements too.
    const projectId = projects.length
      ? projects[i % projects.length]._id
      : undefined;

    await Endorsement.findOneAndUpdate(
      { userId: endorser._id, skill: e.skill },
      {
        $set: {
          text: e.text,
          status: e.status,
          ...(projectId ? { projectId } : {}),
        },
      },
      { upsert: true, new: true },
    );
  }

  // Recompute the denormalized approved-count per project (idempotent).
  for (const p of projects) {
    const count = await Endorsement.countDocuments({
      projectId: p._id,
      status: "approved",
    });
    await Project.updateOne({ _id: p._id }, { $set: { endorsementCount: count } });
  }

  return MOCK_ENDORSEMENTS.length;
}

async function seedProfile() {
  await Profile.findByIdAndUpdate(
    "singleton",
    {
      $set: {
        headline: "I build full-stack products that ship.",
        subline:
          "Full-stack developer in Dubai. I turn messy operations into clean Next.js + MongoDB products — and keep a public log of every build.",
        about: [
          "I spent five years in hospitality operations before I wrote my first line of production code — counting stock, reconciling invoices, and feeling every gap a good tool could close.",
          "Today I build those tools: web apps, dashboards, and storefronts with Next.js, TypeScript, and MongoDB. I care about shipping, clean data models, and software people actually use.",
        ],
        facts: [
          { label: "Based in", value: "Dubai, UAE" },
          { label: "Stack", value: "Next.js · MongoDB · TypeScript" },
          { label: "Availability", value: "Open to freelance & full-time" },
        ],
        skills: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "MongoDB",
          "Mongoose",
          "Tailwind CSS",
          "NextAuth",
        ],
        socials: [
          { label: "GitHub", url: "https://github.com/Syed-Ahammad" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/syed-ahammad" },
          { label: "Upwork", url: "https://www.upwork.com/freelancers/syedahammad" },
        ],
        availability: true,
        faq: [
          {
            q: "What do you build?",
            a: "Full-stack web apps — portfolios, dashboards, storefronts, and internal tools — mostly with Next.js and MongoDB.",
          },
          {
            q: "Are you available for freelance work?",
            a: "Yes. Send a brief through the contact form and I'll reply within 24 hours with honest scope and timeline.",
          },
          {
            q: "Where are you based?",
            a: "Dubai, UAE — working with clients across the GCC and remotely worldwide.",
          },
        ],
      },
    },
    { upsert: true, new: true },
  );
}

async function main() {
  loadEnv();
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  }

  await dbConnect();
  const users = await seedUsers();
  const projects = await seedProjects();
  const posts = await seedBlog();
  await seedProfile();
  const endorsements = await seedEndorsements();

  console.log("Seed complete:");
  console.log(`  users:        ${users.join(", ")}`);
  console.log(`  projects:     ${projects} upserted`);
  console.log(`  blog:         ${posts} upserted`);
  console.log("  profile:      singleton upserted");
  console.log(`  endorsements: ${endorsements} upserted (+ endorser accounts)`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
