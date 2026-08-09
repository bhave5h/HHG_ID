"use client";

import React from "react";

interface BuilderFormProps {
  name: string;
  setName: (val: string) => void;
  stack: string;
  setStack: (val: string) => void;
  builderTitle: string;
  setBuilderTitle: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasPhoto: boolean;
}

export default function BuilderForm({
  name,
  setName,
  stack,
  setStack,
  builderTitle,
  setBuilderTitle,
  onGenerate,
  isGenerating,
  hasPhoto,
}: BuilderFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPhoto) {
      alert("Please upload your photo first!");
      return;
    }
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
          1. YOUR NAME <span className="text-[#FF0080]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bhavesh Chawre"
          maxLength={30}
          required
          className="neo-input text-sm sm:text-base"
        />
      </div>

      {/* Stack / Role Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
          2. STACK / ROLE <span className="text-[#FF0080]">*</span>
        </label>
        <input
          type="text"
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          placeholder="e.g. AI × DESIGN × DEVELOPMENT"
          maxLength={40}
          required
          className="neo-input text-sm sm:text-base"
        />
      </div>

      {/* Builder Title Input */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
          3. BUILDER CLASS / TITLE <span className="text-[#FF0080]">*</span>
        </label>
        <input
          type="text"
          value={builderTitle}
          onChange={(e) => setBuilderTitle(e.target.value)}
          placeholder="e.g. THE PIXEL ARCHITECT"
          maxLength={35}
          required
          className="neo-input text-sm sm:text-base"
        />
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isGenerating || !hasPhoto}
        className={`mt-2 w-full py-4 text-base sm:text-lg neo-btn font-black tracking-wider transition-all ${
          !hasPhoto ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            GENERATING BUILDER PASS...
          </span>
        ) : (
          "🚀 GENERATE BUILDER ID CARD"
        )}
      </button>
    </form>
  );
}
