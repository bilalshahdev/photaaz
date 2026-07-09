import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a hex color like #0f766e to an HSL string like "174 62% 28%" (no `hsl()` wrapper). Optionally override lightness. */
export function hexToHsl(hex: string, lightnessOverride?: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  const finalL = lightnessOverride ?? l;
  if (max === min) return `0 0% ${Math.round(finalL * 100)}%`;

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let hue = 0;
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) hue = ((b - r) / d + 2) / 6;
  else hue = ((r - g) / d + 4) / 6;

  return `${Math.round(hue * 360)} ${Math.round(s * 100)}% ${Math.round(finalL * 100)}%`;
}
