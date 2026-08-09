import React from "react";
import UploadZone from "./UploadZone";
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
    <div className="bg-white p-5 neo-card flex flex-col gap-5 font-body">
      <h3 className="font-['Imbue'] font-heading font-black text-xl uppercase tracking-wider text-[#0B6839] border-b-2 border-black pb-2">
        BUILDER DETAILS & PHOTO
      </h3>

      {/* 1. FRAME SELECTOR & IMAGE UPLOAD ON TOP INSIDE DETAILS BOX */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
          FRAME & PHOTO UPLOAD <span className="text-[#FF0080]">*</span>
        </label>
        <UploadZone
          onPhotoSelected={onPhotoSelected}
          selectedPreviewUrl={selectedPreviewUrl}
          onClearPhoto={onClearPhoto}
          selectedFrame={selectedFrame}
          setSelectedFrame={setSelectedFrame}
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </div>

      {/* 2. INPUT FIELDS, ZOOM & POSITION CONTROLS + GENERATE BUTTON */}
      <BuilderForm
        name={name}
        setName={setName}
        stack={stack}
        setStack={setStack}
        passNo={passNo}
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
