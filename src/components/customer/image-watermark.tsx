"use client";

import { cn } from "@/lib/utils";
import { brandFontVarMap } from "@/lib/brand-fonts";
import type { EffectiveImageWatermark } from "@/services/platform/media-policy";

type ImageWatermarkProps = {
  watermark?: EffectiveImageWatermark | null;
  className?: string;
};

export function ImageWatermark({ watermark, className }: ImageWatermarkProps) {
  if (!watermark?.enabled || !watermark.text) {
    return null;
  }

  return (
    <span
      className={cn(
        "pointer-events-none absolute z-20 rounded-sm border font-nav font-semibold uppercase tracking-[0.18em] backdrop-blur-sm",
        watermark.size === "large" ? "px-2 py-1 text-xs" : watermark.size === "medium" ? "px-1.5 py-0.5 text-[10px]" : "px-1.5 py-0.5 text-[8px]",
        watermark.position === "bottom-left" && "bottom-2 left-2",
        watermark.position === "bottom-center" && "bottom-2 left-1/2 -translate-x-1/2",
        watermark.position === "bottom-right" && "bottom-2 right-2",
        watermark.position === "center" && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
      style={{
        backgroundColor: colorWithOpacity(watermark.backgroundColor, watermark.backgroundOpacity),
        borderColor: colorWithOpacity(watermark.borderColor, watermark.borderOpacity),
        color: watermark.textColor,
        opacity: watermark.opacity,
        fontFamily: brandFontVarMap[watermark.font ?? "inter"]
      }}
    >
      {watermark.text}
    </span>
  );
}

function colorWithOpacity(color: string, opacity: number) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

  if (!match) {
    return color;
  }

  const [, red, green, blue] = match;
  return `rgba(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(blue, 16)}, ${opacity})`;
}
