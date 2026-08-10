import React from "react";
import { HASHTAG } from "@/lib/constants";
import Neo3DButton from "@/components/ui/Neo3DButton";

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
    <div className="w-full flex flex-col gap-4 font-body">
      <div className="bg-[#FEE101] p-3.5 text-center rounded-2xl border border-black/10 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wider text-black">
          🎉 YOUR HH GOA 2026 BUILDER PASS IS READY!
        </p>
      </div>

      {/* Main CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Neo3DButton
          asAnchor
          href={cardUrl}
          download={downloadFileName}
          variant="pink"
          className="flex-1"
        >
          📥 DOWNLOAD ID CARD (PNG)
        </Neo3DButton>

        <Neo3DButton
          asAnchor
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-pink"
          className="flex-1"
        >
          🚀 SHARE ON X ({HASHTAG}) ↗
        </Neo3DButton>
      </div>

      {/* Copy Link & Reset Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
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
      </div>
    </div>
  );
}
