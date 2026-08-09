"use client";

import React from "react";
import { SITE_LINKS } from "@/lib/constants";

export default function PromotionalLinks() {
  return (
    <footer className="w-full mt-10 pt-6 border-t-3 border-black text-center">
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-4">
        <a
          href={SITE_LINKS.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-badge-yellow hover:scale-105 transition-transform"
        >
          🌐 OFFICIAL WEBSITE ↗
        </a>
        <a
          href={SITE_LINKS.eventDetails}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-badge-pink hover:scale-105 transition-transform"
        >
          🌴 EVENT DETAILS ↗
        </a>
        <a
          href={SITE_LINKS.registration}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-badge-yellow hover:scale-105 transition-transform"
        >
          🚀 JOIN / DEVFOLIO ↗
        </a>
        <a
          href={SITE_LINKS.radarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-badge-pink hover:scale-105 transition-transform"
        >
          📡 W CELEB RADAR ↗
        </a>
      </div>

      <p className="text-xs font-bold text-white/90">
        Built for <span className="text-[#FEE101]">Hacker House Goa 2026</span> · 28 – 31 OCT 2026 · Goa, India
      </p>
    </footer>
  );
}
