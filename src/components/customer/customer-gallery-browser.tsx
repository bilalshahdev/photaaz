"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { SharedPhotoViewer } from "@/components/customer/shared-photo-viewer";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { ImageWatermark } from "@/components/customer/image-watermark";
import { useNavbarVisibility } from "@/components/layout/customer-site-nav";
import { cn } from "@/lib/utils";
import type { NewThemeKey } from "@/lib/new-themes";
import type { CustomerSiteGallery } from "@/services/tenant/customer-site-data";
import type { EffectiveImageWatermark } from "@/services/platform/media-policy";

type PhotoEntry = {
  id: string;
  title: string;
  location: string;
  image: string;
  watermarkApplied?: boolean;
  galleryTitle: string;
};

type CustomerGalleryBrowserProps = {
  slug: string;
  galleries: CustomerSiteGallery[];
  variant?: CustomerSiteThemeVariant;
  imageWatermark?: EffectiveImageWatermark | null;
  isDemo?: boolean;
  presentation?: "velvet" | NewThemeKey;
};

const initialVisiblePhotos = 12;
const visiblePhotosStep = 9;

function buildPhotoEntries(galleries: CustomerSiteGallery[], variant: CustomerSiteThemeVariant, isDemo: boolean): PhotoEntry[] {
  if (!isDemo) {
    return galleries.flatMap((gallery) =>
      (gallery.photos ?? []).map((photo) => ({
        id: photo.id,
        title: photo.title,
        location: photo.location,
        image: photo.image,
        watermarkApplied: photo.watermarkApplied,
        galleryTitle: gallery.title
      }))
    );
  }

  const repeatCount = variant === "panorama" ? 8 : 10;

  return galleries.flatMap((gallery, galleryIndex) =>
    Array.from({ length: repeatCount }, (_, photoIndex) => ({
        id: `${gallery.title}-${galleryIndex}-${photoIndex}`,
        title: photoIndex === 0 ? gallery.title : `${gallery.title} Frame ${photoIndex + 1}`,
        location: gallery.location,
        image: gallery.image,
        watermarkApplied: gallery.watermarkApplied,
        galleryTitle: gallery.title
      }))
  );
}

export function CustomerGalleryBrowser({ slug, galleries, variant: variantProp, imageWatermark, isDemo = false, presentation }: CustomerGalleryBrowserProps) {
  const variant = variantProp ?? resolveCustomerSiteThemeVariant(slug);
  const isDark = variant === "cinematic" || variant === "luxury" || variant === "monochrome";
  const { isTopHidden, navbarHeight, setLocked } = useNavbarVisibility();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeGallery, setActiveGallery] = useState<string>("All");
  const [visiblePhotos, setVisiblePhotos] = useState(initialVisiblePhotos);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const entries = useMemo(() => buildPhotoEntries(galleries, variant, isDemo), [galleries, isDemo, variant]);
  const filteredEntries = entries.filter((entry) => {
    if (activeGallery !== "All" && entry.galleryTitle !== activeGallery) return false;

    return true;
  });
  const visibleEntries = filteredEntries.slice(0, visiblePhotos);
  const viewerPhoto = viewerIndex === null ? null : filteredEntries[viewerIndex];
  const hasMore = visibleEntries.length < filteredEntries.length;
  const stepViewer = useCallback(
    (direction: "previous" | "next") => {
      setViewerIndex((currentIndex) => {
        if (currentIndex === null) return currentIndex;

        const offset = direction === "next" ? 1 : -1;
        return (currentIndex + offset + filteredEntries.length) % filteredEntries.length;
      });
    },
    [filteredEntries.length]
  );

  useEffect(() => {
    setVisiblePhotos(initialVisiblePhotos);
    setViewerIndex(null);
  }, [activeGallery]);

  useEffect(() => {
    if (!viewerPhoto) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setViewerIndex(null);
      if (event.key === "ArrowLeft") stepViewer("previous");
      if (event.key === "ArrowRight") stepViewer("next");
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerPhoto, filteredEntries.length, stepViewer]);

  useEffect(() => {
    function handleScroll() {
      if (!hasMore) return;

      const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;

      if (distanceFromBottom < 700) {
        setVisiblePhotos((current) => Math.min(current + visiblePhotosStep, filteredEntries.length));
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredEntries.length, hasMore]);

  function scrollToContent() {
    if (!sectionRef.current) return;
    setLocked(true);
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const filterBarH = filterBarRef.current?.offsetHeight ?? 50;
    const navOffset = isTopHidden ? 0 : navbarHeight;
    window.scrollTo({ top: sectionTop - navOffset - filterBarH, behavior: "smooth" });
    setTimeout(() => setLocked(false), 700);
  }

  function selectGallery(gallery: string) {
    setActiveGallery(gallery);
    scrollToContent();
  }

  function openViewer(photo: PhotoEntry) {
    const nextIndex = filteredEntries.findIndex((entry) => entry.id === photo.id);
    setViewerIndex(nextIndex >= 0 ? nextIndex : 0);
  }

  const browserStyle = getGalleryBrowserStyle(variant, isDark, presentation);
  const theme = getGalleryFilterTheme(variant, isDark, presentation);
  // navbarHeight is measured from the actual rendered header element; 0 on masonry desktop (sidebar nav, no top bar)
  const filterBarTop = isTopHidden ? "0px" : `${navbarHeight}px`;

  return (
    <>
      <div ref={filterBarRef} className={cn("sticky z-20 w-full border-b", theme.bar)} style={{ top: filterBarTop, transition: "top 300ms ease-out" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className={cn("pf-reveal flex overflow-x-auto overscroll-x-contain no-scrollbar", theme.row)}>
            <button type="button" onClick={() => selectGallery("All")} className={cn(theme.btn, activeGallery === "All" ? theme.active : theme.idle)}>
              All galleries
            </button>
            {galleries.map((gallery, index) => (
              <button
                key={`${gallery.title}-${index}`}
                type="button"
                onClick={() => selectGallery(gallery.title)}
                className={cn(theme.btn, activeGallery === gallery.title ? theme.active : theme.idle)}
              >
                {gallery.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section ref={sectionRef} className={cn("px-5 py-10 sm:px-8 lg:px-10", presentation ? "max-w-none" : "mx-auto max-w-6xl", presentation === "velvet" && "bg-[#101010] text-white", !presentation && isDark && "bg-black text-white")}>
        {visibleEntries.length ? (
          <div className={cn("pf-stagger", browserStyle.grid)}>
            {visibleEntries.map((photo, index) => (
              <article key={`${photo.id}-${index}`} className={cn("group overflow-hidden border transition-shadow duration-300 hover:shadow-[0_22px_70px_rgba(15,23,42,0.16)]", browserStyle.card, variant === "cinematic" && (index % 5 === 0 ? "md:col-span-8" : index % 5 === 1 ? "md:col-span-4" : "md:col-span-6"), variant === "editorial" && (index % 4 === 0 ? "md:col-span-7" : index % 4 === 1 ? "md:col-span-5 md:mt-20" : "md:col-span-6"), variant === "luxury" && (index % 4 === 0 ? "md:col-span-5" : index % 4 === 1 ? "md:col-span-7 md:mt-24" : "md:col-span-6"), variant === "masonry" && (index % 6 === 0 ? "md:col-span-7 md:row-span-2" : index % 6 === 1 ? "md:col-span-5" : "md:col-span-4"))}>
                <button type="button" onClick={() => openViewer(photo)} className={cn("relative block w-full overflow-hidden text-left", browserStyle.aspect(index))}>
                  <Image src={photo.image} alt={photo.title} fill className={cn("object-cover transition duration-700 group-hover:scale-105", browserStyle.image)} />
                  <ImageWatermark watermark={photo.watermarkApplied ? null : imageWatermark} />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-black/70 px-3 py-2 font-nav text-[10px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <ZoomIn className="size-3.5" aria-hidden="true" />
                    View
                  </span>
                </button>
                <div className={browserStyle.body}>
                  <p className={browserStyle.title}>{photo.title}</p>
                  <p className={browserStyle.meta}>{photo.location}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState isDark={isDark} title="No published gallery photos yet." body="Published albums with approved photos will appear here." />
        )}
        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setVisiblePhotos((current) => Math.min(current + visiblePhotosStep, filteredEntries.length))} className="border border-current/20 px-5 py-3 font-nav text-xs font-semibold uppercase tracking-[0.22em]">
              Load more photos
            </button>
          </div>
        ) : null}
      </section>

      <SharedPhotoViewer images={filteredEntries} index={viewerIndex} onClose={() => setViewerIndex(null)} onStep={stepViewer} themeKey={presentation} imageWatermark={imageWatermark} />
    </>
  );
}

type FilterTheme = {
  bar: string;
  row: string;
  btn: string;
  idle: string;
  active: string;
};


function getGalleryFilterTheme(variant: CustomerSiteThemeVariant, isDark: boolean, presentation?: "velvet" | NewThemeKey): FilterTheme {
  if (presentation === "velvet") return { bar: "border-white/15 bg-[#101010] text-white", row: "gap-7 py-4", btn: "shrink-0 border-0 border-b-2 px-0 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]", idle: "border-transparent text-white/50 hover:text-white", active: "border-[#d2262e] text-[#ef5559]" };
  if (presentation === "relay") return { bar: "border-[#17211d] bg-[#f2f0e8] text-[#17211d]", row: "gap-0", btn: "shrink-0 border-r border-[#17211d] px-5 py-4 font-mono text-xs uppercase tracking-[0.16em]", idle: "hover:bg-[#8db6a4]", active: "bg-[#e75a3d] text-white" };
  if (presentation === "fieldbook") return { bar: "border-[#26322b] bg-[#ede6d5] text-[#26322b]", row: "gap-5 py-3", btn: "shrink-0 border-b px-1 py-2 font-mono text-xs uppercase", idle: "border-transparent opacity-60", active: "border-[#26322b]" };
  if (presentation === "kaleido") return { bar: "border-[#232136] bg-[#ffcf56] text-[#232136]", row: "gap-2 py-3", btn: "shrink-0 rounded-full border-2 border-[#232136] px-5 py-2 font-bold", idle: "bg-[#f6f2e7]", active: "bg-[#ff6b5e]" };
  if (presentation === "proscenium") return { bar: "border-white/20 bg-[#120f15] text-[#f1e9dc]", row: "justify-center gap-8 py-4", btn: "shrink-0 border-b px-1 py-2 font-serif text-lg italic", idle: "border-transparent text-white/55", active: "border-[#d44b3e] text-[#d44b3e]" };
  if (presentation === "cartograph") return { bar: "border-[#10271f] bg-[#dfe7df] text-[#10271f]", row: "gap-3 py-3", btn: "shrink-0 border border-[#10271f] px-4 py-2 font-mono text-xs uppercase", idle: "bg-transparent", active: "bg-[#10271f] text-[#dfe7df]" };
  if (presentation === "vitrine") return { bar: "border-[#9b8d76] bg-[#e7e2d8] text-[#26221e]", row: "justify-center gap-7 py-4", btn: "shrink-0 border-0 border-b px-1 py-2 font-serif", idle: "border-transparent opacity-55", active: "border-[#8e4037] text-[#8e4037]" };
  switch (variant) {
    case "luxury":
      return {
        bar: "bg-[#0d0c09]/90 text-[#fbf4e8] backdrop-blur-md",
        row: "justify-center gap-2 py-3",
        btn: "shrink-0 rounded-full border px-5 py-2 font-nav text-xs font-semibold uppercase tracking-[0.26em] transition-colors",
        idle: "border-[rgba(216,191,136,0.25)] bg-transparent text-[#fbf4e8]/75 hover:border-[rgba(216,191,136,0.55)] hover:text-[#fbf4e8]",
        active: "border-[#d8bf88] bg-[#d8bf88] text-[#0d0c09]",
      };
    case "monochrome":
      return {
        bar: "bg-black/90 text-white backdrop-blur-md",
        row: "gap-0",
        btn: "shrink-0 border-0 border-r border-white/10 px-5 py-3.5 font-nav text-xs font-semibold uppercase tracking-[0.22em] transition-colors last:border-r-0",
        idle: "bg-transparent text-white/55 hover:bg-white/5 hover:text-white/90",
        active: "bg-white/12 text-white",
      };
    case "cinematic":
      return {
        bar: "bg-black/90 text-white backdrop-blur-md",
        row: "gap-0",
        btn: "shrink-0 border-0 border-b-2 px-5 py-3 font-nav text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
        idle: "border-transparent text-white/60 hover:text-white/90",
        active: "border-teal-400 text-teal-300",
      };
    case "editorial":
      return {
        bar: "bg-[#f8f1e8]/90 text-[#211917] backdrop-blur-md",
        row: "gap-6 py-2",
        btn: "shrink-0 border-0 border-b-2 px-1 py-2.5 font-display text-sm tracking-[-0.01em] transition-colors",
        idle: "border-transparent text-[#5c524c] hover:text-[#211917]",
        active: "border-[#9a4f32] text-[#9a4f32] font-medium",
      };
    case "masonry":
      return {
        bar: "bg-white/90 text-[#101418] backdrop-blur-md",
        row: "gap-1.5 py-2.5",
        btn: "shrink-0 rounded-full border px-4 py-1.5 font-nav text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
        idle: "border-[#d9dfdc] bg-transparent text-[#38424a]/80 hover:bg-[#eef3ef]",
        active: "border-teal-700 bg-teal-700 text-white",
      };
    case "panorama":
      return {
        bar: "bg-[#e4e9e2]/90 text-[#17201c] backdrop-blur-md",
        row: "gap-3 py-3",
        btn: "shrink-0 border-0 border-b px-4 py-2.5 font-nav text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
        idle: "border-transparent text-[#17201c]/60 hover:text-[#17201c]",
        active: "border-teal-700 text-teal-700",
      };
    default:
      return {
        bar: isDark
          ? "bg-[#090a0a]/90 text-white backdrop-blur-md"
          : "bg-[#f7f2ea]/90 text-[#15120f] backdrop-blur-md",
        row: "gap-2 py-3",
        btn: "shrink-0 border px-4 py-2.5 font-nav text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
        idle: isDark
          ? "border-white/[0.15] bg-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
          : "border-[#d7dedb] bg-transparent text-[#15120f]/75 hover:bg-[#eef3ef] hover:text-[#15120f]",
        active: isDark ? "border-white bg-white text-black" : "border-teal-700 bg-teal-700 text-white",
      };
  }
}

function getGalleryBrowserStyle(variant: CustomerSiteThemeVariant, isDark: boolean, presentation?: "velvet" | NewThemeKey) {
  if (presentation === "velvet") return { grid: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", card: "border-white/15 bg-[#151515] text-white", aspect: () => "aspect-[4/5]", image: "grayscale group-hover:grayscale-0", body: "border-t border-white/15 p-4", title: "font-display text-2xl font-black uppercase tracking-[-0.05em]", meta: "mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ef5559]" };
  if (variant === "monochrome") {
    return {
      grid: "grid gap-px sm:grid-cols-2 lg:grid-cols-3",
      card: "border-white/10 bg-[#151515]",
      aspect: () => "aspect-[4/5]",
      image: "grayscale contrast-110",
      body: "border-t border-white/10 p-5",
      title: "font-display text-3xl font-light tracking-[-0.06em]",
      meta: "mt-3 font-nav text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-300"
    };
  }

  if (variant === "panorama") {
    return {
      grid: "grid gap-6 lg:grid-cols-2",
      card: "rounded-[1.5rem] border-[#cbd3cd] bg-white/90 p-3 shadow-[0_20px_60px_rgba(23,32,28,0.12)]",
      aspect: () => "aspect-[21/9]",
      image: "rounded-[1.25rem]",
      body: "grid gap-2 px-4 pb-4 pt-5 sm:grid-cols-[1fr_auto] sm:items-end",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "font-nav text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700"
    };
  }

  if (variant === "luxury") {
    return {
      grid: "grid gap-x-6 gap-y-12 md:grid-cols-12",
      card: "border-[rgba(216,191,136,0.3)] bg-[#1a1814] text-[#fbf4e8] shadow-[0_8px_32px_rgba(216,191,136,0.08)]",
      aspect: (index: number) => (index % 3 === 1 ? "aspect-square" : "aspect-[4/5]"),
      image: "saturate-90",
      body: "p-5 text-center",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-3 font-nav text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d8bf88]"
    };
  }

  if (variant === "editorial") {
    return {
      grid: "grid gap-x-6 gap-y-12 md:grid-cols-12",
      card: "border-[#ddcdbf] bg-[#fffaf2] shadow-sm",
      aspect: (index: number) => (index % 4 === 0 ? "aspect-[16/11]" : "aspect-[4/5]"),
      image: "",
      body: "p-5",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a4f32]"
    };
  }

  if (variant === "masonry") {
    return {
      grid: "grid auto-rows-fr gap-px bg-[#101418] md:grid-cols-12",
      card: "border-[#d9dfdc] bg-white",
      aspect: () => "aspect-square",
      image: "",
      body: "p-3",
      title: "font-display text-lg font-light tracking-[-0.04em]",
      meta: "mt-1 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700"
    };
  }

  if (variant === "cinematic") {
    return {
      grid: "grid gap-3 md:grid-cols-12",
      card: "border-white/5 bg-white/5",
      aspect: () => "aspect-[4/5]",
      image: "contrast-125 brightness-90",
      body: "border-t border-white/10 p-4",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-300"
    };
  }

  return {
    grid: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
    card: isDark ? "border-white/10 bg-white/5" : "border-[#d7dedb] bg-white",
    aspect: () => "aspect-[4/5]",
    image: "",
    body: "p-4",
    title: "font-display text-xl font-light tracking-[-0.04em]",
    meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700"
  };
}

function EmptyState({ isDark, title, body }: { isDark: boolean; title: string; body: string }) {
  return (
    <div className={cn("border px-6 py-12 text-center", isDark ? "border-white/10 bg-white/5 text-white" : "border-[#d7dedb] bg-white text-[#15120f]")}>
      <p className="font-display text-3xl font-light tracking-[-0.05em]">{title}</p>
      <p className={cn("mx-auto mt-3 max-w-md text-sm leading-6", isDark ? "text-white/60" : "text-[#59636b]")}>{body}</p>
    </div>
  );
}
