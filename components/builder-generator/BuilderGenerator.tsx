"use client";

import React, { useState, useEffect, useRef } from "react";
import BuilderForm from "./BuilderForm";
import UploadZone from "./UploadZone";
import CardPreview from "./CardPreview";
import ResultActions from "./ResultActions";
import PromotionalLinks from "@/components/ui/PromotionalLinks";

export default function BuilderGenerator() {
  // Photo & Transformation State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
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
      {/* 1. Header Layout: Left Date, Center logo.svg, Right Tagline */}
      <header className="w-full flex flex-col items-center mb-6">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          {/* Left Text */}
          <div className="font-['Imbue'] font-heading font-black text-xl sm:text-2xl text-[#FEE101] tracking-wider uppercase text-center sm:text-left">
            OCT 28–31 · 2026 · GOA
          </div>

          {/* Center logo.svg */}
          <div className="w-48 sm:w-64 h-16 sm:h-20 flex items-center justify-center">
            <img
              src="/assets/logo.svg"
              alt="Hacker House Goa Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Right Text */}
          <div className="font-['Imbue'] font-heading font-black text-xl sm:text-2xl text-white tracking-wider uppercase text-center sm:text-right">
            LESS NOISE. MORE SIGNAL
          </div>
        </div>

        {/* Divider Line Below Header */}
        <hr className="w-full border-t-2 border-white/30 mt-2 mb-4" />
      </header>

      {/* 2. Main Radar-Style Container Card */}
      <div className="w-full hhg-container-radar flex flex-col gap-6">
        {/* Task Header Badge */}
        <div className="flex flex-col gap-1">
          <span className="font-['Imbue'] font-heading font-black text-sm uppercase tracking-widest text-[#FF0080]">
            TASK #1
          </span>
          <h2 className="font-['Imbue'] font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0B6839]">
            HH Goa Frame / ID Card Generator
          </h2>
          <p className="font-body text-xs sm:text-sm text-zinc-700 max-w-2xl mt-1">
            Design your own HH Goa 2026 themed photo frame generator. Upload
            your photo in the control panel below, choose your frame style, and
            generate your shareable credential.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 neo-card-pink text-center font-bold text-xs sm:text-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Two Column Layout: Left = Details Box with Image Upload on top; Right = Live Card Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Details Box containing Frame Selector + Image Upload on top + Change/Remove buttons + Form */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="bg-white p-5 neo-card flex flex-col gap-5">
              <h3 className="font-['Imbue'] font-heading font-black text-xl uppercase tracking-wider text-[#0B6839] border-b-2 border-black pb-2">
                BUILDER DETAILS & PHOTO
              </h3>

              {/* 1. FRAME SELECTOR & IMAGE UPLOAD ON TOP INSIDE DETAILS BOX */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  FRAME & PHOTO UPLOAD <span className="text-[#FF0080]">*</span>
                </label>
                <UploadZone
                  onPhotoSelected={handlePhotoSelected}
                  selectedPreviewUrl={photoPreviewUrl}
                  onClearPhoto={handleClearPhoto}
                  selectedFrame={selectedFrame}
                  setSelectedFrame={setSelectedFrame}
                  zoom={zoom}
                  setZoom={setZoom}
                  offsetX={offsetX}
                  setOffsetX={setOffsetX}
                  offsetY={offsetY}
                  setOffsetY={setOffsetY}
                />
              </div>

              {/* 2. INPUT FIELDS, ZOOM & POSITION CONTROLS + GENERATE BUTTON */}
              <BuilderForm
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

            {/* Task Highlights Bullet List */}
            <div className="bg-[#FAF7E6] p-4 border border-[#0B6839]/20 rounded-xl space-y-2 text-xs font-bold text-zinc-800">
              <div className="flex items-start gap-2">
                <span className="text-[#FF0080]">✦</span>
                <span>Instantly recognizable HH Goa 2026 identity</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#FF0080]">✦</span>
                <span>1-click download + 1-click Share to X (#FrameInGoa)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#FF0080]">✦</span>
                <span>4 unique Goa frame overlays available</span>
              </div>
            </div>

            {/* Generated Actions */}
            {generatedResult && (
              <ResultActions
                cardUrl={generatedResult.cardUrl}
                shareUrl={generatedResult.shareUrl}
                xShareUrl={generatedResult.xShareUrl}
                name={generatedResult.name}
                onReset={handleReset}
              />
            )}
          </div>

          {/* RIGHT COLUMN: Live 2:3 ID Card Preview (Pure Visual Output) */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div className="w-full mb-2 flex items-center justify-between">
              <span className="font-['Imbue'] font-heading font-black text-sm uppercase text-[#0B6839]">
                LIVE ID CARD PREVIEW (2:3)
              </span>
              <span className="neo-badge-yellow">1200 × 1800 HD</span>
            </div>

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
        </div>
      </div>

      {/* Promotional Links Footer */}
      <PromotionalLinks />
    </div>
  );
}
