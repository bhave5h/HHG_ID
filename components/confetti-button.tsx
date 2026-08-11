"use client";

import React from "react";
import confetti from "canvas-confetti";

export const shootConfetti = (origin?: { x: number; y: number }) => {
  const count = 200;
  const defaults = {
    origin: origin || { x: 0.5, y: 0.5 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

export const shootFireworks = () => {
  const duration = 1.5 * 1000;
  const end = Date.now() + duration;

  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1", "#FEE101", "#FF0080"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

export const confettiEffects = {
  default: shootConfetti,
  fireworks: shootFireworks,
};

export interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "fireworks";
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ConfettiButton({
  children,
  variant = "default",
  className = "",
  onClick,
  ...props
}: ConfettiButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    const origin = { x, y };

    const effect = confettiEffects[variant] || confettiEffects.default;
    effect(origin);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={className} {...props}>
      {children}
    </button>
  );
}
