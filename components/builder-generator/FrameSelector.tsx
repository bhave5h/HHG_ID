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
    { id: "frame1.png", label: "Frame 1" },
    { id: "frame2.png", label: "Frame 2" },
    { id: "frame3.png", label: "Frame 3" },
    { id: "frame4.png", label: "Frame 4" },
  ];

  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body">
        CHOOSE FRAME STYLE:
      </label>
      <div className="grid grid-cols-4 gap-2">
        {frames.map((frame) => {
          const isSelected = selectedFrame === frame.id;
          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => setSelectedFrame(frame.id)}
              className={`py-2 px-1 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer text-center rounded font-body ${
                isSelected
                  ? "bg-[#FEE101] text-black shadow-[3px_3px_0px_0px_#000] scale-[1.02]"
                  : "bg-white text-zinc-700 hover:bg-[#FFFBE8] shadow-[2px_2px_0px_0px_#000]"
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
