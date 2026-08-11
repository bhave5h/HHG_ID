import React from "react";
import IDCardPreview from "./IDCardPreview";
import ResultActions from "./ResultActions";

interface PreviewSectionProps {
  photoPreviewUrl: string | null;
  name: string;
  stack: string;
  qrUrl?: string;
  photoFilter?: string;
  passNo: string;
  selectedFrame: string;
  zoom: number;
  setZoom?: (z: number) => void;
  offsetX: number;
  setOffsetX?: (x: number) => void;
  offsetY: number;
  setOffsetY?: (y: number) => void;
  onCardTextureGenerated?: (dataUrl: string) => void;
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
  qrUrl,
  photoFilter,
  passNo,
  selectedFrame,
  zoom,
  setZoom,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
  onCardTextureGenerated,
  generatedResult,
  onReset,
}: PreviewSectionProps) {
  return (
    <div className="flex flex-col items-center gap-6 font-body w-full">
      {/* Live ID Card Preview */}
      <div className="w-full">
        <IDCardPreview
          photoPreviewUrl={photoPreviewUrl}
          name={name}
          stack={stack}
          qrUrl={qrUrl}
          photoFilter={photoFilter}
          passNo={passNo}
          selectedFrame={selectedFrame}
          zoom={zoom}
          setZoom={setZoom}
          offsetX={offsetX}
          setOffsetX={setOffsetX}
          offsetY={offsetY}
          setOffsetY={setOffsetY}
          cardUrl={generatedResult?.cardUrl}
          onCardTextureGenerated={onCardTextureGenerated}
          generatedResult={generatedResult}
          onReset={onReset}
        />
      </div>
    </div>
  );
}



