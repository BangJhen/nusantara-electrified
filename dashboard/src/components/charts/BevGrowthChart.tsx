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
  LabelList
} from "recharts";
import { COLORS } from "@/lib/constants";
import type { BevSalesRecord } from "@/types";

interface Props {
  data: BevSalesRecord[];
}

export default function BevGrowthChart({ data }: Props) {
  if (!data.length) return <div className="h-[250px] animate-pulse bg-gray-100 rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.chartGrid} vertical={false} />
        <XAxis
          dataKey="year"
          stroke={COLORS.textPrimary}
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: COLORS.textPrimary }}
        />
        <YAxis
          yAxisId="units"
          stroke={COLORS.textPrimary}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <YAxis
          yAxisId="growth"
          orientation="right"
          stroke={COLORS.rust}
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            color: COLORS.textPrimary,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
          formatter={(value: number, name: string) => {
            if (name === "bev_wholesales_units")
              return [value.toLocaleString("id-ID") + " unit", "Wholesales"];
            if (name === "growth_yoy_pct")
              return [value?.toFixed(1) + "%", "Kenaikan"];
            return [value, name];
          }}
          labelFormatter={(label) => `Tahun ${label}`}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: COLORS.textSecondary }}
          formatter={(value) => {
            if (value === "bev_wholesales_units") return "Unit BEV";
            if (value === "growth_yoy_pct") return "Kenaikan (%)";
            return value;
          }}
        />
        <Bar
          yAxisId="units"
          dataKey="bev_wholesales_units"
          fill={COLORS.dark}
          radius={[4, 4, 0, 0]}
          barSize={40}
        >
           <LabelList dataKey="bev_wholesales_units" position="top" fill={COLORS.dark} fontSize={10} formatter={(v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
        </Bar>
        <Line
          yAxisId="growth"
          type="linear"
          dataKey="growth_yoy_pct"
          stroke={COLORS.rust}
          strokeWidth={3}
          dot={{ fill: "#fff", stroke: COLORS.rust, strokeWidth: 2, r: 4 }}
          connectNulls
        >
           <LabelList dataKey="growth_yoy_pct" position="bottom" fill={COLORS.rust} fontSize={10} formatter={(v: number) => v ? `${v}%` : ''} offset={10} />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
}