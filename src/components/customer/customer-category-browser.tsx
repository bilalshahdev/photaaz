"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { customerPublicSurface, isDarkCustomerVariant } from "@/components/customer/customer-public-page";
import { ImageWatermark } from "@/components/customer/image-watermark";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { type GalleryTaxonomyItem } from "@/data/customer-gallery-taxonomy";
import { cn } from "@/lib/utils";
import type { CustomerSiteCategory, CustomerSiteGallery } from "@/services/tenant/customer-site-data";
import type { EffectiveImageWatermark } from "@/services/platform/media-policy";

type CategoryPhotoEntry = {
  id: string;
  title: string;
  location: string;
  image: string;
  watermarkApplied?: boolean;
  category: string;
  subcategory: string | null;
};

type CustomerCategoryBrowserProps = {
  slug: string;
  galleries: CustomerSiteGallery[];
  categories: Array<GalleryTaxonomyItem | CustomerSiteCategory>;
  variant?: CustomerSiteThemeVariant;
  imageWatermark?: EffectiveImageWatermark | null;
  isDemo?: boolean;
};

const initialVisiblePhotos = 12;
const visiblePhotosStep = 9;

function getSubcategoryNames(category: GalleryTaxonomyItem | CustomerSiteCategory) {
  return category.subcategories.map((subcategory) => (typeof subcategory === "string" ? subcategory : subcategory.name));
}

function buildCategoryPhotoEntries(galleries: CustomerSiteGallery[], categories: Array<GalleryTaxonomyItem | CustomerSiteCategory>, variant: CustomerSiteThemeVariant, isDemo: boolean): CategoryPhotoEntry[] {
  if (!isDemo) {
    return categories.flatMap((category) => {
      if (!("photos" in category)) return [];

      const directPhotos = category.photos.map((photo) => ({
        id: photo.id,
        title: photo.title,
        location: photo.location,
        image: photo.image,
        watermarkApplied: photo.watermarkApplied,
        category: category.name,
        subcategory: null
      }));
      const childPhotos = category.subcategories.flatMap((subcategory) => {
        if (typeof subcategory === "string") return [];

        return subcategory.photos.map((photo) => ({
          id: photo.id,
          title: photo.title,
          location: photo.location,
          image: photo.image,
          watermarkApplied: photo.watermarkApplied,
          category: category.name,
          subcategory: subcategory.name
        }));
      });

      return [...directPhotos, ...childPhotos];
    });
  }

  const repeatCount = variant === "panorama" ? 8 : 10;

  return galleries.flatMap((gallery, galleryIndex) =>
    Array.from({ length: repeatCount }, (_, photoIndex) => {
      const category = categories[(galleryIndex + photoIndex) % categories.length];
      const subcategories = getSubcategoryNames(category);
      const subcategory = subcategories.length ? subcategories[photoIndex % subcategories.length] : null;

      return {
        id: `${category.name}-${subcategory ?? "direct"}-${gallery.title}-${galleryIndex}-${photoIndex}`,
        title: photoIndex === 0 ? gallery.title : `${category.name} Study ${photoIndex + 1}`,
        location: subcategory ? `${category.name} / ${subcategory}` : category.name,
        image: gallery.image,
        watermarkApplied: gallery.watermarkApplied,
        category: category.name,
        subcategory
      };
    })
  );
}

export function CustomerCategoryBrowser({ slug, galleries, categories, variant: variantProp, imageWatermark, isDemo = false }: CustomerCategoryBrowserProps) {
  const variant = variantProp ?? resolveCustomerSiteThemeVariant(slug);
  const surface = customerPublicSurface(variant);
  const isDark = isDarkCustomerVariant(variant);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [visiblePhotos, setVisiblePhotos] = useState(initialVisiblePhotos);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const entries = useMemo(() => buildCategoryPhotoEntries(galleries, categories, variant, isDemo), [categories, galleries, isDemo, variant]);
  const selectedCategory = categories.find((category) => category.name === activeCategory) ?? null;
  const selectedSubcategories = selectedCategory ? getSubcategoryNames(selectedCategory) : [];
  const filteredEntries = entries.filter((entry) => {
    if (activeCategory !== "All" && entry.category !== activeCategory) return false;
    if (activeSubcategory && entry.subcategory !== activeSubcategory) return false;

    return true;
  });
  const visibleEntries = filteredEntries.slice(0, visiblePhotos);
  const viewerPhoto = viewerIndex === null ? null : filteredEntries[viewerIndex];
  const hasMore = visibleEntries.length < filteredEntries.length;
  const filterButtonIdle = isDark ? "border-white/20 bg-white/[0.06] text-white hover:bg-white/10" : "border-[#d7dedb] bg-white text-[#15120f] hover:bg-[#eef3ef]";
  const filterButtonActive = "border-teal-700 bg-teal-700 text-white hover:bg-teal-700";
  const browserStyle = getCategoryBrowserStyle(variant, isDark, surface);
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
  }, [activeCategory, activeSubcategory]);

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

  function selectCategory(category: string) {
    setActiveCategory(category);
    setActiveSubcategory(null);
  }

  function openViewer(photo: CategoryPhotoEntry) {
    const nextIndex = filteredEntries.findIndex((entry) => entry.id === photo.id);
    setViewerIndex(nextIndex >= 0 ? nextIndex : 0);
  }

  const filterOffsetClass = variant === "masonry" ? "top-16 lg:top-0" : "top-16 sm:top-[4.5rem]";

  return (
    <>
      <div className={cn("sticky z-20 border-b", filterOffsetClass, isDark ? "border-white/10 bg-[#090a0a] text-white" : "border-[#d7dedb] bg-[#f7f2ea] text-[#15120f]")}>
        <div className="pf-reveal mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:px-8 lg:px-10">
          <div className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain no-scrollbar">
            <button type="button" onClick={() => selectCategory("All")} className={cn("shrink-0 border px-4 py-3 font-nav text-xs font-semibold uppercase tracking-[0.2em]", activeCategory === "All" ? filterButtonActive : filterButtonIdle)}>
              All categories
            </button>
            {categories.map((category) => (
              <button key={category.name} type="button" onClick={() => selectCategory(category.name)} className={cn("shrink-0 border px-4 py-3 font-nav text-xs font-semibold uppercase tracking-[0.2em]", activeCategory === category.name ? filterButtonActive : filterButtonIdle)}>
                {category.name}
              </button>
            ))}
          </div>

          {selectedSubcategories.length ? (
            <div className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain no-scrollbar">
              <button type="button" onClick={() => setActiveSubcategory(null)} className={cn("shrink-0 border px-3 py-2 font-nav text-[10px] font-semibold uppercase tracking-[0.18em]", activeSubcategory === null ? filterButtonActive : filterButtonIdle)}>
                All {selectedCategory?.name}
              </button>
              {selectedSubcategories.map((subcategory) => (
                <button key={subcategory} type="button" onClick={() => setActiveSubcategory(subcategory)} className={cn("shrink-0 border px-3 py-2 font-nav text-[10px] font-semibold uppercase tracking-[0.18em]", activeSubcategory === subcategory ? filterButtonActive : filterButtonIdle)}>
                  {subcategory}
                </button>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm opacity-62">{visibleEntries.length} of {filteredEntries.length} photographs</p>
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{activeSubcategory ? `${activeCategory} / ${activeSubcategory}` : activeCategory === "All" ? "All photography" : activeCategory}</p>
          </div>
        </div>
      </div>

      <section className={surface.section}>
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
          <div className={cn("border px-6 py-12 text-center", surface.card)}>
            <p className="font-display text-3xl font-light tracking-[-0.05em]">No category photos yet.</p>
            <p className={cn("mx-auto mt-3 max-w-md text-sm leading-6", surface.muted)}>Approved photos attached to this tenant&apos;s categories or subcategories will appear here.</p>
          </div>
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
              <p className="hidden max-w-sm text-right text-sm text-white/50 sm:block">{viewerIndex === null ? 0 : viewerIndex + 1} / {filteredEntries.length}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getCategoryBrowserStyle(
  variant: CustomerSiteThemeVariant,
  isDark: boolean,
  surface: ReturnType<typeof customerPublicSurface>
) {
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
      grid: "grid gap-5 lg:grid-cols-2",
      card: "rounded-[1.35rem] border-[#cbd3cd] bg-white/75 p-2 shadow-[0_18px_50px_rgba(23,32,28,0.08)]",
      aspect: () => "aspect-[18/9]",
      image: "rounded-[1rem]",
      body: "grid gap-2 px-3 pb-3 pt-4 sm:grid-cols-[1fr_auto] sm:items-end",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "font-nav text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700"
    };
  }

  if (variant === "luxury") {
    return {
      grid: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
      card: "border-[rgba(216,191,136,0.25)] bg-[#1a1814] text-[#fbf4e8]",
      aspect: (index: number) => (index % 3 === 0 ? "aspect-[16/11]" : "aspect-[4/5]"),
      image: "saturate-90",
      body: "p-4 text-center",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-3 font-nav text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d8bf88]"
    };
  }

  if (variant === "editorial") {
    return {
      grid: "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
      card: "border-[#ddcdbf] bg-[#fffaf2]",
      aspect: (index: number) => (index % 4 === 0 ? "aspect-[16/11]" : "aspect-[4/5]"),
      image: "",
      body: "p-4",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a4f32]"
    };
  }

  return {
    grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    card: cn("shadow-[0_18px_50px_rgba(15,23,42,0.04)]", surface.card),
    aspect: () => "aspect-[4/5]",
    image: "",
    body: "p-4",
    title: "font-display text-xl font-light tracking-[-0.04em]",
    meta: cn("mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]", isDark ? "text-teal-300" : surface.accent)
  };
}
