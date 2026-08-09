"use client";

import React from "react";
import { HASHTAG } from "@/lib/constants";

interface ResultActionsProps {
  cardUrl: string;
  shareUrl: string;
  xShareUrl: string;
  name: string;
  onReset: () => void;
}

export default function ResultActions({
  cardUrl,
  shareUrl,
  xShareUrl,
  name,
  onReset,
}: ResultActionsProps) {
  const downloadFileName = `HH-Goa-2026-${(name || "Builder").replace(
    /\s+/g,
    "-"
  )}.png`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Shareable card link copied to clipboard!");
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="neo-card-yellow p-3 text-center">
        <p className="text-xs font-black uppercase tracking-wider text-black">
          🎉 YOUR HH GOA 2026 BUILDER PASS IS READY!
        </p>
      </div>

      {/* Main CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={cardUrl}
          download={downloadFileName}
          className="neo-btn flex-1 py-3.5 px-4 text-center font-black text-sm sm:text-base text-black"
        >
          📥 DOWNLOAD ID CARD (PNG)
        </a>

        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="neo-btn-pink flex-1 py-3.5 px-4 text-center font-black text-sm sm:text-base text-white"
        >
          🚀 SHARE ON X ({HASHTAG})
        </a>
      </div>

      {/* Copy Link & Reset Controls */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="neo-card bg-white hover:bg-zinc-100 flex-1 py-2 text-xs font-bold text-black border-2 border-black"
        >
          🔗 COPY SHARE URL
        </button>

        <button
          type="button"
          onClick={onReset}
          className="neo-card bg-zinc-200 hover:bg-zinc-300 px-4 py-2 text-xs font-bold text-black border-2 border-black"
        >
          ✨ CREATE ANOTHER
        </button>
      </div>
    </div>
  );
}
