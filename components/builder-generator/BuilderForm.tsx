import React from "react";
import Neo3DButton from "@/components/ui/Neo3DButton";
import UploadZone from "./UploadZone";
import FrameSelector from "./FrameSelector";

interface BuilderFormProps {
  name: string;
  setName: (val: string) => void;
  stack: string;
  setStack: (val: string) => void;
  passNo: string;
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
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
  passNo,
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
  selectedFrame,
  setSelectedFrame,
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
      alert("Please upload your photo to your ID card first!");
      return;
    }
    onGenerate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-5 font-body"
    >
      {/* 1. Name Input */}
      <div>
        <label className="block text-l font-black uppercase tracking-wider text-black mb-1">
          1. YOUR NAME <span className="text-[#FF0080]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ravi Kishan"
          maxLength={30}
          required
          className="neo-input text-sm sm:text-base"
        />
      </div>

      {/* 2. Stack / Role Input */}
      <div>
        <label className="block text-l font-black uppercase tracking-wider text-black mb-1">
          2. ROLE / TITLE <span className="text-[#FF0080]">*</span>
        </label>
        <input
          type="text"
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="e.g. Creative Director"
          maxLength={40}
          required
          className="neo-input text-sm sm:text-base"
        />
      </div>

      {/* 3. PHOTO UPLOAD */}
      <div>
        <label className="block text-l font-black uppercase tracking-wider text-black mb-2 font-body">
          3. PHOTO UPLOAD <span className="text-[#FF0080]">*</span>
        </label>
        <UploadZone
          onPhotoSelected={onPhotoSelected}
          selectedPreviewUrl={selectedPreviewUrl}
          onClearPhoto={onClearPhoto}
          selectedFrame={selectedFrame}
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </div>

      {/* 4. SELECT FRAME */}
      <div>
        <label className="block text-l font-black uppercase tracking-wider text-black mb-2 font-body">
          4. SELECT FRAME <span className="text-[#FF0080]">*</span>
        </label>
        <FrameSelector
          selectedFrame={selectedFrame}
          setSelectedFrame={setSelectedFrame}
        />
      </div>

      {/* ZOOM & POSITION CONTROLS (Only when photo is uploaded) */}
      {hasPhoto && (
        <div className="p-4 bg-white/80 border border-[#0B6839]/15 rounded-2xl flex flex-col gap-2.5 my-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B6839] flex items-center gap-1.5">
              🔍 ZOOM & ADJUST PHOTO
            </span>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffsetX(0);
                setOffsetY(0);
              }}
              className="text-[10px] font-bold text-[#FF0080] hover:underline cursor-pointer"
            >
              RESET POSITION
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-zinc-800 min-w-12">
              {zoom.toFixed(1)}x
            </span>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#FF0080] cursor-pointer h-2 bg-zinc-200 rounded-lg"
            />
          </div>

          {/* Micro Pan Buttons (Active when zoom > 1.0) */}
          {zoom > 1.0 && (
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-800 pt-2 border-t border-zinc-200">
              <span>MOVE PHOTO:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setOffsetX(offsetX - 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2.5 py-1 hover:bg-[#FEE101] text-xs font-bold cursor-pointer shadow-xs"
                >
                  ⬅️
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetX(offsetX + 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2.5 py-1 hover:bg-[#FEE101] text-xs font-bold cursor-pointer shadow-xs"
                >
                  ➡️
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetY(offsetY - 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2.5 py-1 hover:bg-[#FEE101] text-xs font-bold cursor-pointer shadow-xs"
                >
                  ⬆️
                </button>
                <button
                  type="button"
                  onClick={() => setOffsetY(offsetY + 15)}
                  className="bg-white border border-zinc-300 rounded-full px-2.5 py-1 hover:bg-[#FEE101] text-xs font-bold cursor-pointer shadow-xs"
                >
                  ⬇️
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Generate 3D Button */}
      <div className="mt-1">
        <Neo3DButton
          type="submit"
          variant="pink"
          disabled={isGenerating || !hasPhoto}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-black"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              GENERATING BUILDER PASS...
            </span>
          ) : (
            "🚀 GENERATE BUILDER ID CARD"
          )}
        </Neo3DButton>
      </div>
    </form>
  );
}
