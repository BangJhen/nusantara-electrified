"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SpkluMap = dynamic(() => import("@/components/map/SpkluMap"), {
  ssr: false,
});

// ─── Cursor-following tooltip ───────────────────────────────────────────────
function useCursorTooltip() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);
  return { pos, onMouseMove };
}

function FloatingTooltip({ pos, children }: { pos: { x: number; y: number }; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 16, y: -8 });

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ox = pos.x + 16 + width > vw ? -(width + 16) : 16;
    const oy = pos.y - 8 - height < 0 ? 16 : -8;
    setOffset({ x: ox, y: oy });
  }, [pos]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-[9999] rounded-xl border border-brand-border bg-white/95 px-3 py-2 text-xs shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-none"
      style={{ left: pos.x + offset.x, top: pos.y + offset.y }}
    >
      {children}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

type BevRecord = {
  year: number;
  bev_wholesales_units: number;
  growth_yoy_pct: number | null;
};

type ProvinceRecord = {
  province: string;
  station_count: number;
};

type OperatorRecord = {
  operator: string;
  station_count: number;
};

type ConnectorRecord = {
  connector_type: string;
  count: number;
};

const BRAND = {
  navy: "#081D57",
  blue: "#1267D8",
  blueDark: "#0B4FB4",
  orange: "#FF6B00",
  teal: "#12B6C8",
  green: "#2F8F46",
  gray: "#7A8CAA",
  border: "#D8E5F3",
  soft: "#EAF3FF",
};

const operatorColors = [
  BRAND.blue,
  BRAND.teal,
  "#6F4EB8",
  BRAND.orange,
  "#91A4C4",
];

const javaProvinceNames = new Set([
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Timur",
  "Jawa Tengah",
  "Banten",
  "DI Yogyakarta",
  "Daerah Istimewa Yogyakarta",
]);

export default function Home() {
  const [bevData, setBevData] = useState<BevRecord[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceRecord[]>([]);
  const [operatorData, setOperatorData] = useState<OperatorRecord[]>([]);
  const [connectorData, setConnectorData] = useState<ConnectorRecord[]>([]);
  const [yearRange, setYearRange] = useState("2020-2025");
  const [region, setRegion] = useState("Semua Wilayah");
  const [lastUpdated, setLastUpdated] = useState("20 Mei 2025");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/bev-sales.json").then((r) => r.json()),
      fetch("/data/spklu-provinces.json").then((r) => r.json()),
      fetch("/data/spklu-operators.json").then((r) => r.json()),
      fetch("/data/spklu-connectors.json").then((r) => r.json()),
    ]).then(([bev, provinces, operators, connectors]) => {
      setBevData(bev);
      setProvinceData(provinces);
      setOperatorData(operators);
      setConnectorData(connectors);
    });
  }, []);

  const filteredBev = useMemo(() => {
    const [start, end] = yearRange.split("-").map(Number);
    return bevData.filter((item) => item.year >= start && item.year <= end);
  }, [bevData, yearRange]);

  const visibleProvinceData = useMemo(() => {
    const filtered = provinceData.filter((item) => {
      if (region === "Jawa") return javaProvinceNames.has(item.province);
      if (region === "Luar Jawa") return !javaProvinceNames.has(item.province);
      return true;
    });
    return filtered.slice(0, 8);
  }, [provinceData, region]);

  const totalSpklu = useMemo(
    () => operatorData.reduce((sum, item) => sum + item.station_count, 0) || 2426,
    [operatorData]
  );

  const plnStations =
    operatorData.find((item) => item.operator.includes("PERUSAHAAN LISTRIK NEGARA"))
      ?.station_count ?? 2154;

  const plnShare = totalSpklu ? (plnStations / totalSpklu) * 100 : 88.8;
  const latestBev = filteredBev[filteredBev.length - 1]?.bev_wholesales_units ?? 103931;
  const totalConnectors = connectorData.reduce((sum, item) => sum + item.count, 0) || 3053;

  const operatorDonutData = useMemo(() => {
    const top = operatorData.slice(0, 4).map((item, index) => ({
      name: shortOperator(item.operator),
      value: item.station_count,
      color: operatorColors[index],
    }));
    const topTotal = top.reduce((sum, item) => sum + item.value, 0);
    return [
      ...top,
      {
        name: "Lainnya",
        value: Math.max(totalSpklu - topTotal, 0),
        color: operatorColors[4],
      },
    ];
  }, [operatorData, totalSpklu]);

  const javaDistribution = [
    { name: "Jawa", value: 78.9, color: BRAND.blue },
    { name: "Luar Jawa", value: 21.1, color: BRAND.teal },
  ];

  function refreshData() {
    setRefreshing(true);
    setLastUpdated(new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date()));
    window.setTimeout(() => setRefreshing(false), 650);
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] text-brand-navy">
      <Topbar />

      <main className="mx-auto max-w-[1760px] p-3 lg:p-4">

            <section className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <KpiCard
                icon="car-electric"
                label="Penjualan BEV 2025"
                value={formatId(latestBev)}
                suffix="unit terjual"
                color="blue"
              />
              <KpiCard
                icon="rocket"
                label="Kenaikan Penjualan"
                value=">800x"
                suffix="dari tahun 2020"
                color="orange"
              />
              <KpiCard
                icon="charging-station"
                label="SPKLU Nasional"
                value={formatId(totalSpklu)}
                suffix="titik lokasi aktif"
                color="teal"
              />
              <KpiCard
                icon="pln-bolt"
                label="Dominasi Jaringan PLN"
                value={`${plnShare.toFixed(1).replace(".", ",")}%`}
                suffix="pangsa infrastruktur"
                color="blue"
              />
              <KpiCard
                icon="co2-cloud"
                label="Faktor Emisi Listrik"
                value="0,680"
                suffix="kgCO₂e/kWh"
                color="green"
              />
              <KpiCard
                icon="leaf-shield"
                label="Potensi Reduksi Emisi"
                value="67%"
                suffix="vs kendaraan bensin"
                color="green"
              />
            </section>

            <section className="grid grid-cols-1 gap-3 xl:grid-cols-12">
              <Panel className="xl:col-span-4" title="Akselerasi Penjualan BEV">
                <div className="h-[310px]">
                  <GrowthChart data={filteredBev} />
                </div>
              </Panel>

              <Panel className="xl:col-span-5" title="Sebaran SPKLU">
                <div className="grid h-[310px] grid-cols-1 gap-4 md:grid-cols-[1.45fr_1fr]">
                  <div className="overflow-hidden rounded-2xl border border-brand-border bg-[#F5F9FF] shadow-inner relative">
                    <SpkluMap selectedProvince={selectedProvince} />
                  </div>
                  <div className="flex min-h-0 flex-col gap-2.5">
                    <div className="rounded-xl bg-blue-50/80 border border-blue-100 px-3 py-2 flex gap-2.5 items-start shadow-sm">
                      <div className="mt-0.5 text-brand-blue">
                         <Icon name="pin" className="h-4 w-4" />
                      </div>
                      <p className="text-[11px] font-medium leading-tight text-brand-navy">
                        <strong className="font-extrabold block mb-0.5 text-brand-blue">Kilas Insight</strong>
                        Fasilitas daya publik mayoritas masih terpusat di kawasan Jawa dan kota strategis.
                      </p>
                    </div>
                    
                    <div className="flex-1 rounded-xl border border-brand-border bg-white p-3 shadow-sm flex flex-col min-h-0">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Distribusi SPKLU</h3>
                        <Icon name="trend" className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                      <div className="min-h-0 flex-1">
                        <ProvinceMiniBar 
                          data={visibleProvinceData} 
                          selectedProvince={selectedProvince}
                          onSelectProvince={setSelectedProvince}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel className="xl:col-span-3" title="Ekosistem Operator SPKLU">
                <div className="h-[310px]">
                  <OperatorDonut data={operatorDonutData} total={totalSpklu} />
                </div>
              </Panel>

              <Panel className="xl:col-span-3" title="Listrik & Emisi">
                <EmissionPanel />
              </Panel>

              <Panel className="xl:col-span-3" title="Target Nasional 2030">
                <TargetPanel />
              </Panel>

              <Panel className="xl:col-span-2" title="Distribusi Pengisian Daya">
                <JavaDistribution data={javaDistribution} />
              </Panel>

              <Panel className="xl:col-span-4" title="3 Ketegangan Utama Ekosistem EV Indonesia">
                <TensionPanel />
              </Panel>

              <Panel className="xl:col-span-6" title="Jenis Konektor SPKLU">
                <ConnectorPanel data={connectorData} total={totalConnectors} />
              </Panel>

              <Panel className="xl:col-span-6" title="RUPTL 2025–2034: Kapasitas Baru">
                <RupltPanel />
              </Panel>
            </section>

            <section className="mt-3">
              <FooterBanner />
            </section>
          </main>
    </div>
  );
}

function Topbar() {
  return (
    <header className="flex h-[86px] items-center justify-between border-b border-brand-border bg-white px-4 lg:px-6">
      <img
        src="/Logo%20EV%20Indonesia.png"
        alt="Nusantara Electrified — EV Indonesia"
        className="h-[60px] w-auto object-contain"
      />

      <img
        src="/Header%20Satria%20Data.png"
        alt="Satria Data — Puspresnas, BPTI, Kampus Merdeka"
        className="hidden h-[60px] w-auto object-contain xl:block"
      />
    </header>
  );
}

function FilterSelect({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-12 min-w-[220px] items-center gap-3 rounded-xl border border-brand-border bg-white px-4 shadow-panel">
      <Icon name={icon} className="h-5 w-5 text-brand-navy" />
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm font-semibold text-brand-navy outline-none"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function KpiCard({
  icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  suffix: string;
  color: "blue" | "orange" | "teal" | "green";
}) {
  const colorText = {
    blue: "text-brand-blue",
    orange: "text-brand-orange",
    teal: "text-brand-teal",
    green: "text-brand-green",
  }[color];

  const colorBorderHover = {
    blue: "hover:border-blue-400",
    orange: "hover:border-orange-400",
    teal: "hover:border-teal-400",
    green: "hover:border-green-400",
  }[color];

  return (
    <article className={`group relative flex min-h-[120px] flex-col justify-center gap-1 overflow-hidden rounded-2xl border border-brand-border bg-white p-5 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${colorBorderHover}`}>
      {/* Decorative large icon on the background */}
      <div className={`absolute -right-4 -top-4 opacity-[0.04] transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6 ${colorText}`}>
        <Icon name={icon} className="h-32 w-32" />
      </div>

      <div className="relative z-10 flex items-start justify-between mb-1 gap-2">
        <p className="text-xs font-bold text-slate-600 tracking-wide uppercase leading-snug">{label}</p>
        <div className={`shrink-0 ${colorText} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 drop-shadow-sm`}>
          <Icon name={icon} className="h-7 w-7" />
        </div>
      </div>
      
      <div className="relative z-10 mt-auto flex items-baseline gap-2">
        <span className={`font-heading text-[32px] font-black leading-none tracking-tight ${colorText}`}>
          {value}
        </span>
      </div>
      
      {suffix && (
        <p className="relative z-10 text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{suffix}</p>
      )}
    </article>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`dashboard-panel ${className}`}>
      <div className="flex items-center justify-between border-b border-brand-border px-5 py-3">
        <h2 className="font-heading text-lg font-bold tracking-wide text-brand-navy">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </article>
  );
}

function GrowthChart({ data }: { data: BevRecord[] }) {
  const [hover, setHover] = useState<BevRecord | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();
  const width = 680;
  const height = 300;
  const left = 58;
  const right = 72;
  const top = 38;
  const bottom = 44;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const maxUnits = Math.max(125000, ...data.map((item) => item.bev_wholesales_units));
  const maxGrowth = Math.max(1600, ...data.map((item) => item.growth_yoy_pct ?? 0));
  const step = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  const xFor = (index: number) => left + index * step;
  const yUnits = (value: number) => top + innerHeight - (value / maxUnits) * innerHeight;
  const yGrowth = (value: number) => top + innerHeight - (value / maxGrowth) * innerHeight;
  const growthPoints = data
    .map((item, index) => item.growth_yoy_pct === null ? null : `${xFor(index)},${yGrowth(item.growth_yoy_pct)}`)
    .filter(Boolean)
    .join(" ");

  if (!data.length) {
    return <div className="h-full rounded-xl bg-brand-soft animate-pulse" />;
  }

  return (
    <div className="relative h-full w-full" onMouseMove={onMouseMove} onMouseLeave={() => setHover(null)}>
      <div className="absolute left-5 top-1 z-10 flex items-center gap-4 text-xs font-bold">
        <span className="flex items-center gap-1 text-brand-blue"><i className="h-2.5 w-5 rounded-sm bg-brand-blue" />Penjualan (unit)</span>
        <span className="flex items-center gap-1 text-brand-orange"><i className="h-2.5 w-5 rounded-sm bg-brand-orange" />Kenaikan (%)</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = top + innerHeight - ratio * innerHeight;
          return (
            <g key={ratio}>
              <line x1={left} x2={width - right} y1={y} y2={y} stroke={BRAND.border} strokeDasharray="4 4" />
              <text x={left - 12} y={y + 4} textAnchor="end" fontSize="12" fill={BRAND.navy}>{formatCompact(maxUnits * ratio)}</text>
              <text x={width - right + 44} y={y + 4} fontSize="12" fill={BRAND.orange}>{Math.round(maxGrowth * ratio)}%</text>
            </g>
          );
        })}

        <line x1={left} x2={width - right} y1={top + innerHeight} y2={top + innerHeight} stroke={BRAND.border} />

        {data.map((item, index) => {
          const x = xFor(index);
          const barWidth = 36;
          const y = yUnits(item.bev_wholesales_units);
          const barHeight = top + innerHeight - y;
          return (
            <g key={item.year} onMouseEnter={() => setHover(item)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
              <rect x={x - barWidth / 2} y={y} width={barWidth} height={barHeight} rx="5" fill={BRAND.blue} />
              <text x={x} y={Math.max(y - 8, top - 4)} textAnchor="middle" fontSize="12" fontWeight="800" fill={BRAND.navy}>{formatCompact(item.bev_wholesales_units)}</text>
              <text x={x} y={height - 12} textAnchor="middle" fontSize="12" fontWeight="800" fill={BRAND.navy}>{item.year}</text>
            </g>
          );
        })}

        {growthPoints && <polyline points={growthPoints} fill="none" stroke={BRAND.orange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
        {data.map((item, index) => {
          if (item.growth_yoy_pct === null) return null;
          const x = xFor(index);
          const yG = yGrowth(item.growth_yoy_pct);
          const yU = yUnits(item.bev_wholesales_units);
          
          // Deteksi jika label oranye (yang biasanya di atas titik) akan menabrak label bar (biru) atau terlalu dekat ke atap
          const isOverlap = Math.abs(yG - yU) < 50 || yG < top + 35;
          const rectY = isOverlap ? yG + 12 : yG - 34;
          const textY = isOverlap ? yG + 27 : yG - 19;
          
          const label = `${String(item.growth_yoy_pct).replace(".", ",")}%`;
          return (
            <g key={`growth-${item.year}`} onMouseEnter={() => setHover(item)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
              <circle cx={x} cy={yG} r="5" fill={BRAND.orange} stroke="#fff" strokeWidth="3" />
              <rect x={x - 31} y={rectY} width="62" height="22" rx="7" fill="#fff" stroke={BRAND.orange} />
              <text x={x} y={textY} textAnchor="middle" fontSize="11" fontWeight="800" fill={BRAND.orange}>{label}</text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <FloatingTooltip pos={pos}>
          <p className="font-extrabold text-brand-navy">Tahun {hover.year}</p>
          <p className="font-semibold text-slate-600">BEV: <span className="text-brand-blue">{formatId(hover.bev_wholesales_units)} unit</span></p>
          <p className="font-semibold text-slate-600">YoY: <span className="text-brand-orange">{hover.growth_yoy_pct ? `${String(hover.growth_yoy_pct).replace(".", ",")}%` : "-"}</span></p>
        </FloatingTooltip>
      )}
    </div>
  );
}

function ProvinceMiniBar({ 
  data, 
  selectedProvince,
  onSelectProvince 
}: { 
  data: ProvinceRecord[];
  selectedProvince?: string | null;
  onSelectProvince?: (province: string | null) => void;
}) {
  const [hover, setHover] = useState<ProvinceRecord | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();
  const max = Math.max(1, ...data.map((item) => item.station_count));
  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto pr-1" onMouseLeave={() => setHover(null)} onMouseMove={onMouseMove}>
      {data.map((item, index) => {
        const pct = (item.station_count / max) * 100;
        const isTop3 = index < 3;
        const isSelected = selectedProvince === item.province;
        const barColor = index === 0 ? "bg-brand-orange" : index === 1 ? "bg-brand-teal" : index === 2 ? "bg-brand-green" : "bg-brand-blue";
        return (
          <div
            key={item.province}
            className={`group grid grid-cols-[16px_86px_1fr_32px] items-center gap-2 text-[11px] font-bold cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50/70 -mx-1 px-1 rounded-md text-brand-blue' : 'text-brand-navy hover:bg-slate-50/50 -mx-1 px-1 rounded-md'}`}
            onMouseEnter={() => setHover(item)}
            onClick={() => onSelectProvince?.(isSelected ? null : item.province)}
          >
            <span className={`text-[9px] text-center w-4 h-4 rounded-full flex items-center justify-center ${isTop3 ? barColor + ' text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>{index + 1}</span>
            <span className={`leading-tight truncate transition-colors ${isSelected ? 'text-brand-blue' : 'group-hover:text-brand-blue'}`}>{item.province}</span>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full transition-all duration-500 group-hover:brightness-110 ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-right transition-colors ${isSelected ? 'text-brand-blue' : isTop3 ? 'text-brand-navy' : 'text-slate-500'} group-hover:text-brand-blue`}>{item.station_count}</span>
          </div>
        );
      })}

      {hover && (
        <FloatingTooltip pos={pos}>
          <p className="font-extrabold text-brand-navy">{hover.province}</p>
          <p className="font-semibold text-slate-600">Total SPKLU: <span className="text-brand-blue">{formatId(hover.station_count)} lokasi</span></p>
        </FloatingTooltip>
      )}
    </div>
  );
}

function OperatorDonut({ data, total }: { data: { name: string; value: number; color: string }[]; total: number }) {
  const [hover, setHover] = useState<any | null>(null);
  const [selected, setSelected] = useState<any | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();

  const active = hover ?? selected;
  const maxVal = Math.max(1, ...data.map((d) => d.value));

  const handleClick = (item: any) => {
    setSelected(selected?.name === item.name ? null : item);
  };

  return (
    <div className="flex h-full flex-col gap-3" onMouseMove={onMouseMove}>
      {/* Bagian atas: Donut + legenda horizontal */}
      <div className="flex items-center gap-3 flex-1 min-h-0">
        {/* Donut */}
        <div className="shrink-0 grid place-items-center">
          <SvgDonut data={data} total={total} size={150} hole={0.58} onHover={setHover}>
            <div className="flex flex-col items-center justify-center rounded-full bg-white h-20 w-20 shadow-panel z-10 pointer-events-none">
              {active ? (
                <>
                  <div className="font-heading text-[22px] font-bold leading-none transition-all duration-300" style={{ color: active.color }}>{formatCompact(active.value)}</div>
                  <div className="mt-0.5 text-[10px] font-bold text-slate-400">lokasi</div>
                  <div className="mt-1 text-[10px] font-extrabold text-slate-500">{((active.value / total) * 100).toFixed(1).replace(".", ",")}%</div>
                </>
              ) : (
                <>
                  <div className="font-heading text-[26px] font-bold leading-none text-brand-navy">{formatId(total)}</div>
                  <div className="mt-0.5 text-[10px] font-bold text-slate-400">total</div>
                  <div className="mt-0.5 text-[10px] font-bold text-slate-400">SPKLU</div>
                </>
              )}
            </div>
          </SvgDonut>
        </div>

        {/* Legend cards */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
          {data.map((item, index) => {
            const pct = (item.value / total) * 100;
            const barPct = (item.value / maxVal) * 100;
            const isActive = active?.name === item.name;
            const isDimmed = active && !isActive;
            return (
              <div
                key={item.name}
                className={`group relative cursor-pointer rounded-xl border px-2.5 py-1.5 transition-all duration-300 ${
                  isActive
                    ? "border-transparent shadow-md scale-[1.02] origin-left"
                    : isDimmed
                    ? "border-transparent opacity-40 grayscale"
                    : "border-brand-border hover:border-transparent hover:shadow-sm hover:scale-[1.01] origin-left"
                }`}
                style={{ backgroundColor: isActive ? `${item.color}18` : "white" }}
                onMouseEnter={() => setHover(item)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleClick(item)}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-1 gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className={`text-[11px] font-extrabold truncate transition-colors ${isActive ? "text-brand-navy" : "text-brand-navy group-hover:text-brand-navy"}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-slate-500">{formatId(item.value)}</span>
                    <span className={`text-[9px] font-extrabold rounded-full px-1.5 py-0.5 text-white`} style={{ backgroundColor: item.color }}>
                      {pct.toFixed(1).replace(".", ",")}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barPct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary insight bar */}
      <div className="flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Dominasi Pasar</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200 flex">
          {data.map((d) => (
            <div
              key={d.name}
              className="h-full transition-all duration-300"
              style={{ width: `${(d.value / total) * 100}%`, backgroundColor: d.color }}
              title={d.name}
            />
          ))}
        </div>
        <span className="text-[10px] font-extrabold text-brand-navy">{data[0]?.name?.split(" ")[0]} #{1}</span>
      </div>

      {hover && (
        <FloatingTooltip pos={pos}>
          <p className="font-extrabold text-brand-navy">{hover.name}</p>
          <p className="font-semibold text-slate-600">Lokasi: <span className="text-brand-blue">{formatId(hover.value)} titik</span></p>
          <p className="font-semibold text-slate-600">Pangsa: <span className="text-brand-orange">{((hover.value / total) * 100).toFixed(1).replace(".", ",")}%</span></p>
        </FloatingTooltip>
      )}
    </div>
  );
}

function EmissionPanel() {
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();

  const metrics = [
    { key: "id", label: "Indonesia", value: 0.680, unit: "kgCO₂e/kWh", color: BRAND.blue, desc: "Faktor emisi jaringan listrik nasional" },
    { key: "global", label: "Rata-rata Global", value: 0.435, unit: "kgCO₂e/kWh", color: BRAND.orange, desc: "Rata-rata emisi listrik seluruh dunia" },
    { key: "ev", label: "BEV vs ICE", value: 0.33, unit: "kali emisi ICE", color: BRAND.green, desc: "BEV hanya 33% emisi dari kendaraan bensin" },
  ];

  const maxVal = Math.max(...metrics.map(m => m.value));

  return (
    <div className="flex h-full flex-col gap-4 pt-1" onMouseMove={onMouseMove} onMouseLeave={() => setActiveBar(null)}>
      {/* Comparison bar chart */}
      <div className="flex flex-col gap-3">
        {metrics.map((m) => {
          const isActive = activeBar === m.key;
          const pct = (m.value / maxVal) * 100;
          return (
            <div
              key={m.key}
              className="cursor-pointer"
              onMouseEnter={() => setActiveBar(m.key)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[12px] font-extrabold transition-colors ${isActive ? '' : 'text-brand-navy'}`} style={isActive ? { color: m.color } : {}}>
                  {m.label}
                </span>
                <span className="text-[12px] font-bold text-slate-600">
                  <span className="font-extrabold" style={{ color: m.color }}>{String(m.value).replace(".", ",")}</span>
                  <span className="text-[10px] text-slate-400 ml-1">{m.unit}</span>
                </span>
              </div>
              <div className="h-3.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: m.color,
                    opacity: activeBar && !isActive ? 0.3 : 1,
                    boxShadow: isActive ? `0 0 8px ${m.color}66` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-brand-border" />

      {/* Insight card */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 px-4 py-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-100 text-brand-green">
          <Icon name="bolt" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-brand-green mb-0.5">Potensi Pengurangan Emisi</p>
          <p className="text-[11px] font-medium leading-snug text-brand-navy">
            Transisi ke BEV + energi terbarukan dapat memangkas emisi transportasi hingga <strong>67%</strong> pada 2040.
          </p>
        </div>
      </div>

      {/* Floating tooltip */}
      {activeBar && (() => {
        const m = metrics.find(x => x.key === activeBar)!;
        return (
          <FloatingTooltip pos={pos}>
            <p className="font-extrabold" style={{ color: m.color }}>{m.label}</p>
            <p className="font-semibold text-slate-600">{m.value} {m.unit}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
          </FloatingTooltip>
        );
      })()}
    </div>
  );
}

function SmallMetric({ label, value, suffix, tone }: { label: string; value: string; suffix: string; tone: "blue" | "orange" }) {
  return (
    <div className={`group rounded-xl border p-3 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md ${tone === "orange" ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}`}>
      <p className={`text-[10px] font-extrabold uppercase ${tone === "orange" ? "text-brand-orange" : "text-brand-blue"}`}>{label}</p>
      <p className={`mt-2 font-heading text-[28px] font-bold leading-none transition-transform duration-300 group-hover:scale-105 ${tone === "orange" ? "text-brand-orange" : "text-brand-blue"}`}>{value}</p>
      <p className="mt-1 text-[10px] font-semibold text-slate-500">{suffix}</p>
    </div>
  );
}

function TargetPanel() {
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();

  const rows = [
    { icon: "car", label: "Mobil listrik", value: "2.000.000", rawValue: 2000000, max: 2000000, unit: "unit", color: BRAND.blue, desc: "Target kumulatif penjualan mobil BEV" },
    { icon: "scooter", label: "Motor listrik", value: "12.900.000", rawValue: 12900000, max: 12900000, unit: "unit", color: BRAND.teal, desc: "Target kumulatif penjualan motor listrik" },
    { icon: "battery", label: "Kapasitas sel baterai", value: "140 GWh", rawValue: 140, max: 140, unit: "GWh", color: BRAND.orange, desc: "Kapasitas produksi baterai lokal" },
    { icon: "factory", label: "TKDN industri BEV", value: "40%", rawValue: 40, max: 100, unit: "%", color: BRAND.green, desc: "Minimum kandungan lokal (2025)" },
  ];

  return (
    <div className="flex h-full flex-col gap-2.5 pt-1" onMouseMove={onMouseMove} onMouseLeave={() => setActiveRow(null)}>
      {rows.map((row, idx) => {
        const isActive = activeRow === row.label;
        const pct = (row.rawValue / row.max) * 100;
        return (
          <div
            key={row.label}
            className={`group cursor-pointer rounded-2xl border transition-all duration-300 px-3 py-2.5 ${isActive ? 'border-transparent shadow-md' : 'border-brand-border hover:border-transparent hover:shadow-sm'}`}
            style={{ backgroundColor: isActive ? `${row.color}14` : "white" }}
            onMouseEnter={() => setActiveRow(row.label)}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-300"
                style={{ backgroundColor: isActive ? row.color : `${row.color}20`, color: isActive ? "white" : row.color }}
              >
                <Icon name={row.icon} className="h-5 w-5" />
              </div>

              {/* Label + Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <p className="text-[11px] font-extrabold text-slate-600 truncate">{row.label}</p>
                  <p className="font-heading text-lg font-black leading-none ml-2 shrink-0" style={{ color: row.color }}>{row.value}</p>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: row.color, boxShadow: isActive ? `0 0 6px ${row.color}88` : "none" }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {activeRow && (() => {
        const row = rows.find(r => r.label === activeRow)!;
        return (
          <FloatingTooltip pos={pos}>
            <p className="font-extrabold" style={{ color: row.color }}>{row.label}</p>
            <p className="font-semibold text-slate-600">Target: <span style={{ color: row.color }}>{row.value}</span></p>
            <p className="text-[10px] text-slate-400 mt-0.5">{row.desc}</p>
          </FloatingTooltip>
        );
      })()}
    </div>
  );
}

function JavaDistribution({ data }: { data: { name: string; value: number; color: string }[] }) {
  const [hover, setHover] = useState<any | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex h-full flex-col gap-3 pt-1" onMouseMove={onMouseMove}>
      {/* Donut */}
      <div className="flex items-center justify-center">
        <SvgDonut data={data} total={total} size={148} hole={0.6} onHover={setHover}>
          <div className="flex flex-col items-center justify-center rounded-full bg-white h-20 w-20 shadow-panel z-10 pointer-events-none">
            {hover ? (
              <>
                <p className="font-heading text-[22px] font-bold leading-none" style={{ color: hover.color }}>{String(hover.value).replace(".", ",")}%</p>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5 text-center px-1 leading-tight">{hover.name}</p>
              </>
            ) : (
              <Icon name="pin" className="h-9 w-9 text-slate-300" />
            )}
          </div>
        </SvgDonut>
      </div>

      {/* Stacked bar */}
      <div className="px-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Distribusi SPKLU</p>
        <div className="flex h-3 w-full rounded-full overflow-hidden">
          {data.map((d) => (
            <div
              key={d.name}
              className="h-full transition-all duration-300 cursor-pointer"
              style={{
                width: `${d.value}%`,
                backgroundColor: d.color,
                opacity: hover && hover.name !== d.name ? 0.3 : 1,
              }}
              onMouseEnter={() => setHover(d)}
              onMouseLeave={() => setHover(null)}
              title={d.name}
            />
          ))}
        </div>
      </div>

      {/* Legend cards */}
      <div className="grid grid-cols-2 gap-1.5">
        {data.map((item) => {
          const isHovered = hover?.name === item.name;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setHover(item)}
              onMouseLeave={() => setHover(null)}
              className={`rounded-xl border px-2.5 py-2 transition-all duration-300 cursor-pointer ${isHovered ? 'shadow-md border-transparent scale-105' : 'border-brand-border hover:shadow-sm'}`}
              style={{ backgroundColor: isHovered ? `${item.color}18` : "white" }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <p className="text-[10px] font-extrabold text-brand-navy truncate">{item.name}</p>
              </div>
              <p className="font-heading text-[22px] font-black leading-none" style={{ color: item.color }}>
                {String(item.value).replace(".", ",")}%
              </p>
            </div>
          );
        })}
      </div>

      {hover && (
        <FloatingTooltip pos={pos}>
          <p className="font-extrabold text-brand-navy">{hover.name}</p>
          <p className="font-semibold text-slate-600">Porsi: <span className="text-brand-blue">{String(hover.value).replace(".", ",")}%</span></p>
          <p className="mt-0.5 text-[10px] text-slate-400">dari total SPKLU Indonesia</p>
        </FloatingTooltip>
      )}
    </div>
  );
}

function TensionPanel() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const tensions = [
    {
      no: 1, tone: "blue", icon: "trend",
      left: { label: "EV Tumbuh", value: "104K", sub: "unit/2025", color: BRAND.blue },
      right: { label: "Rasio SPKLU", value: "1:43", sub: "EV per SPKLU", color: "#64748b" },
      insight: "Pertumbuhan penjualan EV masih jauh melampaui kecepatan pembangunan infrastruktur pengisian daya.",
    },
    {
      no: 2, tone: "orange", icon: "emission",
      left: { label: "Emisi BEV", value: "33%", sub: "vs ICE sejenis", color: BRAND.green },
      right: { label: "Emisi Grid", value: "0,68", sub: "kgCO₂e/kWh", color: BRAND.orange },
      insight: "BEV lebih bersih, namun manfaatnya terbatas selama listrik masih bergantung pada batubara.",
    },
    {
      no: 3, tone: "teal", icon: "battery",
      left: { label: "Target TKDN", value: "40%", sub: "komponen lokal", color: BRAND.teal },
      right: { label: "Baterai Impor", value: ">80%", sub: "saat ini", color: BRAND.orange },
      insight: "Ambisi industri EV lokal bergantung pada kemampuan produksi sel baterai yang masih terbatas.",
    },
  ];

  const toneConfig = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-brand-blue", text: "text-brand-blue" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-brand-orange", text: "text-brand-orange" },
    teal: { bg: "bg-cyan-50", border: "border-cyan-200", badge: "bg-brand-teal", text: "text-brand-teal" },
  };

  return (
    <div className="grid h-full min-h-[205px] gap-2.5">
      {tensions.map((item) => {
        const cfg = toneConfig[item.tone as keyof typeof toneConfig];
        const isActive = activeItem === item.no;
        return (
          <div
            key={item.no}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${isActive ? `${cfg.border} shadow-md` : `border-brand-border hover:${cfg.border} hover:shadow-sm`}`}
            style={{ backgroundColor: isActive ? undefined : "white" }}
            onMouseEnter={() => setActiveItem(item.no)}
            onMouseLeave={() => setActiveItem(null)}
          >
            {/* Gradient bg on hover */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${cfg.bg} ${isActive ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative flex items-center gap-3 px-3 py-2.5">
              {/* Badge */}
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${cfg.badge} text-xs font-extrabold text-white shadow-sm transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {item.no}
              </span>

              {/* Metric pair (VS layout) */}
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{item.left.label}</p>
                  <p className="font-heading text-[20px] font-black leading-none" style={{ color: item.left.color }}>{item.left.value}</p>
                  <p className="text-[9px] text-slate-400">{item.left.sub}</p>
                </div>
                <div className={`text-[11px] font-black ${cfg.text} shrink-0`}>VS</div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{item.right.label}</p>
                  <p className="font-heading text-[20px] font-black leading-none" style={{ color: item.right.color }}>{item.right.value}</p>
                  <p className="text-[9px] text-slate-400">{item.right.sub}</p>
                </div>
              </div>

              {/* Icon */}
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300 ${isActive ? `${cfg.badge} text-white` : 'bg-slate-100 text-slate-400'}`}>
                <Icon name={item.icon} className="h-5 w-5" />
              </div>
            </div>

            {/* Expandable insight */}
            <div className={`relative overflow-hidden transition-all duration-300 ${isActive ? 'max-h-10' : 'max-h-0'}`}>
              <p className={`px-3 pb-2.5 text-[11px] font-medium leading-snug ${cfg.text}`}>{item.insight}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConnectorPanel({ data, total }: { data: ConnectorRecord[]; total: number }) {
  const [hover, setHover] = useState<ConnectorRecord | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();
  const colors = [BRAND.blue, BRAND.orange, BRAND.teal, BRAND.green, "#7557B8", "#91A4C4"];
  return (
    <div className="space-y-3" onMouseLeave={() => setHover(null)} onMouseMove={onMouseMove}>
      {data.slice(0, 6).map((item, index) => {
        const pct = total ? (item.count / total) * 100 : 0;
        return (
          <div
            key={item.connector_type}
            className="group cursor-pointer"
            onMouseEnter={() => setHover(item)}
          >
            <div className="mb-1 flex items-center justify-between text-xs font-bold text-brand-navy">
              <span className="transition-colors group-hover:text-brand-blue">{item.connector_type}</span>
              <span className="transition-colors group-hover:text-brand-blue">{formatId(item.count)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-brand-soft">
              <div className="h-full rounded-full transition-all duration-300 group-hover:brightness-110" style={{ width: `${pct}%`, backgroundColor: colors[index] }} />
            </div>
          </div>
        );
      })}

      {hover && (
        <FloatingTooltip pos={pos}>
          <p className="font-extrabold text-brand-navy">{hover.connector_type}</p>
          <p className="font-semibold text-slate-600">Jumlah: <span className="text-brand-blue">{formatId(hover.count)} unit</span></p>
          <p className="font-semibold text-slate-600">Porsi: <span className="text-brand-orange">{((hover.count / total) * 100).toFixed(1).replace(".", ",")}%</span></p>
        </FloatingTooltip>
      )}
    </div>
  );
}

function RupltPanel() {
  const [hover, setHover] = useState<string | null>(null);
  const { pos, onMouseMove } = useCursorTooltip();
  const total = 69.5;
  const parts = [
    { label: "EBT", value: 42.6, color: BRAND.green, detail: "Energi Baru Terbarukan" },
    { label: "Fosil", value: 16.6, color: BRAND.orange, detail: "Energi Fosil (PLTU dll)" },
    { label: "Storage", value: 10.3, color: BRAND.teal, detail: "Penyimpanan BESS/Pumped" },
  ];
  const hovered = parts.find((p) => p.label === hover);
  return (
    <div className="space-y-4" onMouseLeave={() => setHover(null)} onMouseMove={onMouseMove}>
      <div className="flex h-7 w-full overflow-hidden rounded-full bg-brand-soft cursor-pointer">
        {parts.map((part) => (
          <div
            key={part.label}
            onMouseEnter={() => setHover(part.label)}
            className={`h-full transition-all duration-300 ${hover === part.label ? 'brightness-110' : hover ? 'opacity-50 grayscale' : 'hover:brightness-110'}`}
            style={{ width: `${(part.value / total) * 100}%`, backgroundColor: part.color }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {parts.map((part) => (
          <div
            key={part.label}
            onMouseEnter={() => setHover(part.label)}
            className={`rounded-xl border border-brand-border bg-[#F8FBFF] p-3 transition-all duration-300 cursor-pointer ${hover === part.label ? 'ring-2 ring-brand-blue/30 border-brand-blue scale-105 shadow-md' : hover ? 'opacity-50 grayscale' : 'hover:-translate-y-1 hover:shadow-md'}`}
          >
            <div className="mb-2 h-2 w-8 rounded-full" style={{ backgroundColor: part.color }} />
            <p className="text-xs font-extrabold text-brand-navy">{part.label}</p>
            <p className="font-heading text-2xl font-bold text-brand-blue">{String(part.value).replace(".", ",")} <span className="text-xs">GW</span></p>
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold leading-relaxed text-slate-500">
        Total kapasitas baru RUPTL 2025–2034: <strong className="text-brand-navy">69,5 GW</strong>, termasuk 47.758 km jaringan transmisi baru.
      </p>

      {hover && hovered && (
        <FloatingTooltip pos={pos}>
          <p className="font-extrabold text-brand-navy">{hovered.detail}</p>
          <p className="font-semibold text-slate-600">Kapasitas: <span className="text-brand-blue">{hovered.value} GW</span></p>
          <p className="font-semibold text-slate-600">Porsi: <span className="text-brand-orange">{((hovered.value / total) * 100).toFixed(1).replace(".", ",")}%</span></p>
        </FloatingTooltip>
      )}
    </div>
  );
}

function SvgDonut({
  data,
  total,
  size = 208,
  hole = 0.56,
  children,
  onHover,
}: {
  data: any[];
  total: number;
  size?: number;
  hole?: number;
  children?: ReactNode;
  onHover?: (item: any) => void;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const center = size / 2;
  const strokeWidth = (size / 2) * (1 - hole);
  const r = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * r;

  // Hitung posisi awal setiap segmen dalam bentuk "stroke offset shift"
  let accumulated = 0;
  const segments = data.map((item: any, index: number) => {
    const fraction = item.value / total;
    const sliceLength = fraction * circumference;
    // Setiap circle dimulai dari 12 o'clock (sudah kena rotate -90 deg di SVG)
    // offset = circumference - accumulated (seberapa jauh kita geser start point)
    const dashOffset = circumference - accumulated;
    accumulated += sliceLength;
    return { item, index, sliceLength, dashOffset };
  });

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      onMouseLeave={() => {
        setHoverIndex(null);
        onHover?.(null);
      }}
    >
      {/* SVG dirotate -90 agar segmen mulai dari atas (12 o'clock) */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        className="overflow-visible"
      >
        {segments.map(({ item, index, sliceLength, dashOffset }) => {
          const isHovered = hoverIndex === index;
          return (
            <circle
              key={item.name ?? index}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${sliceLength} ${circumference - sliceLength}`}
              strokeDashoffset={dashOffset}
              pointerEvents="stroke"
              className="cursor-pointer transition-all duration-200"
              style={{
                filter: isHovered
                  ? `drop-shadow(0 0 6px ${item.color}99)`
                  : hoverIndex !== null
                  ? "grayscale(60%) opacity(0.5)"
                  : "none",
              }}
              onMouseEnter={() => {
                setHoverIndex(index);
                onHover?.(item);
              }}
            />
          );
        })}
      </svg>

      {/* Konten tengah */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function FooterBanner() {
  return (
    <div className="dashboard-panel flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand-blue">
          <Icon name="database" className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-brand-navy">Sumber Data Utama</h3>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 md:max-w-3xl">
            GAIKINDO, ICCT, AISI, dataset SPKLU lokal, ESDM, PLN, Kemenperin, BKPM, Ember, IEA, IESR.
          </p>
        </div>
      </div>
      
      <div className="hidden h-12 w-px bg-brand-border md:block" />
      <div className="h-px w-full bg-brand-border md:hidden" />

      <div className="flex w-full flex-1 items-center justify-between gap-4 md:w-auto md:justify-end">
        <div className="md:text-right">
          <h3 className="text-[13px] font-bold uppercase tracking-wide text-brand-navy">Akses Data & Referensi</h3>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-500 md:max-w-[220px]">
            Pindai QR ini untuk mengakses folder Google Drive (dataset & laporan).
          </p>
        </div>
        <div className="shrink-0 overflow-hidden rounded-xl border border-brand-border bg-white p-1.5 shadow-sm">
          <img 
            src="/qrcode-sumber-referensi.png" 
            alt="QR Code Google Drive" 
            className="h-[60px] w-[60px] object-contain"
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
              e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
            }} 
          />
          <div className="hidden grid h-[60px] w-[60px] place-items-center bg-slate-50 text-[9px] font-bold text-slate-400 text-center leading-tight">
            Taruh<br/>gambar QR<br/>di public/
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; payload?: { name?: string } }>; label?: string | number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-brand-border bg-white px-3 py-2 text-xs shadow-card">
      {label !== undefined && <p className="mb-1 font-extrabold text-brand-navy">{label}</p>}
      {payload.map((item, index) => (
        <p key={`${item.name}-${index}`} className="font-semibold text-slate-600">
          {item.name ?? item.payload?.name}: <span className="text-brand-blue">{typeof item.value === "number" ? formatId(item.value) : item.value}</span>
        </p>
      ))}
    </div>
  );
}



function shortOperator(operator: string) {
  if (operator.includes("PERUSAHAAN LISTRIK NEGARA")) return "PLN";
  if (operator.includes("SUMBER DAYA")) return "Sumber Daya";
  if (operator.includes("UTOMO")) return "Charge+";
  if (operator.includes("EXELLY")) return "Exelly";
  return operator.replace(/^PT\s+/i, "").slice(0, 14);
}

function formatId(value: number) {
  return value.toLocaleString("id-ID");
}

function formatCompact(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return String(value);
}

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const common = "currentColor";
  const strokeProps = { stroke: common, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  switch (name) {
    case "menu": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case "home": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="m3 11 9-8 9 8" /><path {...strokeProps} d="M5 10v10h14V10" /><path {...strokeProps} d="M10 20v-6h4v6" /></svg>;
    case "bar": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M4 20V10" /><path {...strokeProps} d="M10 20V4" /><path {...strokeProps} d="M16 20v-7" /><path {...strokeProps} d="M22 20H2" /></svg>;
    case "plug": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M8 2v6M16 2v6M7 8h10v4a5 5 0 0 1-5 5v5M9 17h6" /></svg>;
    case "leaf": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16Z" /><path {...strokeProps} d="M4 20c4-6 8-9 14-12" /></svg>;
    case "target": return <svg viewBox="0 0 24 24" className={className}><circle {...strokeProps} cx="12" cy="12" r="8" /><circle {...strokeProps} cx="12" cy="12" r="4" /><path {...strokeProps} d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>;
    case "factory": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M3 21h18" /><path {...strokeProps} d="M5 21V9l5 3V9l5 3V5h4v16" /><path {...strokeProps} d="M8 17h1M12 17h1M16 17h1" /></svg>;
    case "map": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" /><path {...strokeProps} d="M9 4v14M15 6v14" /></svg>;
    case "download": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M12 3v12" /><path {...strokeProps} d="m7 10 5 5 5-5" /><path {...strokeProps} d="M4 21h16" /></svg>;
    case "calendar": return <svg viewBox="0 0 24 24" className={className}><rect {...strokeProps} x="4" y="5" width="16" height="15" rx="2" /><path {...strokeProps} d="M8 3v4M16 3v4M4 10h16" /></svg>;
    case "globe": return <svg viewBox="0 0 24 24" className={className}><circle {...strokeProps} cx="12" cy="12" r="9" /><path {...strokeProps} d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>;
    case "refresh": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M21 12a9 9 0 0 1-15 6.7" /><path {...strokeProps} d="M3 12a9 9 0 0 1 15-6.7" /><path {...strokeProps} d="M18 3v5h-5M6 21v-5h5" /></svg>;
    case "trend": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M4 19V9M10 19V5M16 19v-7" /><path {...strokeProps} d="M3 20h18" /><path {...strokeProps} d="m13 7 4-4 4 4" /></svg>;
    case "growth": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M4 19V13M10 19V9M16 19V5" /><path {...strokeProps} d="M3 20h18" /><path {...strokeProps} d="m14 4 3-3 3 3M17 1v10" /></svg>;
    case "pin": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M12 22s7-6 7-13a7 7 0 0 0-14 0c0 7 7 13 7 13Z" /><circle {...strokeProps} cx="12" cy="9" r="2.5" /></svg>;
    case "bolt": return <svg viewBox="0 0 24 24" className={className}><path fill="currentColor" d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" /></svg>;
    case "reduction": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16Z" /><path {...strokeProps} d="M12 8v8" /><path {...strokeProps} d="m8 12 4 4 4-4" /></svg>;
    case "car": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M5 16h14l-2-6H7l-2 6Z" /><path {...strokeProps} d="M7 16v3M17 16v3M6 19h2M16 19h2M7 13h10" /></svg>;
    case "scooter": return <svg viewBox="0 0 24 24" className={className}><circle {...strokeProps} cx="7" cy="18" r="3" /><circle {...strokeProps} cx="18" cy="18" r="3" /><path {...strokeProps} d="M10 18h4l2-7h3M14 11h-4l-2 4M16 8h3" /></svg>;
    case "battery": return <svg viewBox="0 0 24 24" className={className}><rect {...strokeProps} x="4" y="7" width="15" height="10" rx="2" /><path {...strokeProps} d="M21 11v2" /><path fill="currentColor" d="M8 10h7v4H8z" /></svg>;
    case "emission": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M4 20h16" /><path {...strokeProps} d="M6 20V9h4v11M14 20V6h4v14" /><path {...strokeProps} d="M7 6c1-2 5-2 6 0 1-2 5-2 6 1" /></svg>;
    case "car-electric": return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H5.5A2.5 2.5 0 0 0 3 9v7h2" />
        <circle cx="7" cy="16" r="2" />
        <circle cx="17" cy="16" r="2" />
        <path d="m11 5 1-4" />
        <path d="m15 5 1-4" />
      </svg>
    );
    case "rocket": return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    );
    case "charging-station": return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h10" />
        <path d="M9 22V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18" />
        <path d="M14 8h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2v4a2 2 0 0 0 2 2h2" />
        <path d="M6 8h3" />
        <path d="M6 12h3" />
      </svg>
    );
    case "pln-bolt": return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-14h-9l1-8z" fill="currentColor" stroke="none" />
      </svg>
    );
    case "co2-cloud": return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19a4.5 4.5 0 0 0 2.4-8.2A8 8 0 0 0 5 11.5a5.5 5.5 0 0 0 0 11h12.5Z" />
        <text x="12" y="15.5" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="sans-serif">CO₂</text>
      </svg>
    );
    case "leaf-shield": return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        <path d="M14 18l-3-3 3-3" />
      </svg>
    );
    case "database": return <svg viewBox="0 0 24 24" className={className}><ellipse {...strokeProps} cx="12" cy="5" rx="7" ry="3" /><path {...strokeProps} d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path {...strokeProps} d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></svg>;
    case "badge": return <svg viewBox="0 0 24 24" className={className}><path {...strokeProps} d="M12 3 5 7v5c0 5 3 8 7 9 4-1 7-4 7-9V7l-7-4Z" /><path {...strokeProps} d="m9 12 2 2 4-5" /></svg>;
    default: return <svg viewBox="0 0 24 24" className={className}><circle {...strokeProps} cx="12" cy="12" r="8" /></svg>;
  }
}
