"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";
import { HeroMediaCarousel, type HeroMediaSlide } from "@/components/customer/hero-media-carousel";
import { CustomerSiteContainer, customerSiteContainerClass } from "@/components/customer/customer-site-container";
import { CustomerSiteFooter } from "@/components/customer/customer-site-footer";
import { CustomerNavProvider, CustomerSiteNav } from "@/components/layout/customer-site-nav";
import { ImageWatermark as PhotoImageWatermark } from "@/components/customer/image-watermark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { customerPath } from "@/config/routes";
import { customerGalleryTaxonomy } from "@/data/customer-gallery-taxonomy";
import { localizePath, type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";
import type { CustomerSiteCategory, CustomerSitePhoto } from "@/services/tenant/customer-site-data";
import type { EffectiveImageWatermark } from "@/services/platform/media-policy";

type CustomerSiteExperienceProps = {
  slug: string;
  locale: AppLocale;
  demo: {
    studioName: string;
    themeKey?: string;
    specialty: string;
    tagline: string;
    heroTitle?: string;
    heroImage: string;
    heroImages?: string[];
    heroImageLinks?: string[];
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
    socialLinks?: Record<"instagram" | "facebook" | "youtube" | "linkedin" | "snapchat" | "pinterest" | "behance" | "tiktok", { href: string; enabled: boolean }>;
    sections?: {
      hero: boolean;
      featuredPhotos: boolean;
      categories: boolean;
      galleries: boolean;
      contact: boolean;
      footer: boolean;
    };
    sectionOrder?: Array<"hero" | "featuredPhotos" | "categories" | "galleries" | "contact" | "footer">;
    homepage?: {
      featuredPhotos: {
        source: "selected" | "all" | "category" | "subcategory" | "gallery";
        sourceId: string;
        selectedPhotoIds: string[];
        limit: number;
        columns: "1" | "2" | "3" | "4" | "masonry";
        gridStyle: "square" | "portrait" | "landscape" | "tiles" | "mixed";
        pagination: "infinite";
      };
    };
    imageWatermark?: EffectiveImageWatermark | null;
    photos?: CustomerSitePhoto[];
    categories?: CustomerSiteCategory[];
    galleries: Array<{ title: string; location: string; image: string; watermarkApplied?: boolean }>;
    isDemo?: boolean;
  };
};

type DemoData = CustomerSiteExperienceProps["demo"];
type ViewerImage = DemoData["galleries"][number];

const ViewerContext = createContext<(image: ViewerImage, collection?: ViewerImage[]) => void>(() => {});
const WatermarkContext = createContext<EffectiveImageWatermark | null>(null);

function galleryKey(gallery: ViewerImage, index: number) {
  return `${gallery.title}-${gallery.location}-${gallery.image}-${index}`;
}

function getHeroTitle(demo: DemoData) {
  return demo.heroTitle || demo.studioName;
}

function isHomeSectionEnabled(demo: DemoData, section: keyof NonNullable<DemoData["sections"]>) {
  return demo.sections?.[section] ?? true;
}

function getHomeSectionOrder(demo: DemoData) {
  return demo.sectionOrder?.length
    ? demo.sectionOrder
    : (["hero", "galleries", "featuredPhotos", "categories", "contact", "footer"] as const);
}

function OrderedHomeSections({
  slug,
  locale,
  demo,
  variant,
  hero,
  galleries
}: CustomerSiteExperienceProps & {
  variant: CustomerSiteThemeVariant;
  hero?: ReactNode;
  galleries?: ReactNode;
}) {
  const nodes: Partial<Record<NonNullable<DemoData["sectionOrder"]>[number], ReactNode>> = {
    hero,
    galleries,
    featuredPhotos: <FeaturedPhotos demo={demo} variant={variant} />,
    categories: <FavoriteCategories slug={slug} locale={locale} demo={demo} variant={variant} />,
    contact: <ContactSection demo={demo} variant={variant} />,
    footer: <CustomerSiteFooter slug={slug} locale={locale} site={demo} variant={variant} />
  };

  return (
    <>
      {getHomeSectionOrder(demo).map((section) => {
        if (!isHomeSectionEnabled(demo, section)) {
          return null;
        }

        return <div key={section}>{nodes[section] ?? null}</div>;
      })}
    </>
  );
}

function HeroImage({ demo, alt, className }: { demo: DemoData; alt: string; className?: string }) {
  const images = demo.heroImages?.length ? demo.heroImages : [demo.heroImage];
  const slides: HeroMediaSlide[] = images.map((image, index) => ({
    image,
    href: demo.heroImageLinks?.[index],
    label: `${alt} ${index + 1}`
  }));

  return <HeroMediaCarousel slides={slides} alt={alt} className={className} />;
}

function ThemeActions({ slug, locale, variant, align = "left" }: { slug: string; locale: AppLocale; variant: CustomerSiteThemeVariant; align?: "left" | "center" }) {
  const isDark = variant === "cinematic" || variant === "luxury" || variant === "monochrome" || variant === "panorama";

  return (
    <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row", align === "center" && "justify-center")}>
      <Link
        href={localizePath(locale, customerPath(slug, "/gallery"))}
        className={cn(
          "pf-action inline-flex h-12 items-center justify-center px-5 font-nav text-xs font-semibold uppercase tracking-[0.24em]",
          isDark ? "bg-white text-black" : "bg-[#15120f] text-white"
        )}
      >
        View galleries
      </Link>
      <Link
        href={`${localizePath(locale, customerPath(slug))}#contact`}
        className={cn(
          "pf-action inline-flex h-12 items-center justify-center border px-5 font-nav text-xs font-semibold uppercase tracking-[0.24em]",
          isDark ? "border-white/20 text-white hover:bg-white/10" : "border-current/20 text-current hover:bg-black/5"
        )}
      >
        Contact
      </Link>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  className,
  dark = false
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("pf-reveal mb-10 grid gap-4 border-b border-current/10 pb-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end", className)}>
      <div>
        <p className={cn("font-nav text-xs font-semibold uppercase tracking-[0.28em]", dark ? "text-white/50" : "text-teal-700")}>{eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-light leading-tight tracking-[-0.05em] sm:text-5xl">{title}</h2>
      </div>
      <p className={cn("max-w-2xl text-sm leading-6 sm:text-base sm:leading-7", dark ? "text-white/60" : "text-[#59636b]")}>{description}</p>
    </div>
  );
}

function GalleryImage({ gallery, className }: { gallery: DemoData["galleries"][number]; className?: string }) {
  const openViewer = useContext(ViewerContext);

  return (
    <article className={cn("pf-reveal group overflow-hidden transition-shadow duration-300 hover:shadow-[0_22px_70px_rgba(15,23,42,0.14)]", className)}>
      <button type="button" onClick={() => openViewer(gallery)} className="relative block w-full overflow-hidden text-left">
        <Image src={gallery.image} alt={gallery.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
        <ImageWatermark disabled={gallery.watermarkApplied} />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-black/70 px-3 py-2 font-nav text-[10px] font-semibold uppercase tracking-[0.18em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ZoomIn className="size-3.5" aria-hidden="true" />
          View
        </span>
      </button>
      <div className="pt-4">
        <h3 className="font-display text-3xl font-light tracking-[-0.05em]">{gallery.title}</h3>
        <p className="mt-2 font-nav text-xs font-semibold uppercase tracking-[0.22em] opacity-60">{gallery.location}</p>
      </div>
    </article>
  );
}

function PhotoViewer({ images, index, onClose, onStep }: { images: ViewerImage[]; index: number | null; onClose: () => void; onStep: (direction: "previous" | "next") => void }) {
  const image = index === null ? null : images[index];

  useEffect(() => {
    if (!image) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onStep("previous");
      if (event.key === "ArrowRight") onStep("next");
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose, onStep]);

  if (!image) return null;

  return (
    <div className="pf-viewer-enter fixed inset-0 z-50 bg-black p-4 text-white sm:p-8">
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center border border-white/20 bg-black/70 transition hover:bg-white hover:text-black" aria-label="Close photo viewer">
        <X className="size-5" aria-hidden="true" />
      </button>
      {images.length > 1 ? (
        <>
          <button type="button" onClick={() => onStep("previous")} className="absolute left-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 transition hover:bg-white hover:text-black sm:left-8 sm:size-14" aria-label="Previous photo">
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => onStep("next")} className="absolute right-4 top-1/2 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 transition hover:bg-white hover:text-black sm:right-8 sm:size-14" aria-label="Next photo">
            <ChevronRight className="size-6" aria-hidden="true" />
          </button>
        </>
      ) : null}
      <div className="flex h-full flex-col">
        <div className="relative min-h-0 flex-1">
          <Image src={image.image} alt={image.title} fill className="object-contain" sizes="100vw" priority />
          <ImageWatermark disabled={image.watermarkApplied} />
        </div>
        <div className="mx-auto mt-4 flex w-full max-w-6xl items-end justify-between gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="font-display text-3xl font-light tracking-[-0.05em]">{image.title}</p>
            <p className="mt-1 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{image.location}</p>
          </div>
          <p className="hidden max-w-sm text-right text-sm text-white/50 sm:block">
            {index === null ? 0 : index + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>
  );
}

type DisplayCategory = {
  name: string;
  image?: string;
  subcategories: string[];
};

function getDisplayCategories(demo: DemoData, variant: CustomerSiteThemeVariant): DisplayCategory[] {
  if (demo.categories?.length) {
    return demo.categories.map((category) => ({
      name: category.name,
      image: category.image,
      subcategories: category.subcategories.map((subcategory) => subcategory.name)
    }));
  }

  return demo.isDemo === false ? [] : customerGalleryTaxonomy[variant];
}

function formatDisplaySubcategories(subcategories: string[]) {
  return subcategories.length ? subcategories.join(" / ") : "Direct gallery";
}

function getCategoryImage(category: DisplayCategory, galleries: DemoData["galleries"], index: number) {
  return category.image || galleries[index % Math.max(galleries.length, 1)]?.image;
}

function CategoryStack({ variant, galleries, categories, className }: { variant: CustomerSiteThemeVariant; galleries: DemoData["galleries"]; categories?: DisplayCategory[]; className?: string }) {
  const displayCategories = categories ?? customerGalleryTaxonomy[variant];

  if (!displayCategories.length) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {displayCategories.map((category, index) => {
        const image = getCategoryImage(category, galleries, index);

        return (
        <div key={category.name} className="grid gap-4 border-b border-current/10 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[112px_1fr] sm:items-center">
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden border border-current/10 bg-current/5">
              <Image src={image} alt={`${category.name} category thumbnail`} fill className="object-cover transition duration-700 hover:scale-105" sizes="112px" />
              <ImageWatermark />
              <div className={cn("absolute inset-0", variant === "monochrome" ? "bg-black/30 grayscale" : "bg-black/10")} />
            </div>
          ) : null}
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-2xl font-light tracking-[-0.05em]">{category.name}</p>
              <span className="font-nav text-[10px] font-semibold uppercase tracking-[0.2em] opacity-45">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.subcategories.length ? (
                category.subcategories.map((subcategory) => (
                  <span key={subcategory} className="border border-current/10 px-2.5 py-1 font-nav text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">
                    {subcategory}
                  </span>
                ))
              ) : (
                <span className="border border-current/10 px-2.5 py-1 font-nav text-[10px] font-semibold uppercase tracking-[0.18em] opacity-70">Direct gallery</span>
              )}
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

function getThemeTone(variant: CustomerSiteThemeVariant) {
  const isDark = variant === "cinematic" || variant === "luxury" || variant === "monochrome";

  if (isDark) {
    return {
      section: cn(customerSiteContainerClass, "pb-16"),
      card: variant === "luxury" ? "border-white/10 bg-[#1a1814] text-[#fbf4e8]" : "border-white/10 bg-white/[0.06] text-white",
      muted: variant === "luxury" ? "text-[#d8cab8]" : "text-white/60",
      accent: variant === "luxury" ? "text-[#d8bf88]" : "text-teal-300",
      button: "bg-white text-black"
    };
  }

  if (variant === "editorial") {
    return {
      section: cn(customerSiteContainerClass, "pb-16"),
      card: "border-[#ddcdbf] bg-[#fffaf2] text-[#211917]",
      muted: "text-[#695f58]",
      accent: "text-[#9a4f32]",
      button: "bg-[#211917] text-white"
    };
  }

  if (variant === "masonry") {
    return {
      section: "px-5 pb-16 sm:px-8 lg:px-10",
      card: "border-[#d9dfdc] bg-white text-[#101418]",
      muted: "text-[#5f6970]",
      accent: "text-teal-700",
      button: "bg-[#101418] text-white"
    };
  }

  return {
    section: cn(customerSiteContainerClass, variant === "panorama" ? "pb-16 pt-8" : "pb-16"),
    card: variant === "panorama" ? "border-[#cbd3cd] bg-white/70 text-[#17201c]" : "border-[#d8d1c7] bg-[#fffaf2] text-[#15120f]",
    muted: variant === "panorama" ? "text-[#59645f]" : "text-[#59636b]",
    accent: "text-teal-700",
    button: "bg-[#15120f] text-white"
  };
}

function buildFeaturedPhotos(demo: DemoData) {
  const featuredSettings = demo.homepage?.featuredPhotos;

  if (demo.photos?.length) {
    const photos = demo.photos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      location: photo.location,
      image: photo.image,
      watermarkApplied: photo.watermarkApplied,
      galleryTitle: photo.galleryTitle,
      categoryName: photo.categoryName,
      subcategoryName: photo.subcategoryName
    }));

    if (featuredSettings?.source === "selected" && featuredSettings.selectedPhotoIds.length) {
      const photosById = new Map(photos.map((photo) => [photo.id, photo]));
      return featuredSettings.selectedPhotoIds.map((id) => photosById.get(id)).filter((photo): photo is (typeof photos)[number] => Boolean(photo));
    }

    if (featuredSettings?.source === "category" && featuredSettings.sourceId) {
      return photos.filter((photo) => slugifyToken(photo.categoryName ?? "") === featuredSettings.sourceId || photo.categoryName === featuredSettings.sourceId);
    }

    if (featuredSettings?.source === "subcategory" && featuredSettings.sourceId) {
      return photos.filter((photo) => slugifyToken(photo.subcategoryName ?? "") === featuredSettings.sourceId || photo.subcategoryName === featuredSettings.sourceId);
    }

    if (featuredSettings?.source === "gallery" && featuredSettings.sourceId) {
      return photos.filter((photo) => slugifyToken(photo.galleryTitle ?? "") === featuredSettings.sourceId || photo.galleryTitle === featuredSettings.sourceId);
    }

    return photos;
  }

  if (demo.isDemo === false) {
    return [];
  }

  const galleries = demo.galleries;

  return galleries.flatMap((gallery, galleryIndex) =>
    [0, 1].map((itemIndex) => ({
      ...gallery,
      title: itemIndex === 0 ? gallery.title : `${gallery.title} Detail`,
      id: `${gallery.title}-${galleryIndex}-${itemIndex}`
    }))
  );
}

function slugifyToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FeaturedPhotos({ demo, variant }: { demo: DemoData; variant: CustomerSiteThemeVariant }) {
  const tone = getThemeTone(variant);
  const openViewer = useContext(ViewerContext);
  const featuredSettings = demo.homepage?.featuredPhotos;
  const photos = buildFeaturedPhotos(demo).slice(0, featuredSettings?.limit ?? 6);
  const dark = variant === "cinematic" || variant === "luxury" || variant === "monochrome";
  const columns = featuredSettings?.columns ?? "3";
  const gridStyle = featuredSettings?.gridStyle ?? "mixed";
  const gridClass = getFeaturedPhotosGridClass(columns, variant);

  return (
    <section id="featured-photos" className={tone.section}>
      <SectionIntro
        eyebrow="Featured photos"
        title="A closer look at the visual tone."
        description="A small hand-picked set gives visitors an immediate feel for the photographer's color, detail, framing, and mood."
        dark={dark}
      />
      <div className={cn("pf-stagger", gridClass)}>
        {photos.map((photo, index) => {
          const frame = getFeaturedPhotoFrame(variant);

          return (
            <article key={photo.id} className={cn("overflow-hidden border transition-shadow duration-300 hover:shadow-[0_22px_70px_rgba(15,23,42,0.14)]", frame.card)}>
              <button
                type="button"
                onClick={() => openViewer(photo, photos)}
                className={cn("relative block w-full overflow-hidden text-left", getFeaturedPhotoAspectClass(gridStyle, index, variant), frame.imageFrame)}
              >
                <Image src={photo.image} alt={photo.title} fill className={cn("object-cover transition duration-700 hover:scale-105", frame.image)} />
                <ImageWatermark disabled={photo.watermarkApplied} />
              </button>
              <div className={frame.body}>
                <p className={frame.title}>{photo.title}</p>
                <p className={cn(frame.meta, tone.accent)}>{photo.location}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getFeaturedPhotosGridClass(columns: NonNullable<DemoData["homepage"]>["featuredPhotos"]["columns"], variant: CustomerSiteThemeVariant) {
  if (columns === "masonry" || variant === "masonry") {
    return "columns-1 gap-4 sm:columns-2 xl:columns-3";
  }

  const columnClasses = {
    "1": "grid gap-4",
    "2": "grid gap-4 sm:grid-cols-2",
    "3": "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
  } satisfies Record<Exclude<typeof columns, "masonry">, string>;

  if (variant === "panorama" && columns === "3") {
    return "grid gap-4 md:grid-cols-2 xl:grid-cols-3";
  }

  return columnClasses[columns];
}

function getFeaturedPhotoAspectClass(
  gridStyle: NonNullable<DemoData["homepage"]>["featuredPhotos"]["gridStyle"],
  index: number,
  variant: CustomerSiteThemeVariant
) {
  if (gridStyle === "square") return "aspect-square";
  if (gridStyle === "portrait") return "aspect-[4/5]";
  if (gridStyle === "landscape") return "aspect-[16/10]";
  if (gridStyle === "tiles") return index % 3 === 0 ? "aspect-[16/10]" : "aspect-square";
  if (variant === "panorama") return "aspect-[16/9]";
  return index % 3 === 1 ? "aspect-square" : "aspect-[4/5]";
}

function getFeaturedPhotoFrame(variant: CustomerSiteThemeVariant) {
  if (variant === "panorama") {
    return {
      card: "rounded-[1.35rem] border-[#cbd3cd] bg-white/70 p-2 shadow-[0_18px_50px_rgba(23,32,28,0.08)]",
      imageFrame: "rounded-[1rem]",
      image: "rounded-[1rem]",
      body: "px-3 pb-3 pt-4",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]"
    };
  }

  if (variant === "luxury") {
    return {
      card: "border-[rgba(216,191,136,0.25)] bg-[#1a1814] p-3 text-center",
      imageFrame: "",
      image: "saturate-90",
      body: "px-2 pb-2 pt-4",
      title: "font-display text-2xl font-light tracking-[-0.05em]",
      meta: "mt-3 font-nav text-[10px] font-semibold uppercase tracking-[0.22em]"
    };
  }

  if (variant === "monochrome") {
    return {
      card: "border-white/10 bg-[#151515]",
      imageFrame: "",
      image: "grayscale contrast-110",
      body: "border-t border-white/10 p-4",
      title: "font-display text-2xl font-light tracking-[-0.055em]",
      meta: "mt-3 font-nav text-[10px] font-semibold uppercase tracking-[0.22em]"
    };
  }

  if (variant === "masonry") {
    return {
      card: "mb-4 break-inside-avoid border-[#d9dfdc] bg-white p-2",
      imageFrame: "",
      image: "",
      body: "p-3",
      title: "font-display text-xl font-light tracking-[-0.045em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]"
    };
  }

  if (variant === "editorial") {
    return {
      card: "border-[#ddcdbf] bg-[#fffaf2] p-3",
      imageFrame: "",
      image: "",
      body: "pt-3",
      title: "font-display text-xl font-light tracking-[-0.045em]",
      meta: "mt-1 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]"
    };
  }

  if (variant === "cinematic") {
    return {
      card: "border-white/5 bg-white/5 p-3",
      imageFrame: "",
      image: "contrast-125 brightness-90",
      body: "border-t border-white/10 pt-3",
      title: "font-display text-xl font-light tracking-[-0.045em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300"
    };
  }

  if (variant === "luxury") {
    return {
      card: "border-[rgba(216,191,136,0.25)] bg-[#1a1814] text-[#fbf4e8] p-4",
      imageFrame: "",
      image: "saturate-90",
      body: "pt-3 text-center",
      title: "font-display text-xl font-light tracking-[-0.045em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d8bf88]"
    };
  }

  if (variant === "panorama") {
    return {
      card: "rounded-[1.5rem] border-[#cbd3cd] bg-white/75 p-3 shadow-[0_20px_60px_rgba(23,32,28,0.12)]",
      imageFrame: "",
      image: "rounded-[1.25rem]",
      body: "pt-3",
      title: "font-display text-xl font-light tracking-[-0.045em]",
      meta: "mt-2 font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700"
    };
  }

  return {
    card: "border-[#d7dedb] bg-white p-3",
    imageFrame: "",
    image: "",
    body: "pt-3",
    title: "font-display text-xl font-light tracking-[-0.045em]",
    meta: "mt-1 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]"
  };
}

function CategoryPreviewCard({
  category,
  image,
  index,
  slug,
  locale,
  variant,
  className,
  imageClassName,
  titleClassName,
  mutedClassName,
  accentClassName
}: {
  category: DisplayCategory;
  image: string;
  index: number;
  slug: string;
  locale: AppLocale;
  variant: CustomerSiteThemeVariant;
  className: string;
  imageClassName?: string;
  titleClassName?: string;
  mutedClassName?: string;
  accentClassName?: string;
}) {
  const tone = getThemeTone(variant);

  return (
    <Link
      href={localizePath(locale, customerPath(slug, "/categories"))}
      className={cn("group block overflow-hidden border transition-shadow duration-300 hover:shadow-[0_22px_70px_rgba(15,23,42,0.14)]", className)}
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden", imageClassName)}>
        <Image src={image} alt={`${category.name} category`} fill className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/20" />
        <ImageWatermark />
        <span className="absolute left-4 top-4 font-nav text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="p-5">
        <p className={cn("font-display text-3xl font-light tracking-[-0.06em]", titleClassName)}>{category.name}</p>
        <p className={cn("mt-4 text-sm leading-6", mutedClassName ?? tone.muted)}>{formatDisplaySubcategories(category.subcategories)}</p>
        <p className={cn("mt-6 font-nav text-[10px] font-semibold uppercase tracking-[0.2em]", accentClassName ?? tone.accent)}>Explore category</p>
      </div>
    </Link>
  );
}

function FavoriteCategories({ slug, locale, demo, variant }: CustomerSiteExperienceProps & { variant: CustomerSiteThemeVariant }) {
  const categories = getDisplayCategories(demo, variant);
  const visibleCategories = categories.slice(0, 4);

  if (!visibleCategories.length) {
    return null;
  }

  if (variant === "editorial") {
    return (
      <CustomerSiteContainer as="section" className="pb-16">
        <SectionIntro eyebrow="Browse by type" title="Stories organized for easy discovery." description="Categories help visitors move through the portfolio by subject, mood, and shoot style." />
        <div className="pf-stagger grid gap-6 lg:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="border-[#ddcdbf] bg-[#fffaf2] text-[#211917]" mutedClassName="text-[#695f58]" accentClassName="text-[#9a4f32]" />
          ))}
        </div>
      </CustomerSiteContainer>
    );
  }

  if (variant === "cinematic") {
    return (
      <CustomerSiteContainer as="section" className="pb-16">
        <SectionIntro eyebrow="Explore" title="Move through the work by category." description="A clear taxonomy gives visitors a faster path into the kinds of images they care about." dark />
        <div className="pf-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="border-white/10 bg-white/5 text-white" mutedClassName="text-white/60" accentClassName="text-teal-300" />
          ))}
        </div>
      </CustomerSiteContainer>
    );
  }

  if (variant === "monochrome") {
    return (
      <CustomerSiteContainer as="section" className="pb-16">
        <SectionIntro eyebrow="Browse" title="Monochrome organization." description="Each category leads to a focused black-and-white gallery." dark />
        <div className="pf-stagger grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="border-white/10 bg-[#151515] text-white" mutedClassName="text-white/60" accentClassName="text-teal-300" />
          ))}
        </div>
      </CustomerSiteContainer>
    );
  }

  if (variant === "masonry") {
    return (
      <section className="px-5 pb-16 sm:px-8 lg:px-10">
        <SectionIntro eyebrow="Index" title="Fast routes into the archive." description="Visitors can browse broad categories first, then move into a focused gallery or shoot." />
        <div className="pf-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="border-[#d9dfdc] bg-white text-[#101418]" mutedClassName="text-[#5f6970]" accentClassName="text-teal-700" />
          ))}
        </div>
      </section>
    );
  }

  if (variant === "luxury") {
    return (
      <CustomerSiteContainer as="section" className="pb-16 text-center">
        <p className="font-nav text-xs font-semibold uppercase tracking-[0.34em] text-[#d8bf88]">Portfolio paths</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-light tracking-[-0.06em]">A refined way to browse the work.</h2>
        <div className="pf-stagger mt-8 grid gap-6 md:grid-cols-4">
          {visibleCategories.map((category, index) => (
            <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="border-[rgba(216,191,136,0.25)] bg-[#1a1814] text-[#fbf4e8]" mutedClassName="text-[#d8cab8]" accentClassName="text-[#d8bf88]" />
          ))}
        </div>
      </CustomerSiteContainer>
    );
  }

  if (variant === "panorama") {
    return (
      <CustomerSiteContainer as="section" className="pb-16">
        <SectionIntro eyebrow="Explore" title="Routes, places, and natural subjects." description="Categories make wide travel stories easier to scan without flattening the visual mood." />
        <div className="pf-stagger grid gap-6 lg:grid-cols-2">
          {visibleCategories.map((category, index) => (
            <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="rounded-[1.5rem] border-[#cbd3cd] bg-white/70 text-[#17201c]" mutedClassName="text-[#59645f]" accentClassName="text-teal-700" imageClassName="aspect-[16/10]" />
          ))}
        </div>
      </CustomerSiteContainer>
    );
  }

  return (
    <CustomerSiteContainer as="section" className="pb-16">
      <SectionIntro eyebrow="Browse by type" title="A simple way into the work." description="Visitors can start with a category, then move into the right collection or story." />
      <div className="pf-stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleCategories.map((category, index) => (
          <CategoryPreviewCard key={category.name} category={category} image={getCategoryImage(category, demo.galleries, index) ?? demo.heroImage} index={index} slug={slug} locale={locale} variant={variant} className="border-[#d7dedb] bg-white text-[#15120f]" mutedClassName="text-[#59636b]" accentClassName="text-teal-700" />
        ))}
      </div>
    </CustomerSiteContainer>
  );
}

function ContactSection({ demo, variant }: { demo: DemoData; variant: CustomerSiteThemeVariant }) {
  const tone = getThemeTone(variant);
  const isDark = variant === "cinematic" || variant === "luxury" || variant === "monochrome";
  const contactShellClass = cn(
    "pf-reveal grid gap-8 border p-6 sm:p-8 lg:items-start",
    variant === "cinematic" && "border-white/10 bg-black/80 lg:grid-cols-[0.85fr_1.15fr]",
    variant === "luxury" && "border-[rgba(216,191,136,0.28)] bg-[#171511] text-center shadow-[0_22px_80px_rgba(0,0,0,0.28)] lg:grid-cols-[0.82fr_1.18fr] lg:text-left",
    variant === "monochrome" && "border-white/10 bg-[#050505] lg:grid-cols-[0.75fr_1.25fr]",
    variant === "panorama" && "rounded-[2rem] border-[#cbd3cd] bg-white/55 shadow-[0_22px_80px_rgba(23,32,28,0.08)] lg:grid-cols-[1fr_1fr]",
    variant === "editorial" && "border-[#ddcdbf] bg-[#fbf5ec] shadow-[0_18px_50px_rgba(94,55,33,0.08)] lg:grid-cols-[1fr_1fr]",
    variant === "masonry" && "border-[#d9dfdc] bg-white lg:grid-cols-[1fr_1fr]",
    !["cinematic", "luxury", "monochrome", "panorama", "editorial", "masonry"].includes(variant) && cn("shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:grid-cols-[0.9fr_1.1fr]", tone.card)
  );

  const inputClass = cn(
    "h-12 rounded-none bg-transparent text-sm",
    isDark ? "border-white/20 text-white placeholder:text-white/40" : "border-current/10 placeholder:text-current/40",
    variant === "cinematic" && "border-white/10 text-white placeholder:text-white/30",
    variant === "luxury" && "border-[rgba(216,191,136,0.25)] text-[#fbf4e8] placeholder:text-[#d8cab8]/50",
    variant === "monochrome" && "border-white/10 text-white placeholder:text-white/30",
    variant === "editorial" && "border-[#ddcdbf] text-[#211917] placeholder:text-[#695f58]/50",
    variant === "masonry" && "border-[#d9dfdc] text-[#101418]",
    variant === "panorama" && "border-[#cbd3cd] text-[#17201c] placeholder:text-[#59645f]/50"
  );

  const headingClass = cn(
    "mt-3 font-display font-light leading-tight tracking-[-0.05em]",
    variant === "masonry" ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
    variant === "cinematic" && "text-3xl sm:text-4xl",
    variant === "luxury" && "text-3xl sm:text-4xl"
  );

  const buttonClass = cn(
    "pf-action h-12 rounded-none px-5 font-nav text-xs font-semibold uppercase tracking-[0.24em]",
    tone.button,
    variant === "cinematic" && "border-teal-300 bg-teal-300 text-black hover:bg-teal-200",
    variant === "luxury" && "border-[#d8bf88] bg-[#d8bf88] text-[#11100d] hover:bg-[#d8bf88]/80",
    variant === "monochrome" && "border-white bg-white text-black hover:bg-white/80",
    variant === "editorial" && "border-[#9a4f32] bg-[#9a4f32] text-white hover:bg-[#9a4f32]/80",
    variant === "masonry" && "border-teal-700 bg-teal-700 text-white hover:bg-teal-600",
    variant === "panorama" && "border-teal-700 bg-teal-700 text-white hover:bg-teal-600"
  );

  return (
    <section className={tone.section}>
      <div className={contactShellClass}>
        <div>
          <p className={cn("font-nav text-xs font-semibold uppercase tracking-[0.28em]", tone.accent)}>Inquiries</p>
          <h2 className={headingClass}>Start a conversation.</h2>
          <p className={cn("mt-4 max-w-2xl text-base leading-7", tone.muted)}>{demo.tagline}</p>
          <p className={cn("mt-6 text-sm leading-6", tone.muted)}>Use this form for shoot dates, gallery access, custom packages, or collaboration requests.</p>
          <div className={cn("mt-5 grid gap-2 text-sm", tone.muted)}>
            {demo.contactEmail ? <a href={`mailto:${demo.contactEmail}`} className="transition hover:opacity-70">{demo.contactEmail}</a> : null}
            {demo.contactPhone ? <a href={`tel:${demo.contactPhone.replace(/\s+/g, "")}`} className="transition hover:opacity-70">{demo.contactPhone}</a> : null}
            {demo.location ? <span>{demo.location}</span> : null}
          </div>
        </div>
        <form className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input className={inputClass} placeholder="Your name" />
            <Input className={inputClass} placeholder="Email address" />
          </div>
          <Input className={inputClass} placeholder="Shoot type or subject" />
          <Textarea className={cn("min-h-32 rounded-none bg-transparent text-sm", inputClass)} placeholder="Tell us what you want photographed" />
          <Button type="button" className={buttonClass}>
            Send inquiry
          </Button>
        </form>
      </div>
    </section>
  );
}

function LumenTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");

  return (
    <main className="bg-[#f7f0e6] text-[#15120f]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="minimal" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="minimal"
        hero={
          <section className="relative min-h-dvh overflow-hidden bg-[#15120f] text-white">
            <HeroImage demo={demo} alt="Featured portfolio cover" className="pf-hero-drift opacity-72" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,18,15,0.8),rgba(21,18,15,0.18))]" />
            <ImageWatermark className="bottom-5" />
            <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center px-5 py-20 sm:px-8 lg:px-10">
              <div className="pf-reveal max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">{demo.specialty}</p>
                <h1 className="pf-fluid-title mt-5 font-display font-light leading-none tracking-[-0.05em] sm:text-8xl">{getHeroTitle(demo)}</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">{demo.tagline}</p>
                <ThemeActions slug={slug} locale={locale} variant="minimal" />
              </div>
            </div>
          </section>
        }
        galleries={
          <CustomerSiteContainer as="section" className="py-14">
            <SectionIntro eyebrow="Featured work" title="Quiet collections with room to breathe." description="Clean image sets with soft spacing and a simple path into each story." />
            <div className="pf-stagger grid gap-5 md:grid-cols-3">
              {demo.galleries.map((gallery, index) => (
                <GalleryImage key={galleryKey(gallery, index)} gallery={gallery} className="[&>button:first-child]:aspect-[4/5] border border-[#d8d1c7] bg-[#fffaf2] p-4" />
              ))}
            </div>
          </CustomerSiteContainer>
        }
      />
    </main>
  );
}

function ArchiveTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");
  const categories = getDisplayCategories(demo, "editorial");
  const [lead, ...rest] = demo.galleries;

  return (
    <main className="bg-[#f8f1e8] text-[#211917]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="editorial" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="editorial"
        hero={
          <CustomerSiteContainer as="section" className="pb-14 pt-24">
            <div className="grid overflow-hidden border border-[#ddcdbf] bg-[#fbf5ec] lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex min-h-[480px] items-center px-6 py-14 sm:px-10 lg:min-h-[620px] lg:px-14">
                <div className="pf-reveal max-w-2xl">
                  <p className="font-nav text-xs font-semibold uppercase tracking-[0.32em] text-[#9a4f32]">{demo.specialty}</p>
                  <h1 className="mt-6 font-display text-[clamp(3.8rem,7vw,7.25rem)] font-light leading-[0.9] tracking-[-0.06em]">{getHeroTitle(demo)}</h1>
                  <p className="mt-7 max-w-lg text-base leading-8 text-[#695f58] sm:text-lg">{demo.tagline}</p>
                  <ThemeActions slug={slug} locale={locale} variant="editorial" />
                </div>
              </div>
              <div className="relative min-h-[360px] border-t border-[#ddcdbf] lg:min-h-[620px] lg:border-l lg:border-t-0">
                <HeroImage demo={demo} alt="Editorial portfolio cover" className="pf-reveal-soft" />
                <ImageWatermark className="bottom-5" />
                <div className="absolute bottom-5 left-5 bg-[#f8f1e8] px-4 py-3 font-nav text-xs font-semibold uppercase tracking-[0.24em] text-[#211917]">
                  Issue 01 / Portfolio
                </div>
              </div>
            </div>
          </CustomerSiteContainer>
        }
        galleries={
          <CustomerSiteContainer as="section" className="grid gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="pf-reveal">
              <p className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-[#9a4f32]">Lead story</p>
              <h2 className="mt-3 max-w-xl font-display text-5xl font-light tracking-[-0.06em]">Editorial rhythm for campaigns and visual essays.</h2>
              {lead ? <GalleryImage gallery={lead} className="mt-6 [&>button:first-child]:aspect-[5/4]" /> : null}
              <CategoryStack variant="editorial" galleries={demo.galleries} categories={categories} className="mt-10 border-y border-[#ddcdbf] py-6 text-[#211917]" />
            </div>
            <div className="pf-stagger space-y-10 lg:pt-28">
              {rest.map((gallery, index) => (
                <GalleryImage key={galleryKey(gallery, index)} gallery={gallery} className="[&>button:first-child]:aspect-[4/5]" />
              ))}
            </div>
          </CustomerSiteContainer>
        }
      />
    </main>
  );
}

function NoirTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");

  return (
    <main className="bg-[#090a0a] text-[#f4efe6]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="cinematic" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="cinematic"
        hero={
          <section className="relative min-h-dvh overflow-hidden">
            <HeroImage demo={demo} alt="Cinematic portfolio cover" className="pf-hero-drift opacity-82" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(69,194,181,0.18),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.32),rgba(0,0,0,0.9))]" />
            <ImageWatermark className="bottom-5" />
            <div className="relative mx-auto flex min-h-dvh max-w-6xl items-end px-5 pb-14 pt-24 sm:px-8 lg:px-10">
              <div className="pf-reveal max-w-5xl">
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.34em] text-[#45c2b5]">{demo.specialty}</p>
                <h1 className="pf-fluid-title mt-5 font-display font-light leading-none tracking-[-0.07em] sm:text-8xl">{getHeroTitle(demo)}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">{demo.tagline}</p>
                <ThemeActions slug={slug} locale={locale} variant="cinematic" />
              </div>
            </div>
          </section>
        }
        galleries={
          <CustomerSiteContainer as="section" className="py-14">
            <SectionIntro eyebrow="Film roll" title="Cinematic frames with a clear path through the story." description="A darker presentation for travel, documentary work, and mood-led sequences." dark />
            <div className="pf-stagger grid gap-4 lg:grid-cols-[1.35fr_0.8fr_1fr]">
              {demo.galleries.map((gallery, index) => (
                <GalleryImage
                  key={galleryKey(gallery, index)}
                  gallery={gallery}
                  className={cn("border border-white/10 bg-white/5 p-3 [&>button:first-child]:aspect-[16/10]", index === 1 && "lg:translate-y-12 [&>button:first-child]:aspect-[4/5]")}
                />
              ))}
            </div>
          </CustomerSiteContainer>
        }
      />
    </main>
  );
}

function ContactSheetTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");
  const openViewer = useContext(ViewerContext);
  const categories = getDisplayCategories(demo, "masonry");
  const visibleGalleries = demo.isDemo === false ? demo.galleries : [...demo.galleries, ...demo.galleries];

  return (
    <main className="bg-[#f4f2ec] text-[#101418] lg:pl-[260px]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="masonry" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="masonry"
        hero={
          <section className="px-5 pb-10 pt-28 sm:px-8 lg:px-10 lg:pt-14">
            <div className="pf-reveal grid gap-8 border-b border-[#d9dfdc] pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">{demo.specialty}</p>
                <h1 className="pf-fluid-title mt-5 font-display font-light leading-none tracking-[-0.06em] sm:text-8xl">{getHeroTitle(demo)}</h1>
                <ThemeActions slug={slug} locale={locale} variant="masonry" />
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[#5f6970]">{demo.tagline}</p>
            </div>
            <CategoryStack variant="masonry" galleries={demo.galleries} categories={categories} className="pf-stagger mt-8 grid gap-5 border-b border-[#d9dfdc] pb-8 sm:grid-cols-3 sm:space-y-0 [&>div]:border-b-0 [&>div]:pb-0 [&>div]:sm:grid-cols-1" />
          </section>
        }
        galleries={
          <section className="pf-stagger columns-1 gap-5 px-5 pb-16 pt-10 sm:columns-2 sm:px-8 lg:columns-3 lg:px-10">
            {visibleGalleries.map((gallery, index) => (
              <article key={galleryKey(gallery, index)} className="mb-5 break-inside-avoid border border-[#d9dfdc] bg-white p-3 transition-shadow duration-300 hover:shadow-[0_18px_55px_rgba(16,20,24,0.12)]">
                <button type="button" onClick={() => openViewer(gallery)} className={cn("relative block w-full overflow-hidden text-left", index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]")}>
                  <Image src={gallery.image} alt={gallery.title} fill className="object-cover" />
                  <ImageWatermark disabled={gallery.watermarkApplied} />
                </button>
                <div className="flex items-center justify-between gap-4 pt-3">
                  <h3 className="font-display text-2xl font-light tracking-[-0.05em]">{gallery.title}</h3>
                  <p className="font-nav text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700">{gallery.location}</p>
                </div>
              </article>
            ))}
          </section>
        }
      />
    </main>
  );
}

function AtelierTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");

  return (
    <main className="bg-[#11100d] text-[#fbf4e8]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="luxury" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="luxury"
        hero={
          <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-24 text-center">
            <HeroImage demo={demo} alt="Luxury portfolio cover" className="pf-hero-drift opacity-58" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,16,13,0.25),rgba(17,16,13,0.92)_68%)]" />
            <ImageWatermark className="bottom-5" />
            <div className="pf-reveal relative mx-auto max-w-5xl">
              <p className="font-nav text-xs font-semibold uppercase tracking-[0.36em] text-[#d8bf88]">{demo.specialty}</p>
              <h1 className="pf-fluid-title mt-6 font-display font-light leading-none tracking-[-0.06em] sm:text-8xl">{getHeroTitle(demo)}</h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#d8cab8]">{demo.tagline}</p>
              <ThemeActions slug={slug} locale={locale} variant="luxury" align="center" />
            </div>
          </section>
        }
        galleries={
          <CustomerSiteContainer as="section" className="py-14">
            <SectionIntro eyebrow="Curated work" title="A polished studio selection." description="A premium gallery rhythm for weddings, fashion, details, and inquiry-led browsing." dark />
            <div className="pf-stagger grid gap-5 md:grid-cols-3">
              {demo.galleries.map((gallery, index) => (
                <GalleryImage key={galleryKey(gallery, index)} gallery={gallery} className="border border-white/10 bg-[#1a1814] p-4 text-center [&>button:first-child]:aspect-[4/5]" />
              ))}
            </div>
          </CustomerSiteContainer>
        }
      />
    </main>
  );
}

function MonochromeTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");
  const categories = getDisplayCategories(demo, "monochrome");
  const [lead, second, third] = demo.galleries;

  return (
    <main className="bg-black text-white">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="monochrome" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="monochrome"
        hero={
          <section className="mx-auto grid min-h-dvh max-w-6xl gap-10 px-5 pb-14 pt-24 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10">
            <div className="pf-reveal flex flex-col justify-end border-b border-white/10 pb-8 lg:border-b-0 lg:border-r lg:pr-10">
              <p className="font-nav text-xs font-semibold uppercase tracking-[0.36em] text-white/50">{demo.specialty}</p>
              <h1 className="mt-6 max-w-2xl font-display text-[clamp(3rem,8vw,5.75rem)] font-light leading-[0.92] tracking-[-0.06em]">{getHeroTitle(demo)}</h1>
              <p className="mt-7 text-lg leading-8 text-white/60">{demo.tagline}</p>
              <ThemeActions slug={slug} locale={locale} variant="monochrome" />
              <CategoryStack variant="monochrome" galleries={demo.galleries} categories={categories} className="mt-10 text-white" />
            </div>
            <div className="pf-stagger grid content-end gap-5 lg:grid-cols-[1fr_0.72fr]">
              {lead ? <GalleryImage gallery={lead} className="lg:row-span-2 [&>button:first-child]:aspect-[4/5]" /> : null}
              {second ? <GalleryImage gallery={second} className="[&>button:first-child]:aspect-square" /> : null}
              {third ? <GalleryImage gallery={third} className="[&>button:first-child]:aspect-[5/4]" /> : null}
            </div>
          </section>
        }
      />
    </main>
  );
}

function PanoramaTheme({ slug, locale, demo }: CustomerSiteExperienceProps) {
  const reserveNavSpace = !isHomeSectionEnabled(demo, "hero");

  return (
    <main className="bg-[#e9ece6] text-[#17201c]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} variant="panorama" reserveSpace={reserveNavSpace} />
      <OrderedHomeSections
        slug={slug}
        locale={locale}
        demo={demo}
        variant="panorama"
        hero={
          <section className="relative min-h-dvh overflow-hidden">
            <HeroImage demo={demo} alt="Panoramic portfolio cover" className="pf-panorama-drift" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.66))]" />
            <ImageWatermark className="bottom-5" />
            <div className="relative mx-auto flex min-h-dvh max-w-6xl items-end px-5 pb-14 pt-24 text-white sm:px-8 lg:px-10">
              <div className="pf-reveal max-w-4xl">
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.34em] text-white/70">{demo.specialty}</p>
                <h1 className="pf-fluid-title mt-5 font-display font-light leading-none tracking-[-0.06em]">{getHeroTitle(demo)}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{demo.tagline}</p>
                <ThemeActions slug={slug} locale={locale} variant="panorama" />
              </div>
            </div>
          </section>
        }
        galleries={
          <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
            <SectionIntro eyebrow="Route gallery" title="Wide stories, organized by terrain." description="A panoramic layout for landscapes, travel routes, and open-air collections." />
            <div className="pf-stagger grid gap-5">
              {demo.galleries.map((gallery, index) => (
                <GalleryImage key={galleryKey(gallery, index)} gallery={gallery} className="rounded-[1.5rem] border border-[#cbd3cd] bg-white/70 p-3 shadow-[0_18px_50px_rgba(23,32,28,0.08)] [&>button:first-child]:aspect-[21/9] [&>button:first-child]:rounded-[1rem]" />
              ))}
            </div>
          </section>
        }
      />
    </main>
  );
}

export function CustomerSiteExperience(props: CustomerSiteExperienceProps) {
  const [viewerImages, setViewerImages] = useState<ViewerImage[]>(props.demo.galleries);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const variant = (props.demo.themeKey as CustomerSiteThemeVariant | undefined) ?? resolveCustomerSiteThemeVariant(props.slug);
  const openViewer = (image: ViewerImage, collection = props.demo.galleries) => {
    const nextImages = collection.length ? collection : [image];
    const nextIndex = nextImages.findIndex((gallery) => gallery.image === image.image && gallery.title === image.title);
    setViewerImages(nextImages);
    setViewerIndex(nextIndex >= 0 ? nextIndex : 0);
  };
  const stepViewer = (direction: "previous" | "next") => {
    setViewerIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;

      const offset = direction === "next" ? 1 : -1;
      return (currentIndex + offset + viewerImages.length) % viewerImages.length;
    });
  };

  const content =
    variant === "editorial" ? (
      <ArchiveTheme {...props} />
    ) : variant === "cinematic" ? (
      <NoirTheme {...props} />
    ) : variant === "masonry" ? (
      <ContactSheetTheme {...props} />
    ) : variant === "luxury" ? (
      <AtelierTheme {...props} />
    ) : variant === "monochrome" ? (
      <MonochromeTheme {...props} />
    ) : variant === "panorama" ? (
      <PanoramaTheme {...props} />
    ) : (
      <LumenTheme {...props} />
    );

  return (
    <CustomerNavProvider>
      <WatermarkContext.Provider value={props.demo.imageWatermark ?? null}>
        <ViewerContext.Provider value={openViewer}>
          {content}
          <PhotoViewer images={viewerImages} index={viewerIndex} onClose={() => setViewerIndex(null)} onStep={stepViewer} />
          <ScrollToTop />
        </ViewerContext.Provider>
      </WatermarkContext.Provider>
    </CustomerNavProvider>
  );
}

function ImageWatermark({ className, disabled = false }: { className?: string; disabled?: boolean }) {
  const watermark = useContext(WatermarkContext);
  return disabled ? null : <PhotoImageWatermark watermark={watermark} className={className} />;
}
