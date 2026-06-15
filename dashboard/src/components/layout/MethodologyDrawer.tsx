"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SourceCatalogEntry } from "@/types";

interface Props {
  onClose: () => void;
}

const CREDIBILITY_COLORS: Record<string, string> = {
  high: "text-nickel-green-400 bg-nickel-green-500/10",
  medium_high: "text-coal-amber-400 bg-coal-amber-500/10",
  medium: "text-coal-amber-500 bg-coal-amber-500/10",
};

export default function MethodologyDrawer({ onClose }: Props) {
  const [sources, setSources] = useState<SourceCatalogEntry[]>([]);

  useEffect(() => {
    fetch("/data/source-catalog.json")
      .then((r) => r.json())
      .then(setSources);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-navy-900 border-l border-white/5 z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-heading font-bold text-white">
              Metodologi &amp; Sumber
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Methodology notes */}
          <div className="mb-8 space-y-4">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              Catatan Metodologi
            </h3>
            <div className="text-sm text-slate-400 space-y-3 leading-relaxed">
              <p>
                Dashboard ini menggunakan data dari sumber terbuka dan resmi.
                Semua angka disertai tingkat kepercayaan (confidence level).
              </p>
              <p>
                <strong className="text-slate-300">Grid emission factor (0.680 kgCO₂e/kWh)</strong>{" "}
                berasal dari estimasi Ember — bukan angka resmi KLHK/ESDM.
              </p>
              <p>
                <strong className="text-slate-300">Data GAIKINDO 2020-2021</strong>{" "}
                di-cross-check dari sumber ICCT; angka final perlu verifikasi terhadap
                infografis resmi.
              </p>
              <p>
                <strong className="text-slate-300">Emisi use-phase</strong> dihitung sebagai:
                grid_factor × efisiensi BEV (0.19 kWh/km) × 1000. Tidak mencakup
                emisi manufacturing/lifecycle.
              </p>
              <p>
                <strong className="text-slate-300">Data SPKLU</strong> dari dataset lokal PLN
                — URL upstream perlu dikonfirmasi untuk sitasi final.
              </p>
            </div>
          </div>

          {/* Source catalog */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-4">
              Katalog Sumber ({sources.length})
            </h3>
            <div className="space-y-3">
              {sources.map((source) => (
                <div
                  key={source.source_name}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium text-white">
                      {source.source_name}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                        CREDIBILITY_COLORS[source.credibility] || "text-slate-500 bg-slate-500/10"
                      }`}
                    >
                      {source.credibility}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>{source.data_domain} • {source.data_format}</div>
                    {source.notes && (
                      <div className="text-slate-600 italic">{source.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
