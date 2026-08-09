"use client";

import React, { useState } from "react";
import UploadZone from "./UploadZone";
import BuilderForm from "./BuilderForm";
import CardPreview from "./CardPreview";
import ResultActions from "./ResultActions";
import PromotionalLinks from "@/components/ui/PromotionalLinks";

export default function BuilderGenerator() {
  // State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [builderTitle, setBuilderTitle] = useState("");

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
  };

  const handleGenerate = async () => {
    if (!photoFile) {
      setErrorMsg("Please upload your photo before generating.");
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
      formData.append("builderTitle", builderTitle);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Failed to generate ID card. Please try again."
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
          "Something went wrong while creating your Builder Card. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setName("");
    setStack("");
    setBuilderTitle("");
    setGeneratedResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Hero Branding Section */}
      <header className="w-full text-center mb-8">
        {/* Top Header Badge */}
        <div className="inline-block bg-[#FEE101] text-black font-black uppercase text-xs sm:text-sm px-4 py-1.5 border-3 border-black shadow-[4px_4px_0px_0px_#000] mb-4">
          HH GOA 2026 · HACKATHON BUILDER CREDENTIAL
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[4px_4px_0px_#000]">
          CLAIM YOUR <span className="text-[#FEE101]">BUILDER PASS</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-3 text-sm sm:text-lg font-bold text-white/90 max-w-xl mx-auto drop-shadow-[1px_1px_0px_#000]">
          Upload your photo, tell us what you build, instantly get your official HH Goa 2026 Builder Card and share it on X.
        </p>
      </header>

      {/* Main Generator Box (Desktop: Two Columns; Mobile: Collapsed Single Column) */}
      <div className="w-full neo-card p-4 sm:p-6 md:p-8 bg-[#FFFBE8] shadow-[8px_8px_0px_0px_#000]">
        {errorMsg && (
          <div className="mb-6 p-4 neo-card-pink text-center font-bold text-sm sm:text-base">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Controls (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {!generatedResult ? (
              <>
                {/* Upload Section */}
                <div className="bg-white p-4 sm:p-5 neo-card">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-black">
                    STEP 1: UPLOADER
                  </h3>
                  <UploadZone
                    onPhotoSelected={handlePhotoSelected}
                    selectedPreviewUrl={photoPreviewUrl}
                    onClearPhoto={handleClearPhoto}
                  />
                </div>

                {/* Details Form */}
                <div className="bg-white p-4 sm:p-5 neo-card">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-3 text-black">
                    STEP 2: BUILDER DETAILS
                  </h3>
                  <BuilderForm
                    name={name}
                    setName={setName}
                    stack={stack}
                    setStack={setStack}
                    builderTitle={builderTitle}
                    setBuilderTitle={setBuilderTitle}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    hasPhoto={!!photoFile}
                  />
                </div>
              </>
            ) : (
              <ResultActions
                cardUrl={generatedResult.cardUrl}
                shareUrl={generatedResult.shareUrl}
                xShareUrl={generatedResult.xShareUrl}
                name={generatedResult.name}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Right Column: Live Interactive Card Preview (5 Cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase text-black">
                LIVE CARD PREVIEW
              </span>
              <span className="neo-badge-yellow">1200 × 1500 HD</span>
            </div>

            <CardPreview
              photoPreviewUrl={photoPreviewUrl}
              name={name}
              stack={stack}
              builderTitle={builderTitle}
              generatedImageUrl={generatedResult ? generatedResult.cardUrl : null}
            />
          </div>
        </div>
      </div>

      {/* Promotional Links Footer */}
      <PromotionalLinks />
    </div>
  );
}
