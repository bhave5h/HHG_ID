import React from "react";

export default function TaskHeading() {
  return (
    <div className="flex flex-col gap-1 font-body">
      <h2 className="font-['Imbue']  font-heading text-3xl sm:text-5xl uppercase tracking-lose text-white">
        Hacker House Goa ID Card Generator
      </h2>
      <p className="font-body text-xs sm:text-sm text-[#FEE101] max-w-4xl mt-1">
        Design your own HH Goa 2026 themed photo frame generator. Upload your photo in the control panel below, choose your frame style, and generate your shareable credential.
      </p>
    </div>
  );
}
