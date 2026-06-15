"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SectionWrapper from "../ui/SectionWrapper";
import ProvinceBarChart from "../charts/ProvinceBarChart";
import ConnectorDonut from "../charts/ConnectorDonut";
import SourceBadge from "../ui/SourceBadge";
import type { ProvinceStation, ConnectorType, OperatorStation } from "@/types";

const SpkluMap = dynamic(() => import("../map/SpkluMap"), { ssr: false });

export default function InfrastructureSection() {
  const [provinces, setProvinces] = useState<ProvinceStation[]>([]);
  const [connectors, setConnectors] = useState<ConnectorType[]>([]);
  const [operators, setOperators] = useState<OperatorStation[]>([]);

  useEffect(() => {
    fetch("/data/spklu-provinces.json").then((r) => r.json()).then(setProvinces);
    fetch("/data/spklu-connectors.json").then((r) => r.json()).then(setConnectors);
    fetch("/data/spklu-operators.json").then((r) => r.json()).then(setOperators);
  }, []);

  const totalStations = provinces.reduce((s, p) => s + p.station_count, 0);
  const plnShare = operators.length
    ? ((operators[0]?.station_count / totalStations) * 100).toFixed(1)
    : "—";

  return (
    <SectionWrapper id="infrastructure">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Infrastruktur Mengejar
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl">
          {totalStations.toLocaleString("id-ID")} stasiun SPKLU tersebar di 35 provinsi —
          tapi distribusinya belum merata.
        </p>
      </div>

      {/* Map */}
      <div className="glass rounded-2xl overflow-hidden mb-8" style={{ height: "480px" }}>
        <SpkluMap />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Province bar chart */}
        <div className="lg:col-span-1 glass rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
            Stasiun per Provinsi (Top 10)
          </h3>
          <ProvinceBarChart data={provinces.slice(0, 10)} />
          <SourceBadge source="Dataset SPKLU/PLN" confidence="medium" />
        </div>

        {/* Connector donut */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
            Tipe Konektor
          </h3>
          <ConnectorDonut data={connectors} />
          <SourceBadge source="Dataset SPKLU/PLN" confidence="medium" />
        </div>

        {/* Operator concentration */}
        <div className="glass rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
              Konsentrasi Operator
            </h3>
            <div className="text-5xl font-heading font-bold text-ev-blue-400 mb-2">
              {plnShare}%
            </div>
            <div className="text-sm text-slate-400 mb-4">
              Stasiun dikelola PLN
            </div>
            <div className="space-y-2">
              {operators.slice(0, 5).map((op) => (
                <div key={op.operator} className="flex justify-between text-sm">
                  <span className="text-slate-300 truncate mr-2">
                    {op.operator.replace(
                      "PERUSAHAAN PERSEROAN (PERSERO) PT. PERUSAHAAN LISTRIK NEGARA",
                      "PLN"
                    )}
                  </span>
                  <span className="text-slate-500">{op.station_count}</span>
                </div>
              ))}
            </div>
          </div>
          <SourceBadge source="Dataset SPKLU/PLN" confidence="medium" />
        </div>
      </div>
    </SectionWrapper>
  );
}
