"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardPreviewProps {
  photoPreviewUrl: string | null;
  name: string;
  stack: string;
  passNo?: string;
  selectedFrame?: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
}

export default function CardPreview({
  photoPreviewUrl,
  name,
  stack,
  passNo = "57236",
  selectedFrame = "frame1.png",
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
}: CardPreviewProps) {
  const displayName = (name.trim() || "BHAVESH CHAWRE").toUpperCase();
  const displayStack = stack.trim() || "Creative Director";
  const displayPassNo = (passNo.trim() || "57236").toUpperCase();

  const activePanX = zoom > 1.0 ? offsetX : 0;
  const activePanY = zoom > 1.0 ? offsetY : 0;

  const frameSrc = `/assets/${selectedFrame || "frame1.png"}`;

  return (
    <div className="w-full neo-card p-3.5 bg-white shadow-[8px_8px_0px_0px_#000] font-body relative select-none pointer-events-none">
      {/* 2:3 Aspect Ratio Card Frame */}
      <div className="relative w-full aspect-[2/3] bg-[#1b6838] border-4 border-black p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-[4px_4px_0px_0px_#000] rounded-[32px]">
        
        {/* 1. LANYARD HOLE CUT-OUT ON TOP OF CARD */}
        <div className="relative z-20 w-full flex justify-center pt-0.5 mb-2">
          <div className="w-24 h-5 bg-black rounded-full border border-black/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
        </div>

        {/* 2. HEADER SECTION */}
        <div className="relative z-10 flex flex-col gap-1 mb-2">
          {/* Top Header Row: Title & Goa Hindi Logo */}
          <div className="flex items-center justify-between">
            <h1 className="font-['Imbue'] font-heading text-4xl sm:text-5xl font-black text-[#FEE101] tracking-tight leading-none">
              HACKER HOUSE
            </h1>
            <div className="h-12 sm:h-14 w-auto flex items-center justify-end">
              <img
                src="/assets/goa_hindi.svg"
                alt="Goa Hindi Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Subheader Row: 2:47 PM STUDIO on left, Date & Tagline on right */}
          <div className="flex items-end justify-between border-t border-[#FEE101]/30 pt-1 mt-0.5">
            <div className="h-7 sm:h-8 flex items-center">
              <img
                src="/assets/2-47.svg"
                alt="2:47 PM Studio"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col text-right font-['Imbue'] font-heading text-[#FEE101] font-black leading-tight">
              <span className="text-[11px] sm:text-xs tracking-wider">GOA, INDIA · 28 – 31 OCT 2026</span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase">LESS NOISE. MORE SIGNAL</span>
            </div>
          </div>
        </div>

        {/* 3. PHOTO VIEWPORT WITH TRUE-TO-SIZE 1:1 SQUARE FRAME OVERLAY */}
        <div className="relative z-10 w-full aspect-square bg-[#1b6838] border-2 border-[#FEE101] rounded-[24px] overflow-hidden flex items-center justify-center">
          {/* User Photo layer if present */}
          {photoPreviewUrl ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `scale(${zoom}) translate(${activePanX / zoom}px, ${activePanY / zoom}px)`,
                }}
              >
                <img
                  src={photoPreviewUrl}
                  alt="Uploaded Builder Photo"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          ) : (
            /* Empty Green State placeholder */
            <div className="w-full h-full bg-[#1b6838] flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FEE101] border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000] mb-2">
                📸
              </div>
              <span className="font-['Imbue'] font-heading font-black text-2xl text-[#FEE101] uppercase tracking-wider">
                BUILDER PASS
              </span>
              <span className="font-body text-[10px] text-zinc-300 font-bold mt-1">
                Upload Photo in Panel
              </span>
            </div>
          )}

          {/* Selected Frame Overlay (frame1.png, frame2.png, frame3.png, frame4.png) */}
          <img
            src={frameSrc}
            alt="Goa Frame Overlay"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
          />
        </div>

        {/* 4. BOTTOM DETAILS SECTION */}
        <div className="relative z-10 flex flex-col gap-1 mt-2">
          {/* Name */}
          <h2 className="font-['Imbue'] font-heading text-3xl sm:text-4xl font-black text-[#FEE101] uppercase tracking-wide leading-none truncate">
            {displayName}
          </h2>

          {/* Role / Stack */}
          <p className="font-body text-sm sm:text-base font-semibold text-[#FEE101] leading-tight truncate">
            {displayStack}
          </p>

          {/* ID Badge */}
          <div className="mt-1">
            <div className="bg-[#FEE101] text-black font-extrabold text-xs sm:text-sm px-3 py-1 rounded-md inline-block border border-black shadow-[2px_2px_0px_0px_#000]">
              NO : {displayPassNo}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
