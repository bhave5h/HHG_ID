import React from "react";
import { cn } from "@/lib/utils";

interface Neo3DButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "yellow" | "pink" | "black" | "outline-pink";
  className?: string;
  asAnchor?: boolean;
  href?: string;
  download?: string;
  target?: string;
  rel?: string;
}

export default function Neo3DButton({
  children,
  variant = "yellow",
  className,
  asAnchor = false,
  href,
  download,
  target,
  rel,
  disabled,
  onClick,
  type = "button",
  ...props
}: Neo3DButtonProps) {
  const variantClass =
    variant === "pink"
      ? "custom-btn-pink"
      : variant === "black"
      ? "custom-btn-black"
      : variant === "outline-pink"
      ? "custom-btn-outline-pink"
      : "custom-btn-yellow";

  if (asAnchor && href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={rel}
        onClick={onClick as any}
        className={cn(
          "custom-btn no-underline flex items-center justify-center text-center w-full cursor-pointer select-none",
          variantClass,
          className
        )}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "custom-btn",
        variantClass,
        "w-full",
        disabled && "opacity-60 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
