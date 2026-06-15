"use client";

import { motion } from "framer-motion";
import SectionWrapper from "../ui/SectionWrapper";
import SourceBadge from "../ui/SourceBadge";

const BARRIERS = [
  {
    title: "Harga",
    desc: "Rasio harga EV terhadap pendapatan rata-rata ~10x. Terlalu mahal bagi mayoritas.",
    icon: "💰",
    source: "Market estimates",
  },
  {
    title: "Akses Charging",
    desc: "Distribusi SPKLU belum merata — terkonsentrasi di Jawa dan Bali.",
    icon: "🔌",
    source: "Dataset SPKLU",
  },
  {
    title: "Range Anxiety",
    desc: "Jarak tempuh per charge masih jadi kekhawatiran utama, terutama di luar kota.",
    icon: "📏",
    source: "PwC/Litbang Kompas",
  },
  {
    title: "Umur Baterai",
    desc: "Ketidakpastian soal degradasi baterai dan biaya penggantian jangka panjang.",
    icon: "🔋",
    source: "Survei konsumen",
  },
  {
    title: "Nilai Jual Kembali",
    desc: "Pasar secondhand EV belum matang — resale value sulit diprediksi.",
    icon: "📉",
    source: "Market research",
  },
  {
    title: "Keamanan",
    desc: "Persepsi risiko kebakaran baterai, meski secara statistik lebih rendah dari ICE.",
    icon: "🛡️",
    source: "Media/survei",
  },
  {
    title: "Sumber Listrik",
    desc: "Kesadaran bahwa listrik dari batu bara membuat EV 'belum benar-benar hijau.'",
    icon: "⚡",
    source: "Ember/analisis",
  },
];

export default function BarriersSection() {
  return (
    <SectionWrapper id="barriers">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Bukan Menolak, Masih Ragu
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl">
          Masyarakat tidak anti-EV — tapi belum cukup alasan kuat untuk beralih.
          Keraguan ini adalah masalah desain kebijakan, bukan penolakan teknologi.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {BARRIERS.map((barrier, i) => (
          <motion.div
            key={barrier.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass rounded-xl p-5 hover:bg-white/[0.04] transition-colors"
          >
            <span className="text-2xl block mb-3">{barrier.icon}</span>
            <h4 className="text-sm font-medium text-white mb-2">{barrier.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {barrier.desc}
            </p>
            <div className="text-[10px] text-slate-600">{barrier.source}</div>
          </motion.div>
        ))}
      </div>

      <SourceBadge
        source="Litbang Kompas 2026 / PwC Indonesia / Academic papers"
        confidence="medium_high"
      />
    </SectionWrapper>
  );
}
