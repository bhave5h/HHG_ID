"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import CardPreview from "./CardPreview";

// Dynamically import Lanyard with SSR disabled for R3F Canvas compatibility in Next.js
const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[540px] bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-800 border-t-[#FEE101] rounded-full animate-spin" />
    </div>
  ),
});

const ID_BACK_PNG_PATH = "/assets/lanyard/ID_back.png";

export interface LanyardCardPreviewProps {
  photoPreviewUrl: string | null;
  name: string;
  stack: string;
  passNo?: string;
  selectedFrame?: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  cardUrl?: string | null;
}

export default function LanyardCardPreview({
  photoPreviewUrl,
  name,
  stack,
  passNo = "57236",
  selectedFrame = "frame1.png",
  zoom = 1,
  offsetX = 0,
  offsetY = 0,
  cardUrl = null,
}: LanyardCardPreviewProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [cardTextureUrl, setCardTextureUrl] = useState<string | null>(null);

  // Generate crisp 2D front & back card textures on offscreen canvas for 3D Lanyard
  const updateCardTexture = useCallback(async () => {
    const displayName = (name.trim() || "BHAVESH CHAWRE").toUpperCase();
    const displayStack = stack.trim() || "Creative Director";
    const displayPassNo = (passNo.trim() || "57236").toUpperCase();

    // -------------------------------------------------------------
    // 1. Generate Front Card Texture
    // -------------------------------------------------------------
    if (cardUrl) {
      setCardTextureUrl(cardUrl);
    } else {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Background Card Shape (#1b6838 green)
          ctx.fillStyle = "#1b6838";
          ctx.beginPath();
          ctx.roundRect(0, 0, 800, 1200, 48);
          ctx.fill();

          // Card outer border
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 12;
          ctx.stroke();

          // Lanyard Cut-out slot at top
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.roundRect(280, 20, 240, 34, 17);
          ctx.fill();

          // Header Text "HACKER HOUSE"
          ctx.fillStyle = "#FEE101";
          ctx.font = "900 62px Arial, sans-serif";
          ctx.fillText("HACKER HOUSE", 50, 120);

          // Divider Line
          ctx.strokeStyle = "rgba(254, 225, 1, 0.3)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(50, 145);
          ctx.lineTo(750, 145);
          ctx.stroke();

          // Subheader text
          ctx.fillStyle = "#FEE101";
          ctx.font = "900 16px Arial, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText("GOA, INDIA · 28 – 31 OCT 2026", 750, 172);
          ctx.font = "900 13px Arial, sans-serif";
          ctx.fillText("LESS NOISE. MORE SIGNAL", 750, 192);
          ctx.textAlign = "left";

          // Asynchronously load images (logos, photo, frame overlay)
          const loadImage = (src: string): Promise<HTMLImageElement | null> => {
            return new Promise((resolve) => {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = () => resolve(img);
              img.onerror = () => resolve(null);
              img.src = src;
            });
          };

          const [goaLogo, studioLogo, frameImg, userPhotoImg] =
            await Promise.all([
              loadImage("/assets/goa.svg"),
              loadImage("/assets/2-47.svg"),
              loadImage(`/assets/${selectedFrame || "frame1.png"}`),
              photoPreviewUrl
                ? loadImage(photoPreviewUrl)
                : Promise.resolve(null),
            ]);

          if (goaLogo) ctx.drawImage(goaLogo, 560, 60, 190, 75);
          if (studioLogo) ctx.drawImage(studioLogo, 50, 155, 140, 45);

          // Photo Frame viewport: Square [60, 215, 680, 680]
          const px = 60,
            py = 215,
            pw = 680,
            ph = 680;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 36);
          ctx.clip();

          ctx.fillStyle = "#1b6838";
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
            ctx.fillStyle = "#FEE101";
            ctx.font = "900 42px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("📸 BUILDER PASS", px + pw / 2, py + ph / 2 - 10);
            ctx.font = "700 20px Arial, sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(
              "Upload Photo in Panel",
              px + pw / 2,
              py + ph / 2 + 30,
            );
            ctx.textAlign = "left";
          }

          if (frameImg) {
            ctx.drawImage(frameImg, px, py, pw, ph);
          }
          ctx.restore();

          // Photo frame yellow border
          ctx.strokeStyle = "#FEE101";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 36);
          ctx.stroke();

          // Bottom Details
          // Name
          ctx.fillStyle = "#FEE101";
          ctx.font = "900 52px Arial, sans-serif";
          ctx.fillText(displayName, 60, 965);

          // Stack / Role
          ctx.font = "700 28px Arial, sans-serif";
          ctx.fillText(displayStack, 60, 1015);

          // ID Badge
          ctx.save();
          ctx.fillStyle = "#FEE101";
          ctx.beginPath();
          ctx.roundRect(60, 1045, 230, 54, 14);
          ctx.fill();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = "#000000";
          ctx.font = "900 22px Arial, sans-serif";
          ctx.fillText(`NO : ${displayPassNo}`, 85, 1080);
          ctx.restore();

          setCardTextureUrl(canvas.toDataURL("image/png"));
        }
      } catch (err) {
        console.warn("Error rendering front card texture for 3D Lanyard:", err);
      }
    }
  }, [
    photoPreviewUrl,
    name,
    stack,
    passNo,
    selectedFrame,
    zoom,
    offsetX,
    offsetY,
    cardUrl,
  ]);

  useEffect(() => {
    updateCardTexture();
  }, [updateCardTexture]);

  return (
    <div className="w-full flex flex-col gap-3 font-body">
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between bg-black/5 p-1.5 rounded-xl border border-black/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
              viewMode === "3d"
                ? "bg-[#FEE101] text-black"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            🎮 3D Lanyard Badge
          </button>
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
              viewMode === "2d"
                ? "bg-[#FEE101] text-black"
                : "bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            🖼️ 2D Card Preview
          </button>
        </div>
        <span className="text-[11px] font-bold text-zinc-600 hidden sm:inline">
          {viewMode === "3d" ? "Interactive Drag & Physics" : "Flat HD View"}
        </span>
      </div>

      {/* Main Container */}
      <div className="relative w-full rounded-2xl bg-zinc-950 border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_#000]">
        {viewMode === "3d" ? (
          <div className="relative w-full h-[540px] sm:h-[620px] flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
            <Lanyard
              position={[0, 0, 13]}
              fov={22}
              gravity={[0, -40, 0]}
              frontImage={cardTextureUrl}
              backImage={ID_BACK_PNG_PATH}
              imageFit="cover"
              lanyardWidth={1}
            />
            {/* Interactive hint badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-[#FEE101] text-xs font-black px-4 py-1.5 rounded-full border border-[#FEE101]/40 shadow-[2px_2px_0px_0px_#000] pointer-events-none tracking-wide uppercase">
              🖐️ Drag or toss card to rotate & swing
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white">
            <CardPreview
              photoPreviewUrl={photoPreviewUrl}
              name={name}
              stack={stack}
              passNo={passNo}
              selectedFrame={selectedFrame}
              zoom={zoom}
              offsetX={offsetX}
              offsetY={offsetY}
            />
          </div>
        )}
      </div>
    </div>
  );
}
