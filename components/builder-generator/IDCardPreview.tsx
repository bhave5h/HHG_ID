import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { IDCardData, normalizeIDCardData } from "@/types/idCard";
import { drawQRToCanvas } from "@/lib/qr";
import { applyPhotoFilterCanvas } from "@/lib/image/photoFilters";
import PreviewControls from "./PreviewControls";

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
  setZoom?: (z: number) => void;
  setOffsetX?: (x: number) => void;
  setOffsetY?: (y: number) => void;
  generatedResult?: {
    id: string;
    cardUrl: string;
    shareUrl: string;
    xShareUrl: string;
    name: string;
  } | null;
  onReset?: () => void;
}

export default function IDCardPreview(props: IDCardPreviewProps) {
  const {
    cardUrl = null,
    onCardTextureGenerated,
    setZoom,
    setOffsetX,
    setOffsetY,
    generatedResult = null,
    onReset = () => {},
  } = props;

  const normalized = normalizeIDCardData(props);
  const {
    displayName,
    displayStack,
    displayPassNo,
    photoPreviewUrl,
    selectedFrame,
    zoom,
    offsetX,
    offsetY,
    qrUrl,
    photoFilter,
  } = normalized;

  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [cardTextureUrl, setCardTextureUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    initX: number;
    initY: number;
  } | null>(null);

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

  // Generate crisp 1200 x 1800 HD Canvas texture for 3D Lanyard and 2D Card
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

      // 3. Header Section Subheader Right Text
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.font = `900 55px ${CARD_THEME.fontHeader}`;
      ctx.textAlign = "right";
      ctx.fillText("GOA, INDIA · 28 – 31 OCT 2026", 1060, 380);
      ctx.font = `900 55px ${CARD_THEME.fontHeader}`;
      ctx.fillText("LESS NOISE. MORE SIGNAL", 1060, 445);
      ctx.textAlign = "left";

      // Async Assets Preloading
      const framePath =
        selectedFrame && selectedFrame !== "none"
          ? `/assets/${selectedFrame}`
          : null;

      const [mainLogo, goaLogo, studioLogo, frameImg, userPhotoImg] =
        await Promise.all([
          loadImage("/assets/logo.png"),
          loadImage("/assets/goa.svg"),
          loadImage("/assets/2-47.svg"),
          framePath ? loadImage(framePath) : Promise.resolve(null),
          photoPreviewUrl ? loadImage(photoPreviewUrl) : Promise.resolve(null),
        ]);

      if (mainLogo) {
        ctx.drawImage(mainLogo, 110, 195, 570, 120);
      }
      if (goaLogo) ctx.drawImage(goaLogo, 800, 120, 270, 200);
      if (studioLogo) ctx.drawImage(studioLogo, 110, 340, 250, 120);

      // 4. Photo Viewport Container (Square 1:1 [110, 500, 980, 980])
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

        // Apply Photo Appearance / Filter Effect
        if (photoFilter && photoFilter !== "none") {
          applyPhotoFilterCanvas(ctx, px, py, pw, ph, photoFilter);
        }
      } else {
        ctx.fillStyle = CARD_THEME.yellow;
        ctx.font = `900 110px ${CARD_THEME.fontHeader}`;
        ctx.textAlign = "center";
        ctx.fillText("Upload Your Photo", px + pw / 2, py + ph / 2 - 40);
        ctx.font = "900 110px ";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("in Panel", px + pw / 2, py + ph / 2 + 60);
        ctx.textAlign = "center";
      }

      if (frameImg && selectedFrame !== "none") {
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
      ctx.font = `900 90px ${CARD_THEME.fontHeader}`;
      ctx.fillText(displayName, 100, 1572);

      // Role / Title (Yellow/Light-Green Font)
      ctx.fillStyle = CARD_THEME.roleGreen;
      ctx.font = `700 50px ${CARD_THEME.fontMono}`;
      ctx.fillText(displayStack, 100, 1635);

      // ID Badge (Yellow Pill Box with Green Text)
      ctx.save();
      ctx.fillStyle = CARD_THEME.yellow;
      ctx.beginPath();
      ctx.roundRect(100, 1660, 300, 72, 18);
      ctx.fill();

      ctx.fillStyle = CARD_THEME.badgeGreenText;
      ctx.font = `900 40px ${CARD_THEME.fontMono}`;
      ctx.fillText(`NO: ${displayPassNo}`, 110, 1710);
      ctx.restore();

      // Dynamic QR Code Rendering (Bottom Right)
      const qx = 890,
        qy = 1530,
        qw = 200;

      drawQRToCanvas(
        ctx,
        qrUrl || "https://x.com/BH4VE5H/",
        qx,
        qy,
        qw,
        CARD_THEME.yellow,
        CARD_THEME.bgGreen,
      );

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
    photoFilter,
    qrUrl,
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

  // Interactive Zoom & Drag Event Handlers for 2D Viewport
  const handleWheel = (e: React.WheelEvent) => {
    if (!setZoom) return;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const nextZoom = Math.max(
      1.0,
      Math.min(3.0, Number((zoom + delta).toFixed(2))),
    );
    setZoom(nextZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initX: offsetX,
      initY: offsetY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || !setOffsetX || !setOffsetY)
      return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setOffsetX(dragStartRef.current.initX + dx * 2);
    setOffsetY(dragStartRef.current.initY + dy * 2);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
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
    if (
      !isDragging ||
      !dragStartRef.current ||
      !setOffsetX ||
      !setOffsetY ||
      e.touches.length !== 1
    )
      return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setOffsetX(dragStartRef.current.initX + dx * 2);
    setOffsetY(dragStartRef.current.initY + dy * 2);
  };

  // ---------------------------------------------------------------
  // 2D ID Card Preview (Matches exact 100% visual layout of the 3D card)
  // ---------------------------------------------------------------
  const render2DCard = () => (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className={`bg-white w-full h-[520px] sm:h-[520px] mx-auto aspect-auto sm:aspect-[2/3] relative select-none p-10 pb-15 border border-black/20 rounded-3xl 
        ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {cardTextureUrl ? (
        <img
          src={cardTextureUrl}
          alt="2D Builder ID Card"
          className="w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <div className="w-full h-full bg-[#1b6838] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-[#FEE101] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#FFFBE8] p-4 flex flex-col gap-4 font-body rounded-lg shadow-[7px_7px_0px_0px_#084e2a] h-[750px] sm:h-[723px]">
      {/* 1. Main Card Preview Container */}

      <div className="relative w-full overflow-hidden">
        {viewMode === "3d" ? (
          <div className="bg-white relative w-full h-[520px] sm:h-[520px] flex items-center justify-center border border-black/20 rounded-3xl">
            <Lanyard
              position={[0, 0, 13]}
              fov={20}
              gravity={[0, -40, 0]}
              frontImage={cardTextureUrl}
              backImage={CARD_THEME.backPngPath}
              imageFit="cover"
              lanyardWidth={1}
            />
          </div>
        ) : (
          <div className="flex justify-center">{render2DCard()}</div>
        )}
      </div>

      {/* 2. Unified Preview Controls (3D/2D Toggle + Result Actions) */}
      <PreviewControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        generatedResult={generatedResult}
        onReset={onReset}
      />
    </div>
  );
}
