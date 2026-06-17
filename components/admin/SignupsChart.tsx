"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimeSeriesPoint } from "@/types";

type Props = {
  data: TimeSeriesPoint[];
};

export function SignupsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" />
        <XAxis
          dataKey="label"
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
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-coral)", strokeDasharray: "2 2" }}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
            color: "var(--color-foreground)",
          }}
          labelStyle={{ color: "var(--color-muted)" }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name="Signups"
          stroke="var(--color-coral)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--color-coral)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
