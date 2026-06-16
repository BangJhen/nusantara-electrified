"use client";

import MetricCard from "../ui/MetricCard";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ev-blue-500/10 rounded-full blur-3xl animate-[pulse-glow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-nickel-green-500/8 rounded-full blur-3xl animate-[pulse-glow_6s_ease-in-out_infinite_1s]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-ev-blue-400 font-medium tracking-wider uppercase text-sm mb-4"
        >
          Data Story — SIC SATRIA DATA 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-6"
        >
          Nusantara{" "}
          <span className="text-brand-dark">Electrified</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          EV Indonesia melaju cepat, tapi keberhasilannya ditentukan oleh
          kesiapan industri dan kebersihan listrik.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          <MetricCard
            value={103931}
            label="BEV Wholesales 2025"
            suffix=" unit"
            delay={0}
          />
          <MetricCard
            value={2426}
            label="Stasiun SPKLU"
            delay={150}
          />
          <MetricCard
            value={0.68}
            label="Grid Emission Factor"
            suffix=" kgCO₂/kWh"
            decimals={2}
            delay={300}
          />
          <MetricCard
            value={2}
            label="Target EV 2030"
            suffix=" juta"
            delay={450}
          />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs tracking-wider uppercase">Scroll</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
