"use client";

import React, { useState, useRef } from "react";
import { convertHeicToJpegIfNeeded } from "@/lib/image/heic";

interface UploadZoneProps {
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
  zoom: number;
  setZoom: (z: number) => void;
  offsetX: number;
  setOffsetX: (x: number) => void;
  offsetY: number;
  setOffsetY: (y: number) => void;
}

export default function UploadZone({
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
  selectedFrame,
  setSelectedFrame,
  zoom,
  setZoom,
  offsetX,
  setOffsetX,
  offsetY,
  setOffsetY,
}: UploadZoneProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const frames = [
    { id: "frame1.png", label: "Frame 1" },
    { id: "frame2.png", label: "Frame 2" },
    { id: "frame3.png", label: "Frame 3" },
    { id: "frame4.png", label: "Frame 4" },
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const originalFile = files[0];

    const name = originalFile.name.toLowerCase();
    const isImage =
      originalFile.type.startsWith("image/") ||
      name.endsWith(".heic") ||
      name.endsWith(".heif");

    if (!isImage) {
      alert("Please upload a valid image file (JPG, PNG, or HEIC).");
      return;
    }

    try {
      setIsConverting(true);
      const processedFile = await convertHeicToJpegIfNeeded(originalFile);
      const previewUrl = URL.createObjectURL(processedFile);
      onPhotoSelected(processedFile, previewUrl);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    } catch (err) {
      console.error("Image processing error:", err);
      alert("Could not process this photo. Please try another image.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const activePanX = zoom > 1.0 ? offsetX : 0;
  const activePanY = zoom > 1.0 ? offsetY : 0;

  return (
    <div className="w-full font-body flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/heic, image/heif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Frame Choice Selector */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
          CHOOSE FRAME STYLE:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {frames.map((frame) => {
            const isSelected = selectedFrame === frame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => setSelectedFrame(frame.id)}
                className={`py-2 px-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer text-center rounded ${
                  isSelected
                    ? "bg-[#FEE101] text-black shadow-[3px_3px_0px_0px_#000] scale-[1.02]"
                    : "bg-white text-zinc-700 hover:bg-[#FFFBE8] shadow-[2px_2px_0px_0px_#000]"
                }`}
              >
                {frame.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedPreviewUrl ? (
        <div className="flex flex-col gap-3">
          {/* Photo Viewport Container — True to Size 1:1 Square */}
          <div className="relative w-full aspect-square neo-card bg-[#1b6838] border-3 border-black overflow-hidden flex items-center justify-center select-none">
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75"
              style={{
                transform: `scale(${zoom}) translate(${activePanX / zoom}px, ${activePanY / zoom}px)`,
              }}
            >
              <img
                src={selectedPreviewUrl}
                alt="User photo preview"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Selected Frame Overlay */}
            <img
              src={`/assets/${selectedFrame}`}
              alt="Frame Overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />
          </div>

          {/* TWO BUTTONS DIRECTLY BELOW THE IMAGE */}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="neo-btn flex-1 py-2 text-xs font-black text-black"
            >
              🔄 CHANGE PHOTO
            </button>

            <button
              type="button"
              onClick={onClearPhoto}
              className="neo-btn-pink flex-1 py-2 text-xs font-black text-white"
            >
              ❌ REMOVE
            </button>
          </div>
        </div>
      ) : (
        /* Clean 1:1 Upload Placeholder */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full aspect-square neo-card cursor-pointer text-center bg-[#FFFDF0] hover:bg-[#FFF8D6] transition-colors border-2 border-dashed border-[#0B6839]/40 relative overflow-hidden flex items-center justify-center ${
            dragActive ? "scale-[0.99] border-[#FF0080] bg-[#FFF8D6]" : ""
          }`}
        >
          {/* Selected Frame Preview Overlay */}
          <img
            src={`/assets/${selectedFrame}`}
            alt="Frame Overlay Preview"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 z-0"
          />

          <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-4">
            <div className="w-12 h-12 rounded-full bg-[#FEE101] border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000]">
              📸
            </div>
            <span className="font-['Imbue'] font-heading font-black text-2xl tracking-wider text-[#0B6839] uppercase">
              {isConverting ? "PROCESSING HEIC PHOTO..." : "CLICK TO UPLOAD PHOTO"}
            </span>
            <span className="font-body text-xs font-bold text-zinc-700 bg-white/80 px-2 py-0.5 rounded">
              Drag & drop photo or click to browse (JPG, PNG, HEIC)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
