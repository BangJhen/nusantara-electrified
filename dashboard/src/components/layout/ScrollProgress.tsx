"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-navy-900/50">
      <div
        className="h-full bg-gradient-to-r from-ev-blue-500 to-ev-blue-400 transition-transform duration-150 origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
