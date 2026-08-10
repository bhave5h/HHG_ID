import React from "react";

interface FrameSelectorProps {
  selectedFrame: string;
  setSelectedFrame: (frame: string) => void;
}

export default function FrameSelector({
  selectedFrame,
  setSelectedFrame,
}: FrameSelectorProps) {
  const frames = [
    { id: "frame1.png", label: "1" },
    { id: "frame2.png", label: "2" },
    { id: "frame3.png", label: "3" },
    { id: "frame4.png", label: "4" },
  ];

  return (
    <div>
      <div className="grid grid-cols-4 gap-2.5">
        {frames.map((frame) => {
          const isSelected = selectedFrame === frame.id;
          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => setSelectedFrame(frame.id)}
              className={`custom-btn py-2 px-2 text-xs font-black uppercase text-center font-body ${
                isSelected
                  ? "custom-btn-pink scale-[1.03]"
                  : "custom-btn-outline-pink"
              }`}
            >
           {frame.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
