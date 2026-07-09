"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { ImageWatermark } from "@/components/customer/image-watermark";
import { useNavbarVisibility } from "@/components/layout/customer-site-nav";
import { cn } from "@/lib/utils";
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

export function CustomerGalleryBrowser({ slug, galleries, variant: variantProp, imageWatermark, isDemo = false }: CustomerGalleryBrowserProps) {
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

  const browserStyle = getGalleryBrowserStyle(variant, isDark);
  const theme = getGalleryFilterTheme(variant, isDark);
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

      <section ref={sectionRef} className={cn("mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10", isDark && "bg-black text-white")}>
        {visibleEntries.length ? (
          <div className={cn("pf-stagger", browserStyle.grid)}>
            {visibleEntries.map((photo, index) => (
              <article key={`${photo.id}-${index}`} className={cn("group overflow-hidden border transition-shadow duration-300 hover:shadow-[0_22px_70px_rgba(15,23,42,0.16)]", browserStyle.card)}>
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

      {viewerPhoto ? (
        <div className="pf-viewer-enter fixed inset-0 z-50 bg-black p-4 text-white sm:p-8">
          <button type="button" onClick={() => setViewerIndex(null)} className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center border border-white/20 bg-black/70 transition hover:bg-white hover:text-black" aria-label="Close photo viewer">
            <X className="size-5" aria-hidden="true" />
          </button>
          {filteredEntries.length > 1 ? (
            <>
              <button type="button" onClick={() => stepViewer("previous")} className="absolute left-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 transition hover:bg-white hover:text-black sm:left-8 sm:size-14" aria-label="Previous photo">
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => stepViewer("next")} className="absolute right-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 transition hover:bg-white hover:text-black sm:right-8 sm:size-14" aria-label="Next photo">
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </>
          ) : null}
          <div className="flex h-full flex-col">
            <div className="relative min-h-0 flex-1">
              <Image src={viewerPhoto.image} alt={viewerPhoto.title} fill className="object-contain" sizes="100vw" priority />
              <ImageWatermark watermark={viewerPhoto.watermarkApplied ? null : imageWatermark} />
            </div>
            <div className="mx-auto mt-4 flex w-full max-w-6xl items-end justify-between gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="font-display text-3xl font-light tracking-[-0.05em]">{viewerPhoto.title}</p>
                <p className="mt-1 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{viewerPhoto.location}</p>
              </div>
              <p className="hidden max-w-sm text-right text-sm text-white/50 sm:block">
                {viewerIndex === null ? 0 : viewerIndex + 1} / {filteredEntries.length}
              </p>
            </div>
          </div>
        </div>
      ) : null}
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

function getGalleryFilterTheme(variant: CustomerSiteThemeVariant, isDark: boolean): FilterTheme {
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

function getGalleryBrowserStyle(variant: CustomerSiteThemeVariant, isDark: boolean) {
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
      grid: "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
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
      grid: "grid gap-6 md:grid-cols-2 xl:grid-cols-3",
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
      grid: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
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
      grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
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
