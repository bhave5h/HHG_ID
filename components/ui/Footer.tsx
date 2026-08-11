"use client";

import React from "react";
import { SITE_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full mt-6 pt-3 border-t-2 border-white/30 text-center font-body">
      <div className="flex flex-wrap justify-center gap-4 mb-2 text-l">
        <a
          href={SITE_LINKS.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-[#FEE101]"
        >
          Official Website ↗
        </a>
        <a
          href={SITE_LINKS.eventDetails}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-[#FEE101]"
        >
          Event Details ↗
        </a>
        <a
          href={SITE_LINKS.registration}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-[#FEE101]"
        >
          Devfolio Apply ↗
        </a>
      </div>

      <p className="text-l font-bold text-white/90 pt-2 pb-1">
        Built By{" "}
        <a
          href="https://x.com/BH4VE5H/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FEE101] hover:underline"
        >
          BH4VE5H
        </a>{" "}
        for{" "}
        <span className="text-[#FEE101]">Hacker House Goa 2026</span> · 28 – 31
        OCT 2026 · Goa, India
      </p>
    </footer>
  );
}
