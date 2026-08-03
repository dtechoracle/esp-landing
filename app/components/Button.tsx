"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const sizes = {
  sm: { padding: "8px 16px", fontSize: 14, height: 36 },
  md: { padding: "12px 24px", fontSize: 18, height: 46 },
  lg: { padding: "16px 24px", fontSize: 18, height: 54 },
} as const;

const variants = {
  primary: { background: "var(--accent)", color: "var(--text-inverse)" },
  dark: { background: "var(--ink-900)", color: "var(--text-inverse)" },
  secondary: { background: "rgba(39,34,53,0.05)", color: "var(--ink-900)" },
  ghost: { background: "transparent", color: "var(--ink-900)" },
} as const;

type Size = keyof typeof sizes;
type Variant = keyof typeof variants;

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  style?: CSSProperties;
  className?: string;
  "aria-label"?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  onClick,
  type = "button",
  style,
  className,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        border: "none",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        letterSpacing: "-0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "filter 150ms ease, box-shadow 150ms ease, transform 100ms ease",
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        boxShadow:
          hover && !disabled && variant === "primary"
            ? "var(--shadow-btn-hover)"
            : "none",
        filter:
          hover && !disabled && variant !== "ghost" ? "brightness(0.94)" : "none",
        ...v,
        ...s,
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}