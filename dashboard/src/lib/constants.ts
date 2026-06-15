export const COLORS = {
  evBlue: "#3b82f6",
  evBlueGlow: "#60a5fa",
  evBlueDark: "#1e3a5f",
  nickelGreen: "#22c55e",
  nickelGreenLight: "#4ade80",
  coalAmber: "#f59e0b",
  coalAmberLight: "#fbbf24",
  coalRed: "#ef4444",
  navyBg: "#060a14",
  navySurface: "#0a0f1c",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
} as const;

export const CHART_COLORS = {
  primary: COLORS.evBlue,
  secondary: COLORS.nickelGreen,
  tertiary: COLORS.coalAmber,
  danger: COLORS.coalRed,
  muted: COLORS.textMuted,
} as const;

export const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "adoption", label: "Adopsi" },
  { id: "infrastructure", label: "Infrastruktur" },
  { id: "emission", label: "Emisi" },
  { id: "industry", label: "Industri" },
  { id: "paradox", label: "Paradoks" },
  { id: "barriers", label: "Hambatan" },
  { id: "closing", label: "Penutup" },
] as const;

export const ICE_BASELINE_GCO2_PER_KM = 235;
export const BEV_EFFICIENCY_KWH_PER_KM = 0.19;
