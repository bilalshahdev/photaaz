"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ImageWatermark } from "@/components/customer/image-watermark";
import { cn } from "@/lib/utils";
import type { EffectiveImageWatermark } from "@/services/platform/media-policy";

export type SharedViewerImage = {
  image: string;
  title: string;
  location?: string;
  watermarkApplied?: boolean;
};

export function SharedPhotoViewer({ images, index, onClose, onStep, themeKey, imageWatermark }: {
  images: SharedViewerImage[];
  index: number | null;
  onClose: () => void;
  onStep: (direction: "previous" | "next") => void;
  themeKey?: string;
  imageWatermark?: EffectiveImageWatermark | null;
}) {
  const image = index === null ? null : images[index];

  useEffect(() => {
    if (!image) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onStep("previous");
      if (event.key === "ArrowRight") onStep("next");
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [image, onClose, onStep]);

  if (!image) return null;
  const light = themeKey === "fieldbook" || themeKey === "vitrine";

  return (
    <div data-photo-viewer role="dialog" aria-modal="true" aria-label="Photo viewer" className={cn(
      "pf-viewer-enter fixed inset-0 z-[200] flex bg-black/95 p-3 text-white sm:p-6",
      themeKey === "relay" && "bg-[#17211d]",
      themeKey === "fieldbook" && "bg-[#ede6d5] text-[#26322b]",
      themeKey === "kaleido" && "bg-[#232136]",
      themeKey === "proscenium" && "bg-[#120f15]",
      themeKey === "cartograph" && "bg-[#10271f]",
      themeKey === "vitrine" && "bg-[#e7e2d8] text-[#26221e]",
    )}>
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
        <div className="mb-3 flex min-h-11 items-center justify-between gap-4">
          <p className="truncate text-sm font-medium sm:text-base">{image.title}</p>
          <button type="button" onClick={onClose} className={cn("grid size-11 shrink-0 place-items-center rounded-full border bg-black/55 transition hover:scale-105 hover:bg-white hover:text-black", light ? "border-black/25 text-white" : "border-white/25")} aria-label="Close photo viewer">
            <X className="size-5" />
          </button>
        </div>
        <div className={cn("relative min-h-0 flex-1 overflow-hidden bg-black/15", themeKey === "vitrine" && "border border-[#9b8d76] bg-[#d8d1c4] shadow-[0_20px_60px_rgba(38,34,30,.18)]")}>
          <Image src={image.image} alt={image.title} fill className="object-contain" sizes="100vw" priority />
          <ImageWatermark watermark={image.watermarkApplied ? null : imageWatermark} />
          {images.length > 1 ? <>
            <button type="button" onClick={() => onStep("previous")} className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black sm:left-5 sm:size-12" aria-label="Previous photo"><ChevronLeft className="size-6" /></button>
            <button type="button" onClick={() => onStep("next")} className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/65 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black sm:right-5 sm:size-12" aria-label="Next photo"><ChevronRight className="size-6" /></button>
          </> : null}
        </div>
        <div className={cn("mt-3 flex min-h-12 items-center justify-between gap-4 border-t border-white/15 pt-3", light && "border-black/20")}>
          <p className="truncate text-xs uppercase tracking-[0.18em] opacity-60">{image.location}</p>
          <p className="shrink-0 text-xs tabular-nums opacity-60">{(index ?? 0) + 1} / {images.length}</p>
        </div>
      </div>
    </div>
  );
}
