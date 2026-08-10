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
  onCardTextureGenerated?: (dataUrl: string) => void;
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
  onCardTextureGenerated,
}: LanyardCardPreviewProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [cardTextureUrl, setCardTextureUrl] = useState<string | null>(null);

  // Generate crisp 2D front & back card textures on offscreen canvas for 3D Lanyard
  const updateCardTexture = useCallback(async () => {
    const displayName = (name.trim() || "BHAVESH CHAWRE").toUpperCase();
    const displayStack = stack.trim() || "Creative Director";
    const displayPassNo = (passNo.trim() || "57236").toUpperCase();

    // -------------------------------------------------------------
    // 1. Generate Front Card Texture (1200 x 1800 HD)
    // -------------------------------------------------------------
    if (cardUrl) {
      setCardTextureUrl(cardUrl);
    } else {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1800;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Background Card Shape (#1b6838 green)
          ctx.fillStyle = "#1b6838";
          ctx.beginPath();
          ctx.roundRect(0, 0, 1200, 1800, 64);
          ctx.fill();

          // Card outer border
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 16;
          ctx.stroke();

          // Lanyard Cut-out slot at top
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.roundRect(480, 30, 240, 44, 22);
          ctx.fill();

          // Header Text "HACKER HOUSE"
          ctx.fillStyle = "#FEE101";
          ctx.font = "900 90px Arial, sans-serif";
          ctx.fillText("HACKER HOUSE", 90, 170);

          // Divider Line
          ctx.strokeStyle = "rgba(254, 225, 1, 0.3)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(90, 210);
          ctx.lineTo(1110, 210);
          ctx.stroke();

          // Subheader text
          ctx.fillStyle = "#FEE101";
          ctx.font = "900 24px Arial, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText("GOA, INDIA · 28 – 31 OCT 2026", 1110, 250);
          ctx.font = "900 20px Arial, sans-serif";
          ctx.fillText("LESS NOISE. MORE SIGNAL", 1110, 280);
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

          if (goaLogo) ctx.drawImage(goaLogo, 840, 80, 270, 100);
          if (studioLogo) ctx.drawImage(studioLogo, 90, 220, 200, 65);

          // Photo Frame viewport: Square [90, 320, 1020, 1020]
          const px = 90,
            py = 320,
            pw = 1020,
            ph = 1020;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 48);
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
            ctx.font = "900 64px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("📸 BUILDER PASS", px + pw / 2, py + ph / 2 - 15);
            ctx.font = "700 30px Arial, sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(
              "Upload Photo in Panel",
              px + pw / 2,
              py + ph / 2 + 45,
            );
            ctx.textAlign = "left";
          }

          if (frameImg) {
            ctx.drawImage(frameImg, px, py, pw, ph);
          }
          ctx.restore();

          // Photo frame yellow border
          ctx.strokeStyle = "#FEE101";
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 48);
          ctx.stroke();

          // Bottom Details
          // Name
          ctx.fillStyle = "#FEE101";
          ctx.font = "900 76px Arial, sans-serif";
          ctx.fillText(displayName, 90, 1475);

          // Stack / Role
          ctx.font = "700 40px Arial, sans-serif";
          ctx.fillText(displayStack, 90, 1545);

          // ID Badge
          ctx.save();
          ctx.fillStyle = "#FEE101";
          ctx.beginPath();
          ctx.roundRect(90, 1585, 340, 78, 20);
          ctx.fill();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = "#000000";
          ctx.font = "900 32px Arial, sans-serif";
          ctx.fillText(`NO : ${displayPassNo}`, 130, 1638);
          ctx.restore();

          const generatedDataUrl = canvas.toDataURL("image/png");
          setCardTextureUrl(generatedDataUrl);
          if (onCardTextureGenerated) {
            onCardTextureGenerated(generatedDataUrl);
          }
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
    onCardTextureGenerated,
  ]);

  useEffect(() => {
    updateCardTexture();
  }, [updateCardTexture]);

  return (
    <div className="bg-[#FFFBE8] p-5 flex flex-col gap-5 font-body rounded-lg shadow-[7px_7px_0px_0px_#084e2a]">
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/15">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`custom-btn text-xs py-1.5 px-4 ${
              viewMode === "3d"
                ? "custom-btn-pink"
                : "custom-btn-outline-pink"
            }`}
          >
           3D ID card 
          </button>
          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`custom-btn text-xs py-1.5 px-4 ${
              viewMode === "2d"
                ? "custom-btn-pink"
                : "custom-btn-outline-pink"
            }`}
          >
            2D Id Card
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative w-full rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
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
