"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ZoomIn } from "lucide-react";
import { SharedPhotoViewer } from "@/components/customer/shared-photo-viewer";
import { customerPublicSurface, isDarkCustomerVariant } from "@/components/customer/customer-public-page";
import { ImageWatermark } from "@/components/customer/image-watermark";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { useNavbarVisibility } from "@/components/layout/customer-site-nav";
import { type GalleryTaxonomyItem } from "@/data/customer-gallery-taxonomy";
import { cn } from "@/lib/utils";
import type { NewThemeKey } from "@/lib/new-themes";
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
  presentation?: "velvet" | NewThemeKey;
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

export function CustomerCategoryBrowser({ slug, galleries, categories, variant: variantProp, imageWatermark, isDemo = false, presentation }: CustomerCategoryBrowserProps) {
  const variant = variantProp ?? resolveCustomerSiteThemeVariant(slug);
  const surface = customerPublicSurface(variant);
  const isDark = isDarkCustomerVariant(variant);
  const { isTopHidden, navbarHeight, setLocked } = useNavbarVisibility();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
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
  const browserStyle = getCategoryBrowserStyle(variant, isDark, surface, presentation);
  const theme = getCategoryFilterTheme(variant, isDark, presentation);
  const filterBarTop = isTopHidden ? "0px" : `${navbarHeight}px`;

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

  function scrollToContent() {
    if (!sectionRef.current) return;
    setLocked(true);
    const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const filterBarH = filterBarRef.current?.offsetHeight ?? 50;
    const navOffset = isTopHidden ? 0 : navbarHeight;
    window.scrollTo({ top: sectionTop - navOffset - filterBarH, behavior: "smooth" });
    setTimeout(() => setLocked(false), 700);
  }

  function selectCategory(category: string) {
    setActiveCategory(category);
    setActiveSubcategory(null);
    scrollToContent();
  }

  function openViewer(photo: CategoryPhotoEntry) {
    const nextIndex = filteredEntries.findIndex((entry) => entry.id === photo.id);
    setViewerIndex(nextIndex >= 0 ? nextIndex : 0);
  }

  return (
    <>
      <div ref={filterBarRef} className={cn("sticky z-20 w-full border-b", theme.bar)} style={{ top: filterBarTop, transition: "top 300ms ease-out" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className={cn("pf-reveal flex overflow-x-auto overscroll-x-contain no-scrollbar", theme.row)}>
            <button type="button" onClick={() => selectCategory("All")} className={cn(theme.btn, activeCategory === "All" ? theme.active : theme.idle)}>
              All categories
            </button>
            {categories.map((category) => {
              const hasSubs = getSubcategoryNames(category).length > 0;
              const isActive = activeCategory === category.name;
              return (
                <button key={category.name} type="button" onClick={() => selectCategory(category.name)} className={cn(theme.btn, "inline-flex items-center gap-1.5", isActive ? theme.active : theme.idle)}>
                  {category.name}
                  {hasSubs && (
                    <ChevronDown className={cn("size-3 shrink-0 transition-transform duration-200", isActive && "rotate-180")} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", selectedSubcategories.length ? "max-h-20 opacity-100" : "max-h-0 opacity-0")}>
            <div className={cn("flex overflow-x-auto overscroll-x-contain no-scrollbar", theme.subRow)}>
              <button type="button" onClick={() => { setActiveSubcategory(null); scrollToContent(); }} className={cn(theme.subBtn, activeSubcategory === null ? theme.subActive : theme.subIdle)}>
                All {selectedCategory?.name}
              </button>
              {selectedSubcategories.map((subcategory) => (
                <button key={subcategory} type="button" onClick={() => { setActiveSubcategory(subcategory); scrollToContent(); }} className={cn(theme.subBtn, activeSubcategory === subcategory ? theme.subActive : theme.subIdle)}>
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section ref={sectionRef} className={presentation === "velvet" ? "max-w-none bg-[#101010] px-5 py-10 text-white sm:px-8 lg:px-10" : surface.section}>
        {visibleEntries.length ? (
          <div className={cn("pf-stagger", browserStyle.grid)}>
            {visibleEntries.map((photo, index) => (
              <article key={`${photo.id}-${index}`} className={cn("group overflow-hidden border transition-shadow duration-300 hover:shadow-[0_22px_70px_rgba(15,23,42,0.16)]", browserStyle.card, variant === "cinematic" && (index % 5 === 0 ? "md:col-span-8" : index % 5 === 1 ? "md:col-span-4" : "md:col-span-6"), variant === "editorial" && (index % 4 === 0 ? "md:col-span-7" : index % 4 === 1 ? "md:col-span-5 md:mt-20" : "md:col-span-6"), variant === "luxury" && (index % 4 === 0 ? "md:col-span-5" : index % 4 === 1 ? "md:col-span-7 md:mt-24" : "md:col-span-6"), variant === "masonry" && (index % 6 === 0 ? "md:col-span-7" : index % 6 === 1 ? "md:col-span-5" : "md:col-span-4"))}>
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

      <SharedPhotoViewer images={filteredEntries} index={viewerIndex} onClose={() => setViewerIndex(null)} onStep={stepViewer} themeKey={presentation} imageWatermark={imageWatermark} />
    </>
  );
}

type CategoryFilterTheme = {
  bar: string;
  row: string;
  btn: string;
  idle: string;
  active: string;
  subRow: string;
  subBtn: string;
  subIdle: string;
  subActive: string;
};


function getNewCategoryFilterTheme(presentation?: "velvet" | NewThemeKey): CategoryFilterTheme | null {
  const shared = "shrink-0 transition-colors";
  if (presentation === "relay") return { bar: "border-[#17211d] bg-[#f2f0e8] text-[#17211d]", row: "gap-0", btn: `${shared} border-r border-[#17211d] px-5 py-4 font-mono text-xs uppercase tracking-[0.16em]`, idle: "hover:bg-[#8db6a4]", active: "bg-[#e75a3d] text-white", subRow: "gap-0 border-t border-[#17211d]", subBtn: `${shared} border-r border-[#17211d] px-4 py-2 font-mono text-[10px] uppercase`, subIdle: "opacity-60", subActive: "bg-[#8db6a4]" };
  if (presentation === "fieldbook") return { bar: "border-[#26322b] bg-[#ede6d5] text-[#26322b]", row: "gap-5 py-3", btn: `${shared} border-b px-1 py-2 font-mono text-xs uppercase`, idle: "border-transparent opacity-60", active: "border-[#26322b]", subRow: "gap-4 pb-3", subBtn: `${shared} border-b px-1 py-1 font-serif italic`, subIdle: "border-transparent opacity-50", subActive: "border-[#26322b]" };
  if (presentation === "kaleido") return { bar: "border-[#232136] bg-[#ffcf56] text-[#232136]", row: "gap-2 py-3", btn: `${shared} rounded-full border-2 border-[#232136] px-5 py-2 font-bold`, idle: "bg-[#f6f2e7]", active: "bg-[#ff6b5e]", subRow: "gap-2 pb-3", subBtn: `${shared} rounded-full border-2 border-[#232136] px-4 py-1 text-sm font-bold`, subIdle: "bg-[#f6f2e7]", subActive: "bg-[#52b8a5]" };
  if (presentation === "proscenium") return { bar: "border-white/20 bg-[#120f15] text-[#f1e9dc]", row: "justify-center gap-8 py-4", btn: `${shared} border-b px-1 py-2 font-serif text-lg italic`, idle: "border-transparent text-white/55", active: "border-[#d44b3e] text-[#d44b3e]", subRow: "justify-center gap-6 pb-3", subBtn: `${shared} border-b px-1 py-1 text-xs uppercase tracking-[0.18em]`, subIdle: "border-transparent text-white/40", subActive: "border-[#d44b3e]/70 text-[#d44b3e]" };
  if (presentation === "cartograph") return { bar: "border-[#10271f] bg-[#dfe7df] text-[#10271f]", row: "gap-3 py-3", btn: `${shared} border border-[#10271f] px-4 py-2 font-mono text-xs uppercase`, idle: "bg-transparent", active: "bg-[#10271f] text-[#dfe7df]", subRow: "gap-2 pb-3", subBtn: `${shared} border border-[#10271f]/50 px-3 py-1 font-mono text-[10px] uppercase`, subIdle: "opacity-55", subActive: "bg-[#dd6f45] text-white opacity-100" };
  if (presentation === "vitrine") return { bar: "border-[#9b8d76] bg-[#e7e2d8] text-[#26221e]", row: "justify-center gap-7 py-4", btn: `${shared} border-0 border-b px-1 py-2 font-serif`, idle: "border-transparent opacity-55", active: "border-[#8e4037] text-[#8e4037]", subRow: "justify-center gap-5 pb-3", subBtn: `${shared} border-b px-1 py-1 font-serif text-sm`, subIdle: "border-transparent opacity-45", subActive: "border-[#8e4037]/70 text-[#8e4037]" };
  return null;
}

function getCategoryFilterTheme(variant: CustomerSiteThemeVariant, isDark: boolean, presentation?: "velvet" | NewThemeKey): CategoryFilterTheme {
  if (presentation === "velvet") return { bar: "border-white/15 bg-[#101010] text-white", row: "gap-7 py-4", btn: "shrink-0 border-0 border-b-2 px-0 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em]", idle: "border-transparent text-white/50", active: "border-[#d2262e] text-[#ef5559]", subRow: "gap-5 pb-3", subBtn: "text-[10px] uppercase tracking-[0.15em]", subIdle: "text-white/40", subActive: "text-[#ef5559]" };
  const galleryTheme = getNewCategoryFilterTheme(presentation);
  if (galleryTheme) return galleryTheme;
  switch (variant) {
    case "luxury":
      return {
        bar: "bg-[#0d0c09]/90 text-[#fbf4e8] backdrop-blur-md",
        row: "justify-center gap-2 py-3",
        btn: "shrink-0 rounded-full border px-5 py-2 font-nav text-xs font-semibold uppercase tracking-[0.22em] transition-colors",
        idle: "border-[rgba(216,191,136,0.22)] bg-transparent text-[#fbf4e8]/70 hover:border-[rgba(216,191,136,0.5)] hover:text-[#fbf4e8]",
        active: "border-[#d8bf88] bg-[#d8bf88] text-[#0d0c09]",
        subRow: "justify-center gap-1.5 pb-2.5",
        subBtn: "shrink-0 rounded-full border px-4 py-1.5 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors",
        subIdle: "border-[rgba(216,191,136,0.16)] bg-transparent text-[#fbf4e8]/55 hover:text-[#fbf4e8]/80",
        subActive: "border-[#d8bf88]/60 text-[#d8bf88]",
      };
    case "monochrome":
      return {
        bar: "bg-black/90 text-white backdrop-blur-md",
        row: "gap-0",
        btn: "shrink-0 border-0 border-r border-white/10 px-5 py-3.5 font-nav text-xs font-semibold uppercase tracking-[0.22em] transition-colors last:border-r-0",
        idle: "bg-transparent text-white/55 hover:bg-white/5 hover:text-white/90",
        active: "bg-white/12 text-white",
        subRow: "gap-0 border-t border-white/[0.06]",
        subBtn: "shrink-0 border-0 border-r border-white/[0.06] px-5 py-2.5 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors last:border-r-0",
        subIdle: "bg-transparent text-white/45 hover:text-white/75",
        subActive: "bg-white/[0.07] text-white",
      };
    case "cinematic":
      return {
        bar: "bg-black/90 text-white backdrop-blur-md",
        row: "gap-0",
        btn: "shrink-0 border-0 border-b-2 px-5 py-3 font-nav text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
        idle: "border-transparent text-white/60 hover:text-white/90",
        active: "border-teal-400 text-teal-300",
        subRow: "gap-0 pt-0.5",
        subBtn: "shrink-0 border-0 border-b-2 px-4 py-2 font-nav text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
        subIdle: "border-transparent text-white/50 hover:text-white/75",
        subActive: "border-teal-500/60 text-teal-400/90",
      };
    case "editorial":
      return {
        bar: "bg-[#f8f1e8]/90 text-[#211917] backdrop-blur-md",
        row: "gap-6 py-2",
        btn: "shrink-0 border-0 border-b-2 px-1 py-2.5 font-display text-sm tracking-[-0.02em] transition-colors",
        idle: "border-transparent text-[#4e443c] hover:text-[#211917]",
        active: "border-[#9a4f32] font-medium text-[#9a4f32]",
        subRow: "gap-4 pb-2",
        subBtn: "shrink-0 border-0 border-b px-1 py-2 font-display text-xs tracking-[-0.01em] transition-colors",
        subIdle: "border-transparent text-[#7a6f68] hover:text-[#4e443c]",
        subActive: "border-[#9a4f32]/60 font-medium text-[#9a4f32]/90",
      };
    case "masonry":
      return {
        bar: "bg-white/90 text-[#101418] backdrop-blur-md",
        row: "gap-1.5 py-2.5",
        btn: "shrink-0 rounded-full border px-4 py-1.5 font-nav text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
        idle: "border-[#d9dfdc] bg-transparent text-[#38424a]/80 hover:bg-[#eef3ef]",
        active: "border-teal-700 bg-teal-700 text-white",
        subRow: "gap-1 pb-2",
        subBtn: "shrink-0 rounded-full border px-3 py-1 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors",
        subIdle: "border-[#d9dfdc]/60 bg-transparent text-[#38424a]/65 hover:bg-[#eef3ef]",
        subActive: "border-teal-600 bg-teal-600/10 text-teal-700",
      };
    case "panorama":
      return {
        bar: "bg-[#e4e9e2]/90 text-[#17201c] backdrop-blur-md",
        row: "gap-3 py-3",
        btn: "shrink-0 border-0 border-b px-4 py-2.5 font-nav text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
        idle: "border-transparent text-[#17201c]/65 hover:text-[#17201c]",
        active: "border-teal-700 text-teal-700",
        subRow: "gap-2 pb-2.5",
        subBtn: "shrink-0 border-0 border-b px-3 py-2 font-nav text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
        subIdle: "border-transparent text-[#17201c]/50 hover:text-[#17201c]/80",
        subActive: "border-teal-600/60 text-teal-700/90",
      };
    default:
      return {
        bar: isDark
          ? "bg-[#090a0a]/90 text-white backdrop-blur-md"
          : "bg-[#f7f2ea]/90 text-[#15120f] backdrop-blur-md",
        row: "gap-2 py-3",
        btn: "shrink-0 border px-4 py-2.5 font-nav text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
        idle: isDark
          ? "border-white/[0.15] bg-transparent text-white/60 hover:bg-white/5 hover:text-white/90"
          : "border-[#d7dedb] bg-transparent text-[#15120f]/75 hover:bg-[#eef3ef] hover:text-[#15120f]",
        active: isDark ? "border-white bg-white text-black" : "border-teal-700 bg-teal-700 text-white",
        subRow: "gap-1.5 pb-2.5",
        subBtn: "shrink-0 border px-3 py-2 font-nav text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
        subIdle: isDark
          ? "border-white/10 bg-transparent text-white/50 hover:text-white/75"
          : "border-[#d7dedb]/60 bg-transparent text-[#15120f]/60 hover:text-[#15120f]/90",
        subActive: isDark ? "border-white/40 text-white/90" : "border-teal-600/50 text-teal-700/90",
      };
  }
}

function getCategoryBrowserStyle(
  variant: CustomerSiteThemeVariant,
  isDark: boolean,
  surface: ReturnType<typeof customerPublicSurface>,
  presentation?: "velvet" | NewThemeKey
) {
  if (presentation === "velvet") return {
    grid: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
    card: "border-white/15 bg-[#151515] text-white",
    aspect: () => "aspect-[4/5]",
    image: "grayscale group-hover:grayscale-0",
    body: "border-t border-white/15 p-4",
    title: "font-display text-2xl font-black uppercase tracking-[-0.05em]",
    meta: "mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ef5559]"
  };

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
      aspect: (index: number) => (index % 3 === 0 ? "aspect-[16/11]" : "aspect-[4/5]"),
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
      grid: "grid gap-px bg-[#101418] md:grid-cols-12",
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
    card: cn("shadow-[0_18px_50px_rgba(15,23,42,0.04)]", surface.card),
    aspect: () => "aspect-[4/5]",
    image: "",
    body: "p-4",
    title: "font-display text-xl font-light tracking-[-0.04em]",
    meta: cn("mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]", isDark ? "text-teal-300" : surface.accent)
  };
}
