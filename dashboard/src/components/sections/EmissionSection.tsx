"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import EmissionSlider from "../charts/EmissionSlider";
import CapacityMixChart from "../charts/CapacityMixChart";
import LcaComparisonChart from "../charts/LcaComparisonChart";
import SourceBadge from "../ui/SourceBadge";
import type { EmissionScenario, GridMetric, LcaFactor } from "@/types";

export default function EmissionSection() {
  const [scenarios, setScenarios] = useState<EmissionScenario[]>([]);
  const [gridData, setGridData] = useState<GridMetric[]>([]);
  const [lcaData, setLcaData] = useState<LcaFactor[]>([]);

  useEffect(() => {
    fetch("/data/emission-scenarios.json").then((r) => r.json()).then(setScenarios);
    fetch("/data/electricity-grid.json").then((r) => r.json()).then(setGridData);
    fetch("/data/lca-factors.json").then((r) => r.json()).then(setLcaData);
  }, []);

  return (
    <SectionWrapper id="emission">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Seberapa Hijau EV?
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl">
          EV lebih bersih dari kendaraan BBM, tapi seberapa bersih tergantung dari
          sumber listrik yang mengisi baterainya.
        </p>
      </div>

      {/* Interactive Slider */}
      <div className="glass rounded-2xl p-6 md:p-8 mb-8">
        <h3 className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">
          Simulasi: Emisi BEV Berdasarkan Grid Factor
        </h3>
        <EmissionSlider scenarios={scenarios} />
        <SourceBadge source="Ember / ICCT / skenario kalkulasi" confidence="medium_high" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RUPTL Capacity Mix */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
            Rencana Kapasitas Baru RUPTL 2025–2034
          </h3>
          <CapacityMixChart data={gridData} />
          <SourceBadge source="PLN/ESDM RUPTL 2025-2034" confidence="high" />
        </div>

        {/* LCA Comparison */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
            Emisi Siklus Hidup: ICE vs BEV (gCO₂e/km)
          </h3>
          <LcaComparisonChart data={lcaData} />
          <SourceBadge source="ICCT 2025" confidence="high" />
        </div>
      </div>
    </SectionWrapper>
  );
}
