"use client";

import React from "react";
import Neo3DButton from "@/components/ui/Neo3DButton";
import { handleXShare } from "@/lib/share/x";
import { downloadOrOpenImage } from "@/lib/share/download";

interface PreviewControlsProps {
  viewMode: "3d" | "2d";
  setViewMode: (mode: "3d" | "2d") => void;
  generatedResult: {
    id: string;
    cardUrl: string;
    shareUrl: string;
    xShareUrl: string;
    name: string;
  } | null;
  onReset: () => void;
}

export default function PreviewControls({
  viewMode,
  setViewMode,
  generatedResult,
  onReset,
}: PreviewControlsProps) {
  const isGenerated = !!generatedResult;

  const downloadFileName = `HH-Goa-2026-${(
    generatedResult?.name || "Builder"
  ).replace(/\s+/g, "-")}.png`;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (generatedResult?.cardUrl) {
      downloadOrOpenImage(generatedResult.cardUrl, downloadFileName);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (generatedResult?.xShareUrl) {
      handleXShare(generatedResult.xShareUrl, generatedResult.name, e);
    }
  };

  const handleCopyLink = () => {
    if (!generatedResult?.shareUrl) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedResult.shareUrl);
      alert("Share URL copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col gap-3 font-body mt-2 w-full">
      {/* 1. Mode Toggle (3D Card vs 2D Card) */}
      <div className="flex items-center justify-start">
        <div className="p-1 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`custom-btn text-xs py-1.5 text-nowrap font-black uppercase rounded-full ${
              viewMode === "3d" ? "custom-btn-pink" : "custom-btn-outline-pink"
            }`}
          >
            3D CARD
          </button>
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`custom-btn text-xs py-1.5 text-nowrap font-black uppercase rounded-full ${
              viewMode === "2d" ? "custom-btn-pink" : "custom-btn-outline-pink"
            }`}
          >
            2D CARD
          </button>
        </div>
      </div>

      {/* 2. Simple Status Bar */}
      <div
        className={`p-2.5 text-center bold rounded-3xl uppercase font-heading tracking-wider ${
          isGenerated
            ? "custom-btn-pink border-2 border-pink rounded-full bg-[#FF0080] text-white"
            : "custom-btn-pink border-2 border-pink-400 rounded-full bg-white text-[#FF0080]"
        }`}
      >
        {isGenerated
          ? "YOUR BUILDER PASS IS READY"
          : "GENERATE CARD TO UNLOCK DOWNLOAD & SHARING"}
      </div>

      {/* 3. Action Buttons Grid */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Download & Share on X */}
        <div className="flex flex-row gap-2">
          {isGenerated ? (
            <>
              <Neo3DButton
                type="button"
                onClick={handleDownload}
                variant="pink"
                className="flex-1 text-xs"
              >
                DOWNLOAD PNG
              </Neo3DButton>
              <Neo3DButton
                type="button"
                onClick={handleShare}
                variant="outline-pink"
                className="flex-1 text-xs"
              >
                SHARE ON X
              </Neo3DButton>
            </>
          ) : (
            <>
              <div className="flex-1 py-2 px-3 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none opacity-60">
                DOWNLOAD PNG
              </div>
              <div className="flex-1 py-2 px-3 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none opacity-60">
                SHARE ON X
              </div>
            </>
          )}
        </div>

        {/* Row 2: Copy Link & Reset */}
        <div className="flex flex-row gap-2">
          {isGenerated ? (
            <>
              <Neo3DButton
                type="button"
                onClick={handleCopyLink}
                variant="black"
                className="flex-1 text-xs"
              >
                COPY LINK
              </Neo3DButton>
              <Neo3DButton
                type="button"
                onClick={onReset}
                variant="yellow"
                className="flex-1 text-xs"
              >
                RESET
              </Neo3DButton>
            </>
          ) : (
            <div className="w-full py-2 px-3 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none opacity-60">
              COPY LINK
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
