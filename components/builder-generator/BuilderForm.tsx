import React from "react";
import Neo3DButton from "@/components/ui/Neo3DButton";
import UploadZone from "./UploadZone";
import FrameSelector from "./FrameSelector";
import { FILTER_OPTIONS } from "@/lib/image/photoFilters";
import { ConfettiButton } from "@/components/confetti-button";


interface BuilderFormProps {
  name: string;
  setName: (val: string) => void;
  stack: string;
  setStack: (val: string) => void;
  qrUrl: string;
  setQrUrl: (val: string) => void;
  passNo: string;
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
  photoFilter: string;
  setPhotoFilter: (filter: string) => void;
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

export default function BuilderForm({
  name,
  setName,
  stack,
  setStack,
  qrUrl,
  setQrUrl,
  passNo,
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
  selectedFrame,
  setSelectedFrame,
  photoFilter,
  setPhotoFilter,
  onGenerate,
  isGenerating,
  hasPhoto,
  zoom,
  setZoom,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
}: BuilderFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPhoto) {
      console.error("Please upload a photo before generating your ID card.");
      return;
    }
    onGenerate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3 font-body"
    >
      {/* 1. Name Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
          1. YOUR NAME <span className="text-[#0B6839]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ravi Kishan"
          maxLength={30}
          required
          className="neo-input text-xs sm:text-sm py-1 px-2.5 h-9"
        />
      </div>

      {/* 2. Stack / Role Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
          2. ROLE / TITLE <span className="text-[#0B6839]]">*</span>
        </label>
        <input
          type="text"
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="e.g. Creative Director"
          maxLength={40}
          required
          className="neo-input text-xs sm:text-sm py-1 px-2.5 h-9"
        />
      </div>

      {/* 3. Dynamic QR URL Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
          3. SOCIALS LINK  <span className="text-[#0B6839]">*</span>
        </label>
        <input
          type="url"
          value={qrUrl}
          onChange={(e) => setQrUrl(e.target.value)}
          placeholder="e.g. https://x.com/BH4VE5H"
          required
          className="neo-input text-xs sm:text-sm py-1 px-2.5 h-9"
        />
      </div>

      {/* 4. PHOTO UPLOAD */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body">
          4. PHOTO UPLOAD <span className="text-[#0B6839]">*</span>
        </label>
        <UploadZone
          onPhotoSelected={onPhotoSelected}
          selectedPreviewUrl={selectedPreviewUrl}
          onClearPhoto={onClearPhoto}
          selectedFrame={selectedFrame}
          photoFilter={photoFilter}
          zoom={zoom}
          setZoom={setZoom}
          offsetX={offsetX}
          setOffsetX={setOffsetX}
          offsetY={offsetY}
          setOffsetY={setOffsetY}
        />
      </div>

      {/* 5. SELECT FRAME */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body truncate">
          5. SELECT FRAME 
        </label>
        <FrameSelector
          selectedFrame={selectedFrame}
          setSelectedFrame={setSelectedFrame}
        />
      </div>

      {/* 6. PHOTO APPEARANCE / FILTERS */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body ">
          6. SELECT FILTERS
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {FILTER_OPTIONS.map((f) => {
            const isSelected = photoFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setPhotoFilter(f.id)}
                className={`custom-btn py-1 px-1 text-[10px] uppercase text-center truncate ${
                  isSelected
                    ? "custom-btn-pink"
                    : "custom-btn-outline-pink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>


      {/* ZOOM & POSITION CONTROLS (Only when photo is uploaded) */}
      {hasPhoto && (
        <div className="p-3 bg-white/80 border-2 border-[#FF0080] rounded-3xl flex flex-col gap-2 my-0.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0B6839] flex items-center gap-1">
              🔍 ZOOM & ADJUST PHOTO
            </span>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffsetX(0);
                setOffsetY(0);
              }}
              className="text-[9px] font-bold text-[#FF0080] hover:underline cursor-pointer"
            >
              RESET POSITION
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-zinc-800 min-w-8">
              {zoom.toFixed(1)}x
            </span>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#FF0080] cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
            />
          </div>

          {/* Micro Pan Buttons (Active when zoom > 1.0) */}
          {zoom > 1.0 && (
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-800 pt-1.5 border-t border-zinc-200">
              <span>MOVE PHOTO:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setOffsetX(offsetX - 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs"
                >
                  ⬅️
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetX(offsetX + 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs"
                >
                  ➡️
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetY(offsetY - 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs"
                >
                  ⬆️
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetY(offsetY + 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs"
                >
                  ⬇️
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Generate Button */}
      <div className="mt-0.5 w-fit mx-auto">
        <Neo3DButton
          type="submit"
          variant="outline-pink"
          disabled={isGenerating || !hasPhoto}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2 text-xs ">
              GENERATING BUILDER PASS...
            </span>
          ) : (
            "GENERATE ID CARD"
          )}
        </Neo3DButton>
      </div>
    </form>
  );
}




