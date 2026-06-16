"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 5, suffix: "+", label: "Years building software" },
  { value: 5, label: "Apps in production" },
  { value: 12, label: "Core tools in active use" },
  { value: 24, suffix: "h", label: "Reply window for new leads" },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }

    const t0 = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      setValue(Math.round(easeOutCubic(t) * target));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);

  return value;
}

function StatCard({ stat, animate }: { stat: Stat; animate: boolean }) {
  const value = useCountUp(stat.value, animate);
  return (
    <li className="flex h-full min-h-[180px] flex-col justify-between rounded-2xl border border-border bg-surface p-6">
      <p className="font-display text-4xl font-semibold tabular-nums text-foreground md:text-5xl">
        {value}
        {stat.suffix ?? ""}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{stat.label}</p>
    </li>
  );
}

export function Stats() {
  const ref = useRef<HTMLElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAnimate(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="stats-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / by the numbers
        </p>
        <h2
          id="stats-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          What it adds up to
        </h2>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} animate={animate} />
        ))}
      </ul>
    </section>
  );
}
