import React from "react";

export default function HeaderBar() {
  return (
    <header className="w-full flex flex-col items-center mb-4 font-body">
      {/* 1. DESKTOP VIEW (md and up) */}
      <div className="hidden md:flex w-full items-center justify-between gap-4 py-2">
        {/* Left Side: Both Logos Side by Side */}
        <div className="flex items-center gap-6">
          <div className="h-12 flex items-center gap-4">
            <img
              src="/assets/logo.png"
              alt="Hacker House Goa Logo"
              className="max-h-full w-auto object-contain"
            />
            <img
              src="/assets/goa.svg"
              alt="Goa Logo"
              className="h-15 w-auto object-contain"
            />
          </div>
          <div className="h-10 flex items-center border-l border-white/20 pl-6">
            <img
              src="/assets/2-47.svg"
              alt="2:47 PM Studio Logo"
              className="max-h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Right Side: Date and Tagline Text stacked vertically in Mono */}
        <div className="flex flex-col items-end text-right font-body text-xs sm:text-sm font-black tracking-wider text-white gap-0.5">
          <span className="text-[#FEE101] uppercase">
            OCT 28–31 · 2026 · GOA
          </span>
          <span className="uppercase">LESS NOISE. MORE SIGNAL</span>
        </div>
      </div>

      {/* 2. MOBILE VIEW (under md) */}
      <div className="flex md:hidden w-full items-center justify-between">
        {/* Left Side: Stacked Text */}

        {/* Right Side: logo.svg Only */}
        <div className="h-18 flex items-center">
          <img
            src="/assets/logo.svg"
            alt="Hacker House Goa Logo"
            className="max-h-full w-auto object-contain"
          />
        </div>

        <div className="flex flex-col items-end text-right font-body text-[10px] sm:text-xs font-black tracking-wider text-white gap-1.5">
          <img
            src="/assets/2-47.svg"
            alt="Hacker House Goa Logo"
            className="max-h-full w-15 p-1 object-contain"
          />
          <span className="text-[#FEE101] uppercase">
            OCT 28–31 · 2026 · GOA
          </span>
          <span className="uppercase">LESS NOISE. MORE SIGNAL</span>
        </div>
      </div>

      {/* Divider Line Below Header */}
      <hr className="w-full border-t-2 border-white/30 mt-2" />
    </header>
  );
}
