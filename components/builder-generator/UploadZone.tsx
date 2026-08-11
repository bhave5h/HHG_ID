"use client";

import React, { useState, useRef } from "react";
import { convertHeicToJpegIfNeeded } from "@/lib/image/heic";

interface UploadZoneProps {
  onPhotoSelected: (file: File, previewUrl: string) => void;
  selectedPreviewUrl: string | null;
  onClearPhoto: () => void;
  selectedFrame?: string;
  photoFilter?: string;
  zoom?: number;
  setZoom?: (z: number) => void;
  offsetX?: number;
  setOffsetX?: (x: number) => void;
  offsetY?: number;
  setOffsetY?: (y: number) => void;
}

export default function UploadZone({
  onPhotoSelected,
  selectedPreviewUrl,
  onClearPhoto,
  selectedFrame = "frame1.png",
  photoFilter = "none",
  zoom = 1,
  setZoom,
  offsetX = 0,
  setOffsetX,
  offsetY = 0,
  setOffsetY,
}: UploadZoneProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initX: number; initY: number } | null>(null);
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

  // Mouse wheel scroll to zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!selectedPreviewUrl || !setZoom) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const nextZoom = Math.max(1.0, Math.min(3.0, Number((zoom + delta).toFixed(2))));
    setZoom(nextZoom);
  };

  // Mouse dragging to pan photo
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedPreviewUrl) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initX: offsetX,
      initY: offsetY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || !setOffsetX || !setOffsetY) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffsetX(dragStartRef.current.initX + dx * 1.5);
    setOffsetY(dragStartRef.current.initY + dy * 1.5);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!selectedPreviewUrl || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initX: offsetX,
      initY: offsetY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current || !setOffsetX || !setOffsetY || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setOffsetX(dragStartRef.current.initX + dx * 1.5);
    setOffsetY(dragStartRef.current.initY + dy * 1.5);
  };

  const activePanX = zoom > 1.0 ? offsetX : 0;
  const activePanY = zoom > 1.0 ? offsetY : 0;

  const frameSrc = selectedFrame && selectedFrame !== "none" ? `/assets/${selectedFrame}` : null;

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
        <div
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className={`w-[130px] sm:w-[150px] aspect-square bg-white border border-zinc-300 rounded-xl relative overflow-hidden flex items-center justify-center shadow-sm select-none shrink-0 ${
            selectedPreviewUrl ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
          }`}
        >
          {selectedPreviewUrl ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
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

              {/* Selected Frame Overlay if active */}
              {frameSrc && (
                <img
                  src={frameSrc}
                  alt="Frame overlay"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}
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
              <div className="relative w-full h-full grid grid-cols-[1fr_0.5rem_auto_0.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] [--pattern-fg:rgba(0,0,0,0.12)]">
                <div className="col-start-3 row-start-3 flex max-w-lg flex-col relative items-center justify-center p-2">
                  <span className="font-['Imbue'] font-heading font-black text-sm sm:text-base tracking-wider text-[#0B6839] uppercase leading-none mb-1">
                    {isConverting ? "PROCESSING..." : "CLICK TO UPLOAD"}
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
          <div className="flex flex-col gap-1.5 min-w-[70px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="custom-btn custom-btn-outline-pink py-1 px-2.5 text-[10px] text-center"
            >
              CHANGE
            </button>

            <button
              type="button"
              onClick={onClearPhoto}
              className="custom-btn custom-btn-pink py-1 px-2.5 text-[10px] text-center"
            >
              REMOVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




