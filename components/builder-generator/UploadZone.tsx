"use client";

import React, { useState, useRef } from "react";
import { convertHeicToJpegIfNeeded } from "@/lib/image/heic";

interface UploadZoneProps {
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
}

export default function UploadZone({
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
}: UploadZoneProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const originalFile = files[0];

    // Validate type
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
      // Process HEIC transparently if needed
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

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/heic, image/heif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {selectedPreviewUrl ? (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] neo-card bg-zinc-900 border-3 border-black overflow-hidden flex items-center justify-center group">
          <img
            src={selectedPreviewUrl}
            alt="User photo preview"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay hover change photo button */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="neo-btn text-xs px-3 py-2"
            >
              🔄 CHANGE PHOTO
            </button>
            <button
              type="button"
              onClick={onClearPhoto}
              className="neo-btn-pink text-xs px-3 py-2"
            >
              ❌ REMOVE
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full p-6 sm:p-8 neo-card cursor-pointer text-center transition-all ${
            dragActive
              ? "bg-[#FFFBE8] scale-[0.99] border-[#FF0080]"
              : "bg-white hover:bg-[#FFFBE8]"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 bg-[#FEE101] border-3 border-black flex items-center justify-center text-2xl shadow-[3px_3px_0px_0px_#000]">
              📸
            </div>

            <div>
              <p className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
                {isConverting
                  ? "PROCESSING IPHONE HEIC PHOTO..."
                  : "UPLOAD YOUR PHOTO"}
              </p>
              <p className="text-xs sm:text-sm font-bold text-zinc-600 mt-1">
                Drag & drop or tap to choose photo (JPG, PNG, HEIC)
              </p>
            </div>

            {isConverting ? (
              <div className="neo-badge-pink animate-pulse">
                CONVERTING FORMAT...
              </div>
            ) : (
              <div className="neo-badge-yellow">AUTOFIT & CROP READY</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
