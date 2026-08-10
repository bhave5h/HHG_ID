import React from "react";
import BuilderForm from "./BuilderForm";

interface UploadSectionProps {
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
  name: string;
  setName: (val: string) => void;
  stack: string;
  setStack: (val: string) => void;
  passNo: string;
  onGenerate: () => void;
  isGenerating: boolean;
  hasPhoto: boolean;
  zoom: number;
  setZoom: (z: number) => void;
  offsetX: number;
  setOffsetX: (x: number) => void;
  offsetY: number;
  setOffsetY: (y: number) => void;
}

export default function UploadSection({
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
  selectedFrame,
  setSelectedFrame,
  name,
  setName,
  stack,
  setStack,
  passNo,
  onGenerate,
  isGenerating,
  hasPhoto,
  zoom,
  setZoom,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
}: UploadSectionProps) {
  return (
    <div className="p-5 flex flex-col gap-5 font-body bg-[#FFFBE8] rounded-lg shadow-[7px_7px_0px_0px_#084e2a]">
      <h3 className="font-['Imbue'] font-heading font-black text-2xl uppercase tracking-wider text-[#0B6839] border-b border-[#0B6839]/20 pb-3">
        ADD YOUR DETAILS & PHOTO
      </h3>

      {/* INPUT FIELDS, FRAME CHOICE, PHOTO UPLOAD, ZOOM & GENERATE BUTTON */}
      <BuilderForm
        name={name}
        setName={setName}
        stack={stack}
        setStack={setStack}
        passNo={passNo}
        onPhotoSelected={onPhotoSelected}
        selectedPreviewUrl={selectedPreviewUrl}
        onClearPhoto={onClearPhoto}
        selectedFrame={selectedFrame}
        setSelectedFrame={setSelectedFrame}
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        hasPhoto={hasPhoto}
        zoom={zoom}
        setZoom={setZoom}
        offsetX={offsetX}
        setOffsetX={setOffsetX}
        offsetY={offsetY}
        setOffsetY={setOffsetY}
      />
    </div>
  );
}
