"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { COLORS } from "@/lib/constants";
import type { BevSalesRecord } from "@/types";

interface Props {
  data: BevSalesRecord[];
}

export default function BevGrowthChart({ data }: Props) {
  if (!data.length) return <div className="h-80 animate-pulse bg-white/5 rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="year"
          stroke={COLORS.textMuted}
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          yAxisId="units"
          stroke={COLORS.textMuted}
          fontSize={12}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <YAxis
          yAxisId="growth"
          orientation="right"
          stroke={COLORS.textMuted}
          fontSize={12}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0f1c",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            color: "#e2e8f0",
          }}
          formatter={(value: number, name: string) => {
            if (name === "bev_wholesales_units")
              return [value.toLocaleString("id-ID") + " unit", "Wholesales"];
            if (name === "growth_yoy_pct")
              return [value?.toFixed(1) + "%", "Pertumbuhan YoY"];
            return [value, name];
          }}
          labelFormatter={(label) => `Tahun ${label}`}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: COLORS.textSecondary }}
          formatter={(value) => {
            if (value === "bev_wholesales_units") return "Unit BEV";
            if (value === "growth_yoy_pct") return "Pertumbuhan YoY (%)";
            return value;
          }}
        />
        <Bar
          yAxisId="units"
          dataKey="bev_wholesales_units"
          fill={COLORS.evBlue}
          radius={[4, 4, 0, 0]}
          opacity={0.85}
        />
        <Line
          yAxisId="growth"
          type="monotone"
          dataKey="growth_yoy_pct"
          stroke={COLORS.evBlueGlow}
          strokeWidth={2}
          dot={{ fill: COLORS.evBlueGlow, r: 4 }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
