"use client";

import React, { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar";
import TaskHeading from "./TaskHeading";
import UploadSection from "./UploadSection";
import PreviewSection from "./PreviewSection";
import Footer from "@/components/ui/Footer";
import { shootConfetti, shootFireworks } from "@/components/confetti-button";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    setErrorMsg(null);
  };

  const handleClearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setRenderedCardDataUrl(null);
    setDraftZoom(1);
    setDraftOffsetX(0);
    setDraftOffsetY(0);
  };

  const handleGenerate = async () => {
    if (!photoFile) {
      setErrorMsg("Please upload your photo to your ID card first!");
      return;
    }

    if (!draftName.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    // Commit draft values to 3D Preview Card & QR Code
    setCommittedName(draftName);
    setCommittedStack(draftStack);
    setCommittedQrUrl(draftQrUrl);
    setCommittedZoom(draftZoom);
    setCommittedOffsetX(draftOffsetX);
    setCommittedOffsetY(draftOffsetY);

    // Trigger fireworks celebration effect when clicked generate
    shootFireworks();

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("name", draftName);
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

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Failed to generate ID card. Please try again.",
        );
      }

      setGeneratedResult({
        id: data.id,
        cardUrl: data.cardUrl,
        shareUrl: data.shareUrl,
        xShareUrl: data.xShareUrl,
        name: data.name,
      });
    } catch (err: any) {
      console.error("Card generation failed:", err);
      setErrorMsg(
        err.message ||
          "Something went wrong while creating your Builder Card. Please try again.",
      );
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
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center font-body">
      <HeaderBar />
      <div className="w-full flex flex-col gap-6">
        <TaskHeading />

        {errorMsg && (
          <div className="p-4 neo-card-pink text-center font-bold text-xs sm:text-sm">
            ⚠️ {errorMsg}
          </div>
        )}

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
              name={committedName}
              stack={committedStack}
              qrUrl={committedQrUrl}
              photoFilter={photoFilter}
              passNo={passNo}
              selectedFrame={selectedFrame}
              zoom={committedZoom}
              setZoom={setDraftZoom}
              offsetX={committedOffsetX}
              setOffsetX={setDraftOffsetX}
              offsetY={committedOffsetY}
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


