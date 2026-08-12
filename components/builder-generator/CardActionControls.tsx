"use client";

import React from "react";
import Link from "next/link";
import { HASHTAG } from "@/lib/constants";
import { handleXShare } from "@/lib/share/x";
import { downloadOrOpenImage } from "@/lib/share/download";

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

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadOrOpenImage(cardImageUrl, downloadFileName);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    handleXShare(xShareUrl, cardName, e);
  };

  return (
    <div className="lg:w-[900px] flex flex-col items-center gap-2.5 z-10 font-body relative bg-[#FFFBE8] rounded-lg shadow-[5px_5px_0px_0px_#084e2a] p-3.5 sm:p-4 text-center mt-2">
      {/* 1. Mode Switcher & Pass Action Buttons Side-by-Side (UP/TOP) */}
      <div className="flex flex-wrap justify-center items-center gap-2 w-full">
        <button
          type="button"
          onClick={() => setViewMode("3d")}
          className={`btn-pink text-xs sm:text-sm py-1.5 px-3 w-auto whitespace-nowrap cursor-pointer ${
            viewMode === "3d"
              ? "ring-2 ring-black/50 shadow-md scale-105"
              : "opacity-85 hover:opacity-100"
          }`}
        >
          3D ID Card
        </button>

        <button
          type="button"
          onClick={() => setViewMode("2d")}
          className={`btn-pink text-xs sm:text-sm py-1.5 px-3 w-auto whitespace-nowrap cursor-pointer ${
            viewMode === "2d"
              ? "ring-2 ring-black/50 shadow-md scale-105"
              : "opacity-85 hover:opacity-100"
          }`}
        >
          2D ID Card
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="btn-pink text-xs sm:text-sm py-1.5 px-3 w-auto whitespace-nowrap inline-block cursor-pointer"
        >
         DOWNLOAD ID
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="btn-pink text-xs sm:text-sm py-1.5 px-3 w-auto whitespace-nowrap inline-block cursor-pointer"
        >
          SHARE ON X
        </button>
      </div>

      {/* 2. Want Your Own ID Card CTA Section (DOWN/BOTTOM) */}
      <div className="flex flex-col items-center gap-1.5 w-full ">
        <h3 className="font-heading text-xl sm:text-3xl font-bold text-[#0B6839] uppercase">
          Want Your Own ID Card ?
        </h3>
        <Link
          href="/"
          className="btn-pink text-xs sm:text-sm px-4 rounded-full font-bold hover:underline inline-block w-fit mt-1"
        >
          CREATE YOUR OWN ID PASS ↗
        </Link>
        <p className="text-[11px] sm:text-xs font-bold mt-1 text-[#0B6839] max-w-[320px] mx-auto leading-tight">
          Upload your photo, set your title, and join 500+ elite builders at HH Goa 2026.
        </p>

      </div>
    </div>
  );
}
