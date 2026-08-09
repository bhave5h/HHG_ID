import React from "react";

export default function TaskHeading() {
  return (
    <div className="flex flex-col gap-1 font-body">
      <span className="font-['Imbue'] font-heading font-black text-sm uppercase tracking-widest text-[#FF0080]">
        TASK #1
      </span>
      <h2 className="font-['Imbue'] font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0B6839]">
        HH Goa Frame / ID Card Generator
      </h2>
      <p className="font-body text-xs sm:text-sm text-zinc-700 max-w-2xl mt-1">
        Design your own HH Goa 2026 themed photo frame generator. Upload your photo in the control panel below, choose your frame style, and generate your shareable credential.
      </p>
    </div>
  );
}
