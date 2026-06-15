"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { GridMetric } from "@/types";

const CAPACITY_ITEMS = [
  { key: "solar_target_ruplt", label: "Solar", color: "#fbbf24" },
  { key: "hydro_target_ruplt", label: "Hydro", color: "#3b82f6" },
  { key: "wind_target_ruplt", label: "Wind", color: "#60a5fa" },
  { key: "geothermal_target_ruplt", label: "Geothermal", color: "#f97316" },
  { key: "storage_new_capacity_ruplt", label: "Storage", color: "#a78bfa" },
  { key: "fossil_new_capacity_ruplt", label: "Fossil", color: "#ef4444" },
];

interface Props {
  data: GridMetric[];
}

export default function CapacityMixChart({ data }: Props) {
  if (!data.length) return <div className="h-64 animate-pulse bg-white/5 rounded-xl" />;

  const chartData = CAPACITY_ITEMS.map((item) => {
    const metric = data.find((d) => d.metric === item.key);
    return {
      name: item.label,
      value: metric ? Number(metric.value) : 0,
      color: item.color,
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
        <XAxis
          type="number"
          stroke="#64748b"
          fontSize={11}
          tickLine={false}
          tickFormatter={(v) => `${v} GW`}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="#64748b"
          fontSize={11}
          tickLine={false}
          width={65}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0f1c",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value} GW`, "Kapasitas"]}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
