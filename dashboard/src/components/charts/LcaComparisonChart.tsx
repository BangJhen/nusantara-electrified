"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { COLORS } from "@/lib/constants";
import type { LcaFactor } from "@/types";

interface Props {
  data: LcaFactor[];
}

export default function LcaComparisonChart({ data }: Props) {
  if (!data.length) return <div className="h-64 animate-pulse bg-white/5 rounded-xl" />;

  const segments = ["A_car", "SUV", "MPV", "Scooter"];
  const segmentLabels: Record<string, string> = {
    A_car: "Mobil A",
    SUV: "SUV",
    MPV: "MPV",
    Scooter: "Skuter",
  };

  const chartData = segments.map((seg) => {
    const ice = data.find(
      (d) => d.segment === seg && d.vehicle_type === "gasoline_ice"
    );
    const bevBaseline = data.find(
      (d) =>
        d.segment === seg &&
        d.vehicle_type === "bev" &&
        d.scenario === "baseline" &&
        d.year === 2023
    );
    const bevClean = data.find(
      (d) =>
        d.segment === seg &&
        d.vehicle_type === "bev" &&
        d.scenario === "net_zero_2060" &&
        d.year === 2030
    );

    return {
      segment: segmentLabels[seg] || seg,
      ICE: ice?.gco2e_per_km || 0,
      "BEV (Grid Saat Ini)": bevBaseline?.gco2e_per_km || 0,
      "BEV (Net Zero 2060)": bevClean?.gco2e_per_km || 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="segment" stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
        <YAxis stroke={COLORS.textMuted} fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0f1c",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#e2e8f0",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value} gCO₂e/km`, ""]}
        />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
        <Bar dataKey="ICE" fill="#ef4444" opacity={0.8} radius={[3, 3, 0, 0]} />
        <Bar dataKey="BEV (Grid Saat Ini)" fill="#3b82f6" opacity={0.8} radius={[3, 3, 0, 0]} />
        <Bar dataKey="BEV (Net Zero 2060)" fill="#22c55e" opacity={0.8} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
