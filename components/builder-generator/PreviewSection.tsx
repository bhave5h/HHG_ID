import React from "react";
import CardPreview from "./CardPreview";
import ResultActions from "./ResultActions";

interface PreviewSectionProps {
  photoPreviewUrl: string | null;
  name: string;
  stack: string;
  passNo: string;
  selectedFrame: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  generatedResult: {
    id: string;
    cardUrl: string;
    shareUrl: string;
    xShareUrl: string;
    name: string;
  } | null;
  onReset: () => void;
}

export default function PreviewSection({
  photoPreviewUrl,
  name,
  stack,
  passNo,
  selectedFrame,
  zoom,
  offsetX,
  offsetY,
  generatedResult,
  onReset,
}: PreviewSectionProps) {
  return (
    <div className="flex flex-col items-center gap-6 font-body w-full">
      {/* Live ID Card Preview */}
      <div className="w-full">
        <div className="w-full mb-2 flex items-center justify-between">
          <span className="font-['Imbue'] font-heading font-black text-sm uppercase text-[#0B6839]">
            LIVE ID CARD PREVIEW (2:3)
          </span>
          <span className="neo-badge-yellow">1200 × 1800 HD</span>
        </div>

        <CardPreview
          photoPreviewUrl={photoPreviewUrl}
          name={name}
          stack={stack}
          passNo={passNo}
          selectedFrame={selectedFrame}
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </div>

      {/* Generated Result Action Buttons (Download PNG, Share on X) */}
      {generatedResult && (
        <ResultActions
          cardUrl={generatedResult.cardUrl}
          shareUrl={generatedResult.shareUrl}
          xShareUrl={generatedResult.xShareUrl}
          name={generatedResult.name}
          onReset={onReset}
        />
      )}
    </div>
  );
}
