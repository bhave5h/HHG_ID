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
      ? "btn-3d-pink"
      : variant === "black"
      ? "btn-3d-black"
      : variant === "outline-pink"
      ? "btn-3d-outline-pink"
      : "";

  if (asAnchor && href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={rel}
        className={cn("btn-3d-wrapper no-underline", className)}
      >
        <button type="button" className={cn("btn-3d", variantClass)}>
          <span className="button_top">{children}</span>
        </button>
      </a>
    );
  }

  return (
    <div className={cn("btn-3d-wrapper", className)}>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "btn-3d",
          variantClass,
          disabled && "opacity-60 cursor-not-allowed pointer-events-none"
        )}
        {...props}
      >
        <span className="button_top">{children}</span>
      </button>
    </div>
  );
}
