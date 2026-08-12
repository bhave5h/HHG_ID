"use client";

import React, { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar";
import TaskHeading from "./TaskHeading";
import UploadSection from "./UploadSection";
import PreviewSection from "./PreviewSection";
import Footer from "@/components/ui/Footer";
import { shootConfetti, shootFireworks } from "@/components/confetti-button";
import { compressImageTo500 } from "@/lib/image/compress";
import { getXShareUrl } from "@/lib/share/x";

export default function BuilderGenerator() {
  // Photo & Transformation Draft State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [renderedCardDataUrl, setRenderedCardDataUrl] = useState<string | null>(
    null,
  );
  const [draftZoom, setDraftZoom] = useState<number>(1.0);
  const [draftOffsetX, setDraftOffsetX] = useState<number>(0);
  const [draftOffsetY, setDraftOffsetY] = useState<number>(0);

  // Form Details Draft State (Changes remain as draft until "Generate Builder ID Card" is clicked)
  const [draftName, setDraftName] = useState("");
  const [draftStack, setDraftStack] = useState("");
  const [draftQrUrl, setDraftQrUrl] = useState("");

  // COMMITTED STATES (Used for 3D Lanyard Card & dynamic QR code)
  const [committedName, setCommittedName] = useState("");
  const [committedStack, setCommittedStack] = useState("");
  const [committedQrUrl, setCommittedQrUrl] = useState("");
  const [committedZoom, setCommittedZoom] = useState<number>(1.0);
  const [committedOffsetX, setCommittedOffsetX] = useState<number>(0);
  const [committedOffsetY, setCommittedOffsetY] = useState<number>(0);

  // IMMEDIATE STATES (Update 3D Card preview immediately when changed)
  const [passNo, setPassNo] = useState<string>("57236");
  const [selectedFrame, setSelectedFrame] = useState<string>("frame1.png");
  const [photoFilter, setPhotoFilter] = useState<string>("none");

  // Auto-generate unique random pass number on mount
  useEffect(() => {
    setPassNo(Math.floor(10000 + Math.random() * 90000).toString());
  }, []);

  // Status State
  const [isGenerating, setIsGenerating] = useState(false);

  const [generatedResult, setGeneratedResult] = useState<{
    id: string;
    cardUrl: string;
    shareUrl: string;
    xShareUrl: string;
    name: string;
  } | null>(null);

  const handlePhotoSelected = (file: File, previewUrl: string) => {
    setPhotoFile(file);
    setPhotoPreviewUrl(previewUrl);
  };

  const handleClearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setRenderedCardDataUrl(null);
    setDraftZoom(1);
    setDraftOffsetX(0);
    setDraftOffsetY(0);
  };

  const createFallbackCard = (siteUrl: string, nameToUse: string) => {
    const cardId = Math.random().toString(36).substring(2, 10);
    const cardUrl = renderedCardDataUrl || photoPreviewUrl || "";
    const shareUrl = `${siteUrl}/card/${cardId}`;
    const xShareUrl = getXShareUrl(cardId, siteUrl, nameToUse);

    setGeneratedResult({
      id: cardId,
      cardUrl,
      shareUrl,
      xShareUrl,
      name: nameToUse,
    });

    // Play fireworks celebration ONLY when card is successfully generated
    shootFireworks();
  };

  const handleGenerate = async () => {
    if (!photoFile) {
      console.error("No photo provided for ID card generation.");
      return;
    }

    const nameToUse = draftName.trim() || "HH GOA BUILDER";

    setIsGenerating(true);

    // Commit draft values to 3D Preview Card & QR Code
    setCommittedName(draftName);
    setCommittedStack(draftStack);
    setCommittedQrUrl(draftQrUrl);
    setCommittedZoom(draftZoom);
    setCommittedOffsetX(draftOffsetX);
    setCommittedOffsetY(draftOffsetY);

    const siteUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

    try {
      // Compress large photos to small 500x500 in background before sending
      const compressedPhoto = await compressImageTo500(photoFile);

      const formData = new FormData();
      formData.append("photo", compressedPhoto);
      formData.append("name", nameToUse);
      formData.append("stack", draftStack);
      formData.append("qrUrl", draftQrUrl);
      formData.append("passNo", passNo);
      formData.append("selectedFrame", selectedFrame);
      formData.append("photoFilter", photoFilter);
      formData.append("zoom", draftZoom.toString());
      formData.append("offsetX", draftOffsetX.toString());
      formData.append("offsetY", draftOffsetY.toString());
      if (renderedCardDataUrl) {
        formData.append("cardImageDataUrl", renderedCardDataUrl);
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      // Parse response safely as text first to handle non-JSON HTML error responses (e.g. 413 Payload Too Large)
      const responseText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Server API returned non-JSON response:", responseText);
      }

      if (res.ok && data && data.success) {
        setGeneratedResult({
          id: data.id,
          cardUrl: data.cardUrl,
          shareUrl: data.shareUrl,
          xShareUrl: data.xShareUrl,
          name: data.name,
        });

        // Trigger fireworks celebration ON SUCCESSFUL CARD GENERATION
        shootFireworks();
      } else {
        const errorMsg = data?.error || responseText || "Server card creation failed";
        console.error("Card generation API error (falling back to client card):", errorMsg);
        createFallbackCard(siteUrl, nameToUse);
      }
    } catch (err: any) {
      console.error("Card generation exception (falling back to client card):", err);
      createFallbackCard(siteUrl, nameToUse);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setRenderedCardDataUrl(null);
    setDraftZoom(1);
    setDraftOffsetX(0);
    setDraftOffsetY(0);
    setDraftName("");
    setDraftStack("");
    setDraftQrUrl("https://x.com/BH4VE5H/");
    setCommittedName("");
    setCommittedStack("");
    setCommittedQrUrl("https://x.com/BH4VE5H/");
    setCommittedZoom(1);
    setCommittedOffsetX(0);
    setCommittedOffsetY(0);
    setSelectedFrame("frame1.png");
    setPhotoFilter("none");
    setPassNo(Math.floor(10000 + Math.random() * 90000).toString());
    setGeneratedResult(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between items-center font-body">
      <HeaderBar />
      <div className="w-full flex flex-col gap-6">
        <TaskHeading />

        {/* Two Column System: Left = Uploading & Controls Section; Right = Live Preview Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Uploading & Controls Section Component (Draft Inputs & Immediate Frame/Filter) */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <UploadSection
              onPhotoSelected={handlePhotoSelected}
              selectedPreviewUrl={photoPreviewUrl}
              onClearPhoto={handleClearPhoto}
              selectedFrame={selectedFrame}
              setSelectedFrame={setSelectedFrame}
              photoFilter={photoFilter}
              setPhotoFilter={setPhotoFilter}
              name={draftName}
              setName={setDraftName}
              stack={draftStack}
              setStack={setDraftStack}
              qrUrl={draftQrUrl}
              setQrUrl={setDraftQrUrl}
              passNo={passNo}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasPhoto={!!photoFile}
              zoom={draftZoom}
              setZoom={setDraftZoom}
              offsetX={draftOffsetX}
              setOffsetX={setDraftOffsetX}
              offsetY={draftOffsetY}
              setOffsetY={setDraftOffsetY}
            />
          </div>

          {/* RIGHT COLUMN: Preview Section Component (Displays Committed Text & Zoom/Pan, Immediate Frame & Filter) */}
          <div className="md:col-span-6 flex flex-col items-center w-full ">
            <PreviewSection
              photoPreviewUrl={photoPreviewUrl}
              name={draftName || committedName}
              stack={draftStack || committedStack}
              qrUrl={draftQrUrl || committedQrUrl}
              photoFilter={photoFilter}
              passNo={passNo}
              selectedFrame={selectedFrame}
              zoom={draftZoom}
              setZoom={setDraftZoom}
              offsetX={draftOffsetX}
              setOffsetX={setDraftOffsetX}
              offsetY={draftOffsetY}
              setOffsetY={setDraftOffsetY}
              onCardTextureGenerated={setRenderedCardDataUrl}
              generatedResult={generatedResult}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


