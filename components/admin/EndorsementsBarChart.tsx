"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EndorsementByProject } from "@/types";

type Props = {
  data: EndorsementByProject[];
};

export function EndorsementsBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" />
        <XAxis
          dataKey="project"
          stroke="var(--color-muted)"
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-border)" }}
        />
        <YAxis
          stroke="var(--color-muted)"
          tick={{ fontSize: 11, fill: "var(--color-muted)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--color-border)" }}
          width={40}
        />
        <Tooltip
          cursor={{ fill: "var(--color-coral)", fillOpacity: 0.08 }}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-foreground)",
          }}
          labelStyle={{ color: "var(--color-muted)" }}
        />
        <Bar
          dataKey="count"
          fill="var(--color-teal)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
