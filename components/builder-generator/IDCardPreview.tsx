"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { IDCardData, normalizeIDCardData } from "@/types/idCard";

// Dynamically import Lanyard with SSR disabled for R3F Canvas compatibility
const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[540px] bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-800 border-t-[#FEE101] rounded-full animate-spin" />
    </div>
  ),
});

// Single Source of Truth for ID Card Theme & Layout Constants
const CARD_THEME = {
  bgGreen: "#1b6838",
  yellow: "#FEE101",
  black: "#000000",
  badgeGreenText: "#0B6839",
  roleGreen: "#a3e635",
  fontHeader: "Imbue, Georgia, serif",
  fontMono: "'Victor Mono', monospace",
  backPngPath: "/assets/lanyard/ID_back.png",
};

export interface IDCardPreviewProps extends IDCardData {
  cardUrl?: string | null;
  onCardTextureGenerated?: (dataUrl: string) => void;
}

export default function IDCardPreview(props: IDCardPreviewProps) {
  const { cardUrl = null, onCardTextureGenerated } = props;
  const normalized = normalizeIDCardData(props);
  const {
    displayName,
    displayStack,
    displayPassNo,
    frameSrc,
    photoPreviewUrl,
    selectedFrame,
    zoom,
    offsetX,
    offsetY,
    activePanX,
    activePanY,
  } = normalized;

  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [cardTextureUrl, setCardTextureUrl] = useState<string | null>(null);

  // Helper for loading images cleanly on Canvas
  const loadImage = useCallback(
    (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    },
    [],
  );

  // Generate crisp 1200 x 1800 HD Canvas texture for 3D Lanyard
  const updateCardTexture = useCallback(async () => {
    if (cardUrl) {
      setCardTextureUrl(cardUrl);
      return;
    }

    try {
      if (typeof document !== "undefined" && document.fonts) {
        await document.fonts.ready;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Base Green Card Shape
      ctx.fillStyle = CARD_THEME.bgGreen;
      ctx.beginPath();
      ctx.roundRect(0, 0, 1200, 1800, 64);
      ctx.fill();


      // 2. Top Lanyard Hole Slot
      ctx.fillStyle = CARD_THEME.black;
      ctx.beginPath();
      ctx.arc(600, 130, 36, 0, Math.PI * 2);
      ctx.fill();

      // 3. Header Section (Logo drawn later after preloading)

      // Subheader Right Text
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.font = `900 54px ${CARD_THEME.fontHeader}`;
      ctx.textAlign = "right";
      ctx.fillText("GOA, INDIA · 28 – 31 OCT 2026", 1110, 245);
      ctx.font = `900 20px ${CARD_THEME.fontHeader}`;
      ctx.fillText("LESS NOISE. MORE SIGNAL", 1110, 275);
      ctx.textAlign = "left";

      // Async Assets Preloading
      const [mainLogo, goaLogo, studioLogo, frameImg, userPhotoImg] = await Promise.all([
        loadImage("/assets/logo.png"),
        loadImage("/assets/goa.svg"),
        loadImage("/assets/2-47.svg"),
        loadImage(`/assets/${selectedFrame || "frame1.png"}`),
        photoPreviewUrl ? loadImage(photoPreviewUrl) : Promise.resolve(null),
      ]);

      if (mainLogo) {
        ctx.drawImage(mainLogo, 110, 190, 550, 100); 
      }
      if (goaLogo) ctx.drawImage(goaLogo, 780, 120, 270, 200);
      if (studioLogo) ctx.drawImage(studioLogo, 110, 320, 200, 90);

      // 4. Photo Viewport Container (Square 1:1 [90, 320, 1020, 1020])
      const px = 110,
        py = 500,
        pw = 980,
        ph = 980;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 48);
      ctx.clip();

      ctx.fillStyle = CARD_THEME.bgGreen;
      ctx.fill();

      if (userPhotoImg) {
        const origW = userPhotoImg.width || pw;
        const origH = userPhotoImg.height || ph;
        const coverScale = Math.max(pw / origW, ph / origH);
        const effectiveZoom = Math.max(1.0, Math.min(3.0, zoom));
        const totalScale = coverScale * effectiveZoom;

        const scaledW = origW * totalScale;
        const scaledH = origH * totalScale;

        const panX = effectiveZoom > 1.0 ? offsetX : 0;
        const panY = effectiveZoom > 1.0 ? offsetY : 0;

        const dx = px + (pw - scaledW) / 2 + (panX / 400) * pw;
        const dy = py + (ph - scaledH) / 2 + (panY / 400) * ph;

        ctx.drawImage(userPhotoImg, dx, dy, scaledW, scaledH);
      } else {
        ctx.fillStyle = CARD_THEME.yellow;
        ctx.font = `900 64px ${CARD_THEME.fontHeader}`;
        ctx.textAlign = "center";
        ctx.fillText("BUILDER PASS", px + pw / 2, py + ph / 2 - 10);
        ctx.font = "700 30px Arial, sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Upload Photo in Panel", px + pw / 2, py + ph / 2 + 45);
        ctx.textAlign = "left";
      }

      if (frameImg) {
        ctx.drawImage(frameImg, px, py, pw, ph);
      }
      ctx.restore();

      // Photo Frame Yellow Border
      ctx.strokeStyle = CARD_THEME.yellow;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 48);
      ctx.stroke();

      // 5. Bottom Details Section (On Green Background)
      // Name (Yellow Imbue Font)
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.font = `900 88px ${CARD_THEME.fontHeader}`;
      ctx.fillText(displayName, 90, 1460);

      // Role / Title (Yellow/Light-Green Font)
      ctx.fillStyle = CARD_THEME.roleGreen;
      ctx.font = `700 42px ${CARD_THEME.fontMono}`;
      ctx.fillText(displayStack, 90, 1525);

      // ID Badge (Yellow Pill Box with Green Text)
      ctx.save();
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.beginPath();
      ctx.roundRect(90, 1565, 300, 72, 18);
      ctx.fill();

      ctx.fillStyle = CARD_THEME.badgeGreenText;
      ctx.font = `900 32px ${CARD_THEME.fontMono}`;
      ctx.fillText(`NO : ${displayPassNo}`, 125, 1612);
      ctx.restore();

      // Yellow Vector QR Code Pattern (Bottom Right)
      const qx = 940,
        qy = 1450,
        qw = 170,
        qh = 170;

      // Draw QR Finder Squares & Dots in Yellow (#FEE101)
      ctx.fillStyle = CARD_THEME.yellow;
      // Top-Left Finder Outer
      ctx.fillRect(qx, qy, 50, 50);
      ctx.fillStyle = CARD_THEME.bgGreen;
      ctx.fillRect(qx + 10, qy + 10, 30, 30);
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.fillRect(qx + 18, qy + 18, 14, 14);

      // Top-Right Finder Outer
      ctx.fillRect(qx + 120, qy, 50, 50);
      ctx.fillStyle = CARD_THEME.bgGreen;
      ctx.fillRect(qx + 130, qy + 10, 30, 30);
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.fillRect(qx + 138, qy + 18, 14, 14);

      // Bottom-Left Finder Outer
      ctx.fillRect(qx, qy + 120, 50, 50);
      ctx.fillStyle = CARD_THEME.bgGreen;
      ctx.fillRect(qx + 10, qy + 130, 30, 30);
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.fillRect(qx + 18, qy + 138, 14, 14);

      // Alignment Data Pattern Blocks
      ctx.fillRect(qx + 70, qy + 10, 15, 40);
      ctx.fillRect(qx + 70, qy + 70, 30, 30);
      ctx.fillRect(qx + 115, qy + 70, 25, 25);
      ctx.fillRect(qx + 115, qy + 110, 55, 30);
      ctx.fillRect(qx + 70, qy + 120, 25, 40);

      const generatedDataUrl = canvas.toDataURL("image/png");
      setCardTextureUrl(generatedDataUrl);
      if (onCardTextureGenerated) {
        onCardTextureGenerated(generatedDataUrl);
      }
    } catch (err) {
      console.warn("Error rendering front card texture for 3D Lanyard:", err);
    }
  }, [
    cardUrl,
    photoPreviewUrl,
    selectedFrame,
    zoom,
    offsetX,
    offsetY,
    displayName,
    displayStack,
    displayPassNo,
    loadImage,
    onCardTextureGenerated,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateCardTexture();
    }, 150);
    return () => clearTimeout(timer);
  }, [updateCardTexture]);

  // ---------------------------------------------------------------
  // 2D ID Card Preview (Matches exact visual layout of the reference card)
  // ---------------------------------------------------------------
  const render2DCard = () => (
    <div className="w-full font-body relative select-none pointer-events-none">
      {/* Outer Card Frame — Full Green Base */}
      <div className="relative w-full aspect-[2/3] bg-[#1b6838] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl rounded-[32px]">
        {/* 1. LANYARD HOLE CUT-OUT ON TOP OF CARD */}
        <div className="relative z-20 w-full flex justify-center pt-0.5 mb-1.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />
        </div>

        {/* 2. HEADER SECTION */}
        <div className="relative z-10 flex flex-col gap-1 mb-2">
          {/* Top Header Row: Title & Goa Hindi Logo */}
          <div className="flex items-center justify-between">
            <div className="h-10 sm:h-14 w-auto flex items-center justify-start">
              <img 
                src="/assets/logo.png" 
                alt="Hacker House Logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="h-10 sm:h-12 w-auto flex items-center justify-end">
              <img
                src="/assets/goa.svg"
                alt="Goa Hindi Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Subheader Row: 2:47 PM STUDIO on left, Date & Tagline on right */}
          <div className="flex items-end justify-between pt-1 mt-0.5">
            <div className="h-6 sm:h-7 flex items-center">
              <img
                src="/assets/2-47.svg"
                alt="2:47 PM Studio"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col text-right font-['Imbue'] font-heading text-[#FEE101] font-black leading-tight">
              <span className="text-[10px] sm:text-xs tracking-wider">
                GOA, INDIA · 28 – 31 OCT 2026
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-widest uppercase">
                LESS NOISE. MORE SIGNAL
              </span>
            </div>
          </div>
        </div>

        {/* 3. PHOTO VIEWPORT WITH YELLOW BORDER */}
        <div className="relative z-10 w-full aspect-square bg-[#1b6838] border-4 border-[#FEE101] rounded-[28px] overflow-hidden flex items-center justify-center shadow-md">
          {photoPreviewUrl ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `scale(${zoom}) translate(${activePanX / zoom}px, ${activePanY / zoom}px)`,
                }}
              >
                <img
                  src={photoPreviewUrl}
                  alt="Uploaded Builder Photo"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          ) : (
            /* Empty Green State placeholder */
            <div className="w-full h-full bg-[#1b6838] flex flex-col items-center justify-center text-center p-4">
              <span className="font-['Imbue'] font-heading font-black text-xl text-[#FEE101] uppercase tracking-wider">
                BUILDER PASS
              </span>
              <span className="font-body text-[9px] text-zinc-300 font-bold mt-0.5">
                Upload Photo in Panel
              </span>
            </div>
          )}

          {/* Selected Frame Overlay */}
          <img
            src={frameSrc}
            alt="Goa Frame Overlay"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
          />
        </div>

        {/* 4. BOTTOM DETAILS SECTION (Directly on Green Background) */}
        <div className="flex items-end justify-between gap-2 mt-3 pt-1 px-1 relative z-10">
          {/* Left Column: Name, Role, Badge */}
          <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
            <h2 className="font-['Imbue'] font-heading text-3xl sm:text-4xl font-black text-[#FEE101] uppercase tracking-tight leading-none truncate">
              {displayName}
            </h2>
            <p className="font-body text-xs sm:text-sm font-bold text-[#a3e635] leading-tight truncate">
              {displayStack}
            </p>
            <div className="mt-1">
              <div className="bg-[#FEE101] text-[#0B6839] font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-md inline-block shadow-xs">
                NO : {displayPassNo}
              </div>
            </div>
          </div>

          {/* Right Column: Yellow Vector QR Code Graphic */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 text-[#FEE101]">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 4h4v4h-4v-4zm-4 0h2v2h-2v-2zm0 2h2v2h-2v-2zm4-4h2v2h-2v-2zm-2-2h4v2h-4v-2zM5 5h2v2H5V5zm10 0h2v2h-2V5zM5 17h2v2H5v-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FFFBE8] p-5 flex flex-col gap-5 font-body rounded-lg shadow-[7px_7px_0px_0px_#084e2a]">
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/15">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`custom-btn text-xs py-1.5 px-4 ${
              viewMode === "3d" ? "custom-btn-pink" : "custom-btn-outline-pink"
            }`}
          >
            3D ID card
          </button>
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`custom-btn text-xs py-1.5 px-4 ${
              viewMode === "2d" ? "custom-btn-pink" : "custom-btn-outline-pink"
            }`}
          >
            2D Id Card
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
        {viewMode === "3d" ? (
          <div className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center bg-gray-50">
            <Lanyard
              position={[0, 0, 13]}
              fov={20}
              gravity={[0, -40, 0]}
              frontImage={cardTextureUrl}
              backImage={CARD_THEME.backPngPath}
              imageFit="cover"
              lanyardWidth={2}
            />
          </div>
        ) : (
          <div className="p-4 bg-white">{render2DCard()}</div>
        )}
      </div>
    </div>
  );
}
