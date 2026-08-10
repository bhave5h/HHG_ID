"use client";

import React, { useState, useEffect } from "react";
import HeaderBar from "./HeaderBar";
import TaskHeading from "./TaskHeading";
import UploadSection from "./UploadSection";
import PreviewSection from "./PreviewSection";
import PromotionalLinks from "@/components/ui/PromotionalLinks";

export default function BuilderGenerator() {
  // Photo & Transformation State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [renderedCardDataUrl, setRenderedCardDataUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  // Form Details State
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [passNo, setPassNo] = useState<string>("57236");
  const [selectedFrame, setSelectedFrame] = useState<string>("frame1.png");

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
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleGenerate = async () => {
    if (!photoFile) {
      setErrorMsg("Please upload your photo to your ID card first!");
      return;
    }

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      formData.append("name", name);
      formData.append("stack", stack);
      formData.append("passNo", passNo);
      formData.append("selectedFrame", selectedFrame);
      formData.append("zoom", zoom.toString());
      formData.append("offsetX", offsetX.toString());
      formData.append("offsetY", offsetY.toString());
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
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setName("");
    setStack("");
    setSelectedFrame("frame1.png");
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
          {/* LEFT COLUMN: Uploading & Controls Section Component */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <UploadSection
              onPhotoSelected={handlePhotoSelected}
              selectedPreviewUrl={photoPreviewUrl}
              onClearPhoto={handleClearPhoto}
              selectedFrame={selectedFrame}
              setSelectedFrame={setSelectedFrame}
              name={name}
              setName={setName}
              stack={stack}
              setStack={setStack}
              passNo={passNo}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasPhoto={!!photoFile}
              zoom={zoom}
              setZoom={setZoom}
              offsetX={offsetX}
              setOffsetX={setOffsetX}
              offsetY={offsetY}
              setOffsetY={setOffsetY}
            />
          </div>

          {/* RIGHT COLUMN: Preview Section Component */}
          <div className="md:col-span-6 flex flex-col items-center w-full">
            <PreviewSection
              photoPreviewUrl={photoPreviewUrl}
              name={name}
              stack={stack}
              passNo={passNo}
              selectedFrame={selectedFrame}
              zoom={zoom}
              offsetX={offsetX}
              offsetY={offsetY}
              onCardTextureGenerated={setRenderedCardDataUrl}
              generatedResult={generatedResult}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
      <PromotionalLinks />
    </div>
  );
}
