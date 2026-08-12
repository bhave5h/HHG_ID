import React from "react";
import { HASHTAG } from "@/lib/constants";
import Neo3DButton from "@/components/ui/Neo3DButton";
import { handleXShare } from "@/lib/share/x";
import { downloadOrOpenImage } from "@/lib/share/download";

interface ResultActionsProps {
  generatedResult: {
    id: string;
    cardUrl: string;
    shareUrl: string;
    xShareUrl: string;
    name: string;
  } | null;
  onReset: () => void;
}

export default function ResultActions({
  generatedResult,
  onReset,
}: ResultActionsProps) {
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
      alert("Shareable card link copied to clipboard!");
    }
  };

  return (
    <div className="w-full flex flex-col gap-3.5 font-body mt-1">
      {/* Status Banner */}
      <div
        className={`p-3 text-center rounded-2xl border transition-all duration-300 ${
          isGenerated
            ? "bg-[#FEE101] border-black/20 shadow-sm"
            : "bg-white/80 border-[#0B6839]/15 shadow-xs"
        }`}
      >
        <p
          className={`text-xs font-black uppercase tracking-wider ${
            isGenerated ? "text-black" : "text-[#0B6839]"
          }`}
        >
          {isGenerated
            ? "🎉 YOUR HH GOA 2026 BUILDER PASS IS READY!"
            : "🔒 GENERATE YOUR PASS TO UNLOCK EXPORT & SHARING"}
        </p>
      </div>

      {/* Row 1: Download & Share on X */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {isGenerated ? (
          <>
            <Neo3DButton
              type="button"
              onClick={handleDownload}
              variant="pink"
              className="flex-1"
            >
              📥 DOWNLOAD ID CARD (PNG)
            </Neo3DButton>

            <Neo3DButton
              type="button"
              onClick={handleShare}
              variant="outline-pink"
              className="flex-1"
            >
              🚀 SHARE ON X ({HASHTAG}) ↗
            </Neo3DButton>
          </>
        ) : (
          <>
            <div className="flex-1 py-2.5 px-3 bg-zinc-100/90 border border-zinc-300 rounded-xl text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none flex items-center justify-center gap-1.5 opacity-60">
              🔒 DOWNLOAD ID CARD (PNG)
            </div>
            <div className="flex-1 py-2.5 px-3 bg-zinc-100/90 border border-zinc-300 rounded-xl text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none flex items-center justify-center gap-1.5 opacity-60">
              🔒 SHARE ON X ↗
            </div>
          </>
        )}
      </div>

      {/* Row 2: Copy Share Link & Create Another */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {isGenerated ? (
          <>
            <Neo3DButton
              type="button"
              onClick={handleCopyLink}
              variant="black"
              className="flex-1"
            >
              🔗 COPY SHARE URL ↗
            </Neo3DButton>

            <Neo3DButton
              type="button"
              onClick={onReset}
              variant="yellow"
              className="flex-1"
            >
              ✨ CREATE ANOTHER ↗
            </Neo3DButton>
          </>
        ) : (
          <div className="w-full py-2.5 px-3 bg-zinc-100/90 border border-zinc-300 rounded-xl text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none flex items-center justify-center gap-1.5 opacity-60">
            🔒 COPY SHARE LINK (GENERATE FIRST)
          </div>
        )}
      </div>
    </div>
  );
}
