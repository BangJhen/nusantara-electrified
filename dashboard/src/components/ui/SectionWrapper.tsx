"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  fullHeight = false,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative w-full ${fullHeight ? "min-h-screen" : ""} px-4 sm:px-6 lg:px-8 py-16 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </motion.section>
  );
}
