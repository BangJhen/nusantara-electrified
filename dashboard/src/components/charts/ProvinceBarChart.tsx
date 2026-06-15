"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "@/lib/constants";
import type { ProvinceStation } from "@/types";

interface Props {
  data: ProvinceStation[];
}

export default function ProvinceBarChart({ data }: Props) {
  if (!data.length) return null;

  const formatted = data.map((d) => ({
    ...d,
    province: d.province.replace("Jawa ", "Jw ").replace("Sumatera ", "Sum "),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={formatted} layout="vertical" margin={{ left: 0, right: 20 }}>
        <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
        <YAxis
          type="category"
          dataKey="province"
          stroke={COLORS.textMuted}
          fontSize={11}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0f1c",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "12px",
          }}
          formatter={(value: number) => [value + " stasiun", "Jumlah"]}
        />
        <Bar dataKey="station_count" fill={COLORS.evBlue} radius={[0, 4, 4, 0]} opacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  );
}
