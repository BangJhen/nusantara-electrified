"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
import { COLORS } from "@/lib/constants";
import type { ProvinceStation } from "@/types";

interface Props {
  data: ProvinceStation[];
}

export default function ProvinceBarChart({ data }: Props) {
  if (!data.length) return <div className="h-[250px] animate-pulse bg-gray-100 rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.chartGrid} horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="province"
          stroke={COLORS.textPrimary}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          cursor={{ fill: "rgba(30, 58, 138, 0.05)" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            color: COLORS.textPrimary,
          }}
          formatter={(value: number) => [value + " Lokasi", "SPKLU"]}
        />
        <Bar
          dataKey="station_count"
          fill={COLORS.dark}
          radius={[0, 4, 4, 0]}
          barSize={20}
        >
           <LabelList dataKey="station_count" position="right" fill={COLORS.textPrimary} fontSize={11} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}