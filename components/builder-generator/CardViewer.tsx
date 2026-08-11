"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import CardActionControls from "./CardActionControls";

// Dynamically import Lanyard with SSR disabled for R3F Canvas compatibility
const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] sm:min-h-[480px] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/20 border-t-[#FF0080] rounded-full animate-spin" />
    </div>
  ),
});

interface CardViewerProps {
  cardImageUrl: string;
  cardName: string;
  xShareUrl: string;
}

export default function CardViewer({
  cardImageUrl,
  cardName,
  xShareUrl,
}: CardViewerProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  return (
    <div className="w-full max-w-lg flex flex-col items-center font-body">
      {/* Main Preview Container (Shifted up ~15% with -translate-y-6 / -mt-4) */}
      <div className="w-full h-[416px] sm:h-[480px] relative flex items-center justify-center overflow-hidden z-0 -translate-y-5 sm:-translate-y-6 -mb-4">
        <AnimatePresence mode="wait">
          {viewMode === "3d" ? (
            <motion.div
              key="3d-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Lanyard
                position={[0, 0.8, 13]}
                fov={23}
                gravity={[0, -40, 0]}
                frontImage={cardImageUrl}
                backImage="/assets/lanyard/ID_back.png"
                imageFit="cover"
                lanyardWidth={1}
              />
            </motion.div>
          ) : (
            <motion.div
              key="2d-card-fall"
              initial={{ y: -220, opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 150, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 15,
                mass: 0.8,
              }}
              className="w-full h-full p-2 flex items-center justify-center"
            >
              <img
                src={cardImageUrl}
                alt={`${cardName}'s Builder ID Card`}
                className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-2xl border-3 border-black"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grouped Action Controls (3D, 2D, Download, Share on X) */}
      <CardActionControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        cardImageUrl={cardImageUrl}
        cardName={cardName}
        xShareUrl={xShareUrl}
      />
    </div>
  );
}
