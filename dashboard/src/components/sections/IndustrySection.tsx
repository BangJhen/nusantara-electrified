"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SourceBadge from "../ui/SourceBadge";
import type { IndustryInvestment } from "@/types";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  operational: { bg: "bg-nickel-green-500/20", text: "text-nickel-green-400" },
  operational_or_ramping: { bg: "bg-nickel-green-500/20", text: "text-nickel-green-400" },
  construction: { bg: "bg-ev-blue-500/20", text: "text-ev-blue-400" },
  groundbreaking: { bg: "bg-coal-amber-500/20", text: "text-coal-amber-400" },
  planned: { bg: "bg-coal-amber-500/20", text: "text-coal-amber-400" },
  portfolio: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

const STATUS_LABELS: Record<string, string> = {
  operational: "Operasional",
  operational_or_ramping: "Operasional",
  construction: "Konstruksi",
  groundbreaking: "Groundbreaking",
  planned: "Direncanakan",
  portfolio: "Portfolio",
};

export default function IndustrySection() {
  const [investments, setInvestments] = useState<IndustryInvestment[]>([]);

  useEffect(() => {
    fetch("/data/industry-investments.json")
      .then((r) => r.json())
      .then(setInvestments);
  }, []);

  const totalInvestment = investments.reduce(
    (s, i) => s + (i.value_usd_million || 0),
    0
  );

  return (
    <SectionWrapper id="industry">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Dari Nikel ke Mobil Listrik
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl">
          Indonesia ingin naik kelas — dari eksportir bahan mentah menjadi pemain
          industri baterai dan kendaraan listrik.
        </p>
      </div>

      {/* Value Chain Diagram */}
      <div className="glass rounded-2xl p-6 md:p-8 mb-8 overflow-x-auto">
        <h3 className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">
          Rantai Nilai EV Indonesia
        </h3>
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {[
            { icon: "⛏️", label: "Nikel", sub: "Sulawesi/Maluku" },
            { icon: "🏭", label: "Smelter", sub: "106 proyek" },
            { icon: "🧪", label: "Material Baterai", sub: "MHP/Katoda" },
            { icon: "🔋", label: "Cell", sub: "HLI, CATL/IBC" },
            { icon: "📦", label: "Pack", sub: "Assembly lokal" },
            { icon: "🚗", label: "EV Assembly", sub: "BYD, Hyundai, Wuling" },
            { icon: "⚡", label: "SPKLU", sub: "2.426 stasiun" },
          ].map((node, i, arr) => (
            <div key={node.label} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl glass-strong flex items-center justify-center text-2xl mb-2">
                  {node.icon}
                </div>
                <div className="text-xs font-medium text-white">{node.label}</div>
                <div className="text-[10px] text-slate-500">{node.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="mx-2 flex-shrink-0">
                  <svg width="24" height="12" viewBox="0 0 24 12" className="text-ev-blue-500/50">
                    <path d="M0 6h20m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Investment summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-heading font-bold text-white">
            ${(totalInvestment / 1000).toFixed(1)}B+
          </div>
          <div className="text-xs text-slate-400">Total Investasi</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-heading font-bold text-nickel-green-400">10+</div>
          <div className="text-xs text-slate-400">GWh Kapasitas Baterai</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-heading font-bold text-ev-blue-400">6+</div>
          <div className="text-xs text-slate-400">Proyek Utama</div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <div className="text-2xl font-heading font-bold text-coal-amber-400">40%</div>
          <div className="text-xs text-slate-400">TKDN Minimum</div>
        </div>
      </div>

      {/* Investment cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investments
          .filter((inv) => inv.category !== "nickel_smelter")
          .map((inv) => {
            const statusStyle =
              STATUS_COLORS[inv.status] || STATUS_COLORS.portfolio;
            return (
              <div key={inv.project_or_company} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium text-white">
                    {inv.project_or_company}
                  </h4>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    {STATUS_LABELS[inv.status] || inv.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <div>{inv.location}</div>
                  {inv.value_usd_million && (
                    <div className="text-slate-300">
                      ${inv.value_usd_million.toLocaleString()}M
                    </div>
                  )}
                  <div className="text-slate-500">{inv.capacity}</div>
                </div>
              </div>
            );
          })}
      </div>
      <SourceBadge source="Kemenperin/BKPM/Reuters/Company releases" confidence="medium_high" />
    </SectionWrapper>
  );
}
