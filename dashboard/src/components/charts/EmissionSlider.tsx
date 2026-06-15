"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  calculateBevEmission,
  calculateReductionVsIce,
  EMISSION_PRESETS,
} from "@/lib/emission-calc";
import { ICE_BASELINE_GCO2_PER_KM } from "@/lib/constants";
import type { EmissionScenario } from "@/types";

interface Props {
  scenarios: EmissionScenario[];
}

export default function EmissionSlider({ scenarios }: Props) {
  const [gridFactor, setGridFactor] = useState(0.68);

  const bevEmission = calculateBevEmission(gridFactor);
  const reduction = calculateReductionVsIce(bevEmission);
  const bevBarWidth = (bevEmission / ICE_BASELINE_GCO2_PER_KM) * 100;

  return (
    <div className="space-y-8">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {EMISSION_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setGridFactor(preset.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              Math.abs(gridFactor - preset.value) < 0.01
                ? "bg-ev-blue-500 text-white"
                : "glass text-slate-300 hover:text-white"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min="0.028"
          max="0.8"
          step="0.001"
          value={gridFactor}
          onChange={(e) => setGridFactor(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e, #f59e0b ${50}%, #ef4444)`,
          }}
          aria-label="Grid emission factor slider"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>0.028 (Bersih)</span>
          <span>0.800 (Kotor)</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-white">
            {gridFactor.toFixed(3)}
          </div>
          <div className="text-sm text-slate-400">kgCO₂e/kWh</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-ev-blue-400">
            {bevEmission.toFixed(1)}
          </div>
          <div className="text-sm text-slate-400">gCO₂e/km (BEV)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-heading font-bold text-nickel-green-400">
            -{reduction.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400">vs kendaraan BBM</div>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Kendaraan BBM (ICE)</span>
            <span className="text-slate-300">{ICE_BASELINE_GCO2_PER_KM} gCO₂e/km</span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
            <div className="h-full bg-coal-red-500/70 rounded-lg w-full" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">BEV (Use-Phase)</span>
            <span className="text-ev-blue-400 font-medium">{bevEmission.toFixed(1)} gCO₂e/km</span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
            <motion.div
              className="h-full bg-ev-blue-500/70 rounded-lg"
              animate={{ width: `${Math.min(bevBarWidth, 100)}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
