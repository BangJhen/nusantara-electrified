"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ConnectorType } from "@/types";

const CONNECTOR_COLORS = [
  "#3b82f6",
  "#60a5fa",
  "#22c55e",
  "#f59e0b",
  "#a78bfa",
  "#64748b",
];

interface Props {
  data: ConnectorType[];
}

export default function ConnectorDonut({ data }: Props) {
  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="connector_type"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={CONNECTOR_COLORS[index % CONNECTOR_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0f1c",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "12px",
          }}
          formatter={(value: number, name: string) => [value + " konektor", name]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
