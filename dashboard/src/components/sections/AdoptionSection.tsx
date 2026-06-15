"use client";

import { useEffect, useState } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import BevGrowthChart from "../charts/BevGrowthChart";
import SourceBadge from "../ui/SourceBadge";
import type { BevSalesRecord, MotorcycleSummary } from "@/types";

export default function AdoptionSection() {
  const [bevData, setBevData] = useState<BevSalesRecord[]>([]);
  const [motoData, setMotoData] = useState<MotorcycleSummary[]>([]);

  useEffect(() => {
    fetch("/data/bev-sales.json")
      .then((r) => r.json())
      .then(setBevData);
    fetch("/data/motorcycle-market.json")
      .then((r) => r.json())
      .then(setMotoData);
  }, []);

  const latestMoto = motoData[0];
  const latestBev = bevData[bevData.length - 1];

  return (
    <SectionWrapper id="adoption">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          EV Melaju Cepat
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl">
          Dari 125 unit di 2020 menjadi lebih dari 100 ribu unit di 2025. Pertumbuhan BEV
          Indonesia melonjak 832 kali lipat dalam 5 tahun.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
              Penjualan BEV Tahunan (Wholesales)
            </h3>
            <BevGrowthChart data={bevData} />
            <SourceBadge source="GAIKINDO / ICCT" confidence="high" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Konteks Pasar
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-heading font-bold text-white">
                  {latestMoto
                    ? (latestMoto.domestic_units / 1_000_000).toFixed(1)
                    : "—"}{" "}
                  juta
                </div>
                <div className="text-sm text-slate-400">
                  Motor domestik/tahun (2025)
                </div>
              </div>
              <div>
                <div className="text-2xl font-heading font-bold text-ev-blue-400">
                  {latestBev
                    ? latestBev.bev_wholesales_units.toLocaleString("id-ID")
                    : "—"}
                </div>
                <div className="text-sm text-slate-400">BEV wholesales (2025)</div>
              </div>
              <div className="pt-3 border-t border-white/5">
                <p className="text-sm text-slate-400 leading-relaxed">
                  Motor listrik masih minim, tapi 6,4 juta pasar dua roda per
                  tahun adalah peluang transformasi yang jauh lebih besar dari
                  mobil.
                </p>
              </div>
            </div>
            <SourceBadge source="AISI / GAIKINDO" />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
