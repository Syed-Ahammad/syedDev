#!/usr/bin/env node
/**
 * Lighthouse pass for step 2.25.
 *
 * Boots `next start` (assumes `npm run build` has already produced .next/),
 * runs Lighthouse against the marketing routes in both light and dark themes,
 * writes JSON + HTML reports under reports/lighthouse/, and prints a table.
 *
 * Fails (exit 1) if any category scores below the THRESHOLDS.
 */

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import CDP from "chrome-remote-interface";

const PORT = process.env.PORT ?? "3100";
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  { name: "home", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "about", path: "/about" },
  { name: "blog", path: "/blog" },
];

const THEMES = ["dark", "light"];

const CATEGORIES = ["performance", "accessibility", "seo", "best-practices"];

// Lighthouse single-run scores fluctuate ±10 on Windows due to CPU-throttled simulation.
// Run each (route, theme) N times and report the median — Lighthouse CI's recommended approach.
const RUNS_PER_ROUTE = Number(process.env.LH_RUNS ?? 3);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

const THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  seo: 90,
  "best-practices": 90,
};

const OUT_DIR = resolve("reports/lighthouse");
mkdirSync(OUT_DIR, { recursive: true });

function startNextServer() {
  return new Promise((resolveStart, rejectStart) => {
    const child = spawn("npm", ["run", "start", "--", "--port", PORT], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    });

    let ready = false;
    const onReady = () => {
      if (ready) return;
      ready = true;
      resolveStart(child);
    };

    child.stdout.on("data", (buf) => {
      const text = buf.toString();
      process.stdout.write(`[next] ${text}`);
      if (/ready|started|listening|local:/i.test(text)) onReady();
    });
    child.stderr.on("data", (buf) => {
      process.stderr.write(`[next:err] ${buf.toString()}`);
    });

    child.on("error", rejectStart);
    child.on("exit", (code) => {
      if (!ready) rejectStart(new Error(`next start exited with ${code} before ready`));
    });
  });
}

async function waitForUp() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await wait(500);
  }
  throw new Error(`${BASE} did not respond within 20s`);
}

async function runOne(chrome, route, theme) {
  const url = `${BASE}${route.path}`;

  // Emulate prefers-color-scheme via CDP so next-themes (enableSystem) adopts the requested
  // theme without forcing the app into dynamic rendering. The emulation persists for the
  // lifetime of the lighthouse run because lighthouse reuses the same chrome session.
  const client = await CDP({ port: chrome.port });
  try {
    await client.Emulation.setEmulatedMedia({
      features: [{ name: "prefers-color-scheme", value: theme }],
    });
  } finally {
    await client.close();
  }

  const flags = {
    port: chrome.port,
    output: ["json", "html"],
    logLevel: "error",
    onlyCategories: CATEGORIES,
  };

  const result = await lighthouse(url, flags);
  const lhr = result.lhr;
  const reportSlug = `${route.name}-${theme}`;

  writeFileSync(
    resolve(OUT_DIR, `${reportSlug}.json`),
    JSON.stringify(lhr, null, 2),
    "utf8",
  );
  writeFileSync(
    resolve(OUT_DIR, `${reportSlug}.html`),
    Array.isArray(result.report) ? result.report[1] : result.report,
    "utf8",
  );

  const scores = {};
  for (const c of CATEGORIES) {
    scores[c] = Math.round((lhr.categories[c]?.score ?? 0) * 100);
  }
  return { route: route.name, theme, scores };
}

async function main() {
  console.log(`Starting next start on :${PORT}…`);
  const server = await startNextServer().catch((err) => {
    console.error("Failed to start next server:", err);
    process.exit(1);
  });

  try {
    await waitForUp();
    console.log("Server is up. Launching headless Chrome…");

    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    });

    const results = [];
    try {
      // Warmup: the first lighthouse run pays a chrome JIT / process-startup cost that distorts
      // scores. Throwaway the first audit so the measured run hits a warm engine.
      process.stdout.write("  warmup… ");
      await runOne(chrome, ROUTES[0], "dark");
      process.stdout.write("done\n");

      for (const theme of THEMES) {
        for (const route of ROUTES) {
          process.stdout.write(`  audit ${route.path} (${theme}) x${RUNS_PER_ROUTE}… `);
          const runs = [];
          for (let i = 0; i < RUNS_PER_ROUTE; i++) {
            runs.push(await runOne(chrome, route, theme));
          }
          const scores = {};
          for (const c of CATEGORIES) {
            scores[c] = median(runs.map((r) => r.scores[c]));
          }
          const merged = { route: route.name, theme, scores };
          results.push(merged);
          process.stdout.write(
            CATEGORIES.map((c) => `${c}:${merged.scores[c]}`).join("  ") + "\n",
          );
        }
      }
    } finally {
      try {
        await chrome.kill();
      } catch {
        // Windows occasionally throws EPERM removing chrome's temp dir; the audits already ran.
      }
    }

    console.log("\nLighthouse summary");
    console.log("=".repeat(72));
    console.log(
      "route/theme".padEnd(22) +
        CATEGORIES.map((c) => c.slice(0, 8).padEnd(10)).join(""),
    );
    console.log("-".repeat(72));
    let failed = false;
    for (const r of results) {
      const row =
        `${r.route}/${r.theme}`.padEnd(22) +
        CATEGORIES.map((c) => {
          const v = r.scores[c];
          const ok = v >= THRESHOLDS[c];
          if (!ok) failed = true;
          return `${ok ? "✓" : "✗"} ${v}`.padEnd(10);
        }).join("");
      console.log(row);
    }
    console.log("=".repeat(72));
    console.log(`Reports written to ${OUT_DIR}`);

    if (failed) {
      console.error("\nOne or more categories scored below threshold.");
      process.exit(1);
    }
    console.log("\nAll categories ≥ 90 in every audited route + theme.");
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
