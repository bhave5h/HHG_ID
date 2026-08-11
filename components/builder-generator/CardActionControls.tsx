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
          className={`btn-pink ${
            viewMode === "3d"
              ? "btn-pink"
              : "btn-pink"
          }`}
        >
          3D ID Card
        </button>

        <button
          type="button"
          onClick={() => setViewMode("2d")}
          className={`btn-pink ${
            viewMode === "2d"
              ? "btn-pink"
              : "btn-pink"
          }`}
        >
          2D ID Card
        </button>
      </div>

      {/* Row 2: Action Buttons (Download & Share) using Pink Outline Buttons (Small on Mobile) */}
      <div className="flex flex-row justify-center items-center gap-1.5 sm:gap-2.5">
        <a
          href={cardImageUrl}
          download={downloadFileName}
          className="btn-pink"
        >
          DOWNLOAD PASS
        </a>

        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pink"
        >
          SHARE ON X
        </a>
      </div>
    </div>
  );
}
