"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../ui/SectionWrapper";
import MethodologyDrawer from "../layout/MethodologyDrawer";

const CONCLUSIONS = [
  {
    number: "01",
    title: "SPKLU Harus Merata",
    desc: "Infrastruktur charging harus menjangkau luar Jawa — bukan hanya mengejar jumlah, tapi distribusi.",
    color: "text-ev-blue-400",
    borderColor: "border-ev-blue-500/50",
  },
  {
    number: "02",
    title: "Grid Harus Makin Bersih",
    desc: "Tanpa dekarbonisasi listrik, EV hanya memindahkan emisi dari knalpot ke cerobong PLTU.",
    color: "text-nickel-green-400",
    borderColor: "border-nickel-green-500/50",
  },
  {
    number: "03",
    title: "Industri Lokal Harus Naik Kelas",
    desc: "Dari assembly ke value capture. Dari nikel mentah ke sel baterai. Dari konsumen ke produsen.",
    color: "text-coal-amber-400",
    borderColor: "border-coal-amber-500/50",
  },
];

export default function ClosingSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SectionWrapper id="closing">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Tiga Syarat Transformasi
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          EV bukan hanya soal mobil. Ini soal sistem energi, industri, dan
          infrastruktur yang harus bergerak bersamaan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {CONCLUSIONS.map((item, i) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`glass rounded-2xl p-6 border-t-2 ${item.borderColor}`}
          >
            <div className={`text-4xl font-heading font-bold ${item.color} mb-3 opacity-50`}>
              {item.number}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Dashboard ini dibangun dari data terbuka dan terverifikasi. Setiap angka
          memiliki sumber dan catatan metodologi.
        </p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm text-ev-blue-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Metodologi &amp; Sumber Data
        </button>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-xs text-slate-600">
          Nusantara Electrified — SIC SATRIA DATA 2026
        </p>
        <p className="text-xs text-slate-700 mt-1">
          Dibangun dengan data terbuka. Tidak berafiliasi dengan pihak manapun.
        </p>
      </div>

      <AnimatePresence>
        {drawerOpen && <MethodologyDrawer onClose={() => setDrawerOpen(false)} />}
      </AnimatePresence>
    </SectionWrapper>
  );
}
