"use client";

import React from "react";

interface CardPreviewProps {
  photoPreviewUrl: string | null;
  name: string;
  stack: string;
  builderTitle: string;
  generatedImageUrl: string | null;
}

export default function CardPreview({
  photoPreviewUrl,
  name,
  stack,
  builderTitle,
  generatedImageUrl,
}: CardPreviewProps) {
  const displayName = (name.trim() || "BHAVESH CHAWRE").toUpperCase();
  const displayStack = (stack.trim() || "AI × DESIGN × DEVELOPMENT").toUpperCase();
  const displayTitle = (builderTitle.trim() || "THE PIXEL ARCHITECT").toUpperCase();

  return (
    <div className="w-full neo-card p-3 sm:p-4 bg-white shadow-[6px_6px_0px_0px_#000]">
      {/* If final PNG is generated, show real image; else show live dynamic canvas preview */}
      {generatedImageUrl ? (
        <div className="relative w-full aspect-[4/5] bg-zinc-950 border-3 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000]">
          <img
            src={generatedImageUrl}
            alt="Generated HH Goa 2026 Builder ID Card"
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="relative w-full aspect-[4/5] bg-[#0B6839] border-4 border-black p-3 sm:p-4 flex flex-col justify-between overflow-hidden shadow-[4px_4px_0px_0px_#000]">
          {/* Yellow Frame Inner Border */}
          <div className="absolute inset-0 border-[10px] border-[#FEE101] pointer-events-none" />

          {/* Card Top Header */}
          <div className="relative z-10 pt-2 px-2 flex justify-between items-center">
            <div className="neo-badge-yellow text-[10px] sm:text-xs">
              HH GOA 2026
            </div>
            <div className="neo-badge-pink text-[10px] sm:text-xs">
              BUILDER PASS
            </div>
          </div>

          {/* Subtitle Header */}
          <div className="relative z-10 text-center my-1">
            <p className="text-[10px] sm:text-xs font-black uppercase text-white tracking-widest">
              HACKER HOUSE GOA · 2026 EDITION
            </p>
          </div>

          {/* Photo Frame Container */}
          <div className="relative z-10 w-full aspect-[16/10] bg-zinc-900 border-3 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden flex items-center justify-center">
            {photoPreviewUrl ? (
              <img
                src={photoPreviewUrl}
                alt="Live photo crop preview"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="text-center p-4 text-zinc-400">
                <span className="text-3xl sm:text-4xl">👤</span>
                <p className="text-xs font-bold text-zinc-300 mt-1 uppercase">
                  UPLOAD PHOTO TO PREVIEW PASS
                </p>
              </div>
            )}

            {/* Corner Badge */}
            <div className="absolute top-2 left-2 bg-[#FF0080] text-white font-black text-[9px] sm:text-[11px] px-2 py-0.5 border-2 border-black">
              OFFICIAL BUILDER
            </div>
          </div>

          {/* User Details Area */}
          <div className="relative z-10 space-y-2 mt-2">
            {/* Name Box */}
            <div className="bg-[#FEE101] border-3 border-black p-2 sm:p-2.5 shadow-[3px_3px_0px_0px_#000]">
              <p className="text-[9px] font-black text-black uppercase tracking-wider">
                BUILDER NAME
              </p>
              <p className="text-sm sm:text-lg font-black text-black tracking-tight truncate">
                {displayName}
              </p>
            </div>

            {/* Stack Tag */}
            <div className="bg-[#FF0080] border-2 border-black p-1.5 px-2 shadow-[2px_2px_0px_0px_#000]">
              <p className="text-[10px] sm:text-xs font-black text-white tracking-wider truncate">
                STACK: {displayStack}
              </p>
            </div>

            {/* Builder Title Tag */}
            <div className="bg-black border-2 border-[#FEE101] p-1.5 px-2 shadow-[2px_2px_0px_0px_#FEE101]">
              <p className="text-[10px] sm:text-xs font-black text-[#FEE101] tracking-wider truncate">
                CLASS: {displayTitle}
              </p>
            </div>
          </div>

          {/* Card Footer Banner */}
          <div className="relative z-10 bg-[#FEE101] border-2 border-black px-2 py-1 flex justify-between items-center text-black font-black text-[10px] sm:text-xs">
            <span>#FrameInGoa</span>
            <span>HHGOA.COM</span>
          </div>
        </div>
      )}
    </div>
  );
}
