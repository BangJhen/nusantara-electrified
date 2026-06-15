import { ICE_BASELINE_GCO2_PER_KM, BEV_EFFICIENCY_KWH_PER_KM } from "./constants";

export function calculateBevEmission(gridFactor: number): number {
  return gridFactor * BEV_EFFICIENCY_KWH_PER_KM * 1000;
}

export function calculateReductionVsIce(bevGco2PerKm: number): number {
  return ((ICE_BASELINE_GCO2_PER_KM - bevGco2PerKm) / ICE_BASELINE_GCO2_PER_KM) * 100;
}

export const EMISSION_PRESETS = [
  { label: "Indonesia (Saat Ini)", value: 0.68, color: "#ef4444" },
  { label: "Rata-rata Global", value: 0.435, color: "#f59e0b" },
  { label: "Grid Bersih", value: 0.2, color: "#22c55e" },
  { label: "Norwegia", value: 0.028, color: "#3b82f6" },
] as const;
