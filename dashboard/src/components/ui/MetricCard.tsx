"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface MetricCardProps {
  value: number | string;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delay?: number;
}

export default function MetricCard({
  value,
  label,
  suffix = "",
  prefix = "",
  decimals = 0,
  delay = 0,
}: MetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      setDisplayValue(String(value));
      return;
    }

    const duration = 1500;
    const startTime = Date.now();
    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - delay;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = numValue * eased;

        if (decimals > 0) {
          setDisplayValue(current.toFixed(decimals));
        } else {
          setDisplayValue(Math.round(current).toLocaleString("id-ID"));
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, value, delay, decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="glass-strong rounded-2xl p-6 glow-blue"
    >
      <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
        {prefix}
        {displayValue}
        {suffix}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}
