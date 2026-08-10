"use client";

import React, { useState, useRef } from "react";
import { convertHeicToJpegIfNeeded } from "@/lib/image/heic";

interface UploadZoneProps {
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
  selectedFrame?: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
}

export default function UploadZone({
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
  selectedFrame = "frame1.png",
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
}: UploadZoneProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    <div className="w-full font-body flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/heic, image/heif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Fixed-size container — same dimensions before & after upload */}
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        {/* Photo / Dropzone Box (always same size) */}
        <div className="w-[200px] sm:w-[255px] aspect-square bg-white border border-zinc-300 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-md select-none shrink-0">
          {selectedPreviewUrl ? (
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
          ) : (
            /* Dropzone with Grid Pattern */
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-full cursor-pointer text-center flex items-center justify-center ${
                dragActive ? "scale-[0.98] bg-[#FFF8D6]" : ""
              }`}
            >
              <div className="relative w-full h-full grid grid-cols-[1fr_1rem_auto_1rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] [--pattern-fg:rgba(0,0,0,0.12)]">
                <div className="col-start-3 row-start-3 flex max-w-lg flex-col relative items-center justify-center p-3">
                  <span className="font-['Imbue'] font-heading font-black text-xl sm:text-2xl tracking-wider text-[#0B6839] uppercase leading-none mb-1">
                    {isConverting ? "PROCESSING HEIC..." : "CLICK TO UPLOAD"}
                  </span>
                </div>

                <div className="-right-px col-start-2 row-span-full row-start-1 border-x border-black/10 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />
                <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-black/10 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />
                <div className="relative -bottom-px col-span-full col-start-1 row-start-2 border-t border-black/10 border-dashed" />
                <div className="relative -top-px col-span-full col-start-1 row-start-4 border-b border-black/10 border-dashed" />
              </div>
            </div>
          )}
        </div>

        {/* Action buttons (visible only after upload) */}
        {selectedPreviewUrl && (
          <div className="flex flex-col gap-2 min-w-[84px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="custom-btn custom-btn-outline-pink py-2 px-3 text-xs text-center"
            >
              CHANGE
            </button>

            <button
              type="button"
              onClick={onClearPhoto}
              className="custom-btn custom-btn-pink py-2 px-3 text-xs text-center"
            >
              REMOVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


