"use client";

import SectionWrapper from "../ui/SectionWrapper";

const OPPORTUNITIES = [
  {
    title: "Cadangan Nikel Terbesar",
    desc: "Indonesia menguasai ~48% cadangan nikel global — bahan kunci baterai NMC.",
    icon: "⛏️",
  },
  {
    title: "Gigafactory Baterai",
    desc: "HLI 10 GWh beroperasi. CATL/IBC menargetkan 15+ GWh fase 2.",
    icon: "🔋",
  },
  {
    title: "Assembly EV Lokal",
    desc: "BYD, Hyundai, Wuling, VinFast membangun pabrik assembly di Indonesia.",
    icon: "🚗",
  },
  {
    title: "TKDN & Insentif",
    desc: "Subsidi EV terkait TKDN 40% mendorong lokalisasi rantai pasok.",
    icon: "🏛️",
  },
];

const RISKS = [
  {
    title: "Baterai LFP Tanpa Nikel",
    desc: "Shift global ke LFP (tanpa nikel) mengancam posisi strategis Indonesia.",
    icon: "⚠️",
  },
  {
    title: "21 Smelter Terhenti",
    desc: "Dari 106 proyek, 21 terhenti dan 5 dihentikan — ambisi vs realitas.",
    icon: "🏚️",
  },
  {
    title: "Grid 1.56x Lebih Kotor",
    desc: "Faktor emisi Indonesia 0.680 vs rata-rata global 0.435 kgCO₂/kWh.",
    icon: "🔥",
  },
  {
    title: "60.7 GW Batu Bara",
    desc: "Fleet PLTU terbesar ke-4 dunia. Dekarbonisasi grid butuh waktu dekade.",
    icon: "🏭",
  },
];

export default function ParadoxSection() {
  return (
    <SectionWrapper id="paradox">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Nickel &amp; Grid Paradox
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Transisi EV Indonesia penuh janji, tapi juga penuh kontradiksi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunity side */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-nickel-green-400" />
            <h3 className="text-sm font-medium text-nickel-green-400 uppercase tracking-wider">
              Peluang
            </h3>
          </div>
          {OPPORTUNITIES.map((item) => (
            <div
              key={item.title}
              className="glass rounded-xl p-5 border-l-2 border-nickel-green-500/50"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Risk side */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-coal-amber-400" />
            <h3 className="text-sm font-medium text-coal-amber-400 uppercase tracking-wider">
              Risiko
            </h3>
          </div>
          {RISKS.map((item) => (
            <div
              key={item.title}
              className="glass rounded-xl p-5 border-l-2 border-coal-amber-500/50"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
