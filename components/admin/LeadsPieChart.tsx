"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { LeadBreakdown } from "@/types";

type Props = {
  data: LeadBreakdown[];
};

const COLORS = ["#ff6b5c", "#5ec4b6", "#e8b34b", "#8ea0b2"];

export function LeadsPieChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="source"
          innerRadius={55}
          outerRadius={95}
          stroke="var(--color-surface)"
          strokeWidth={2}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-foreground)",
          }}
          labelStyle={{ color: "var(--color-muted)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
