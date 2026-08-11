"use client";

import React from "react";
import { HASHTAG } from "@/lib/constants";

interface CardActionControlsProps {
  viewMode: "3d" | "2d";
  setViewMode: (mode: "3d" | "2d") => void;
  cardImageUrl: string;
  cardName: string;
  xShareUrl: string;
}

export default function CardActionControls({
  viewMode,
  setViewMode,
  cardImageUrl,
  cardName,
  xShareUrl,
}: CardActionControlsProps) {
  const downloadFileName = `HH-Goa-2026-${(cardName || "Builder").replace(/\s+/g, "-")}.png`;

  return (
    <div className="w-full max-w-2xl flex flex-col gap-1.5 sm:gap-2.5 mt-10 sm:mt-0 z-10 font-body relative bg-[#FFFBE8] rounded-lg shadow-[5px_5px_0px_0px_#084e2a] p-5">
      {/* Row 1: View Toggle (3D vs 2D) using Pink Outline Buttons (Small on Mobile) */}
      <div className="flex justify-center items-center gap-1.5 sm:gap-2.5">
        <button
          type="button"
          onClick={() => setViewMode("3d")}
          className={`flex-1 py-2.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer inline-flex items-center justify-center border-2 border-[#FF0080] ${
            viewMode === "3d"
              ? "bg-[#FF0080] text-white shadow-md"
              : "bg-white/90 text-[#FF0080] hover:bg-[#FF0080] hover:text-white"
          }`}
        >
          🎛️ 3D LANYARD VIEW
        </button>

        <button
          type="button"
          onClick={() => setViewMode("2d")}
          className={`flex-1 py-2.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer inline-flex items-center justify-center border-2 border-[#FF0080] ${
            viewMode === "2d"
              ? "bg-[#FF0080] text-white shadow-md"
              : "bg-white/90 text-[#FF0080] hover:bg-[#FF0080] hover:text-white"
          }`}
        >
          🖼️ 2D CARD VIEW
        </button>
      </div>

      {/* Row 2: Action Buttons (Download & Share) using Pink Outline Buttons (Small on Mobile) */}
      <div className="flex flex-row justify-center items-center gap-1.5 sm:gap-2.5">
        <a
          href={cardImageUrl}
          download={downloadFileName}
          className="flex-1 w-full py-1.5 sm:py-2.5 px-2 sm:px-3 text-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#FF0080] bg-white/90 border-2 border-[#FF0080] rounded-full hover:bg-[#FF0080] hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
        >
          📥 DOWNLOAD PASS
        </a>

        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 w-full py-1.5 sm:py-2.5 px-2 sm:px-3 text-center text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#FF0080] bg-white/90 border-2 border-[#FF0080] rounded-full hover:bg-[#FF0080] hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
        >
          🚀 SHARE ON X
        </a>
      </div>
    </div>
  );
}
