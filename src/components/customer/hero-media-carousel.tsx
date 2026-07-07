"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HeroMediaSlide = {
  image: string;
  href?: string;
  label?: string;
};

type HeroMediaCarouselProps = {
  slides: HeroMediaSlide[];
  alt: string;
  className?: string;
  intervalMs?: number;
  showIndicators?: boolean;
};

export function HeroMediaCarousel({ slides, alt, className, intervalMs = 5200, showIndicators = true }: HeroMediaCarouselProps) {
  const validSlides = slides.filter((slide) => slide.image);
  const slideCountRef = useRef(validSlides.length);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    slideCountRef.current = validSlides.length;
    setActiveIndex((current) => (validSlides.length ? current % validSlides.length : 0));
  }, [validSlides.length]);

  useEffect(() => {
    if (slideCountRef.current <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const slideCount = slideCountRef.current;
        return slideCount > 1 ? (current + 1) % slideCount : current;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs]);

  if (!validSlides.length) {
    return null;
  }

  return (
    <>
      {validSlides.map((slide, index) => {
        const isActive = index === activeIndex;
        const image = (
          <Image
            src={slide.image}
            alt={slide.label ?? alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={cn("object-cover", className)}
          />
        );

        return slide.href ? (
          <SlideLink key={`${slide.image}-${index}`} href={slide.href} active={isActive} label={slide.label ?? alt}>
            {image}
          </SlideLink>
        ) : (
          <div
            key={`${slide.image}-${index}`}
            className={cn("absolute inset-0 transition-opacity duration-1000", isActive ? "pointer-events-auto" : "pointer-events-none")}
            style={{ opacity: isActive ? 1 : 0 }}
            aria-hidden={!isActive}
          >
            {image}
          </div>
        );
      })}

      {showIndicators && validSlides.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {validSlides.map((slide, index) => (
            <button
              key={`${slide.image}-indicator-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn("h-1.5 rounded-full bg-white/50 transition-all hover:bg-white", index === activeIndex ? "w-8 bg-white" : "w-2.5")}
              aria-label={`Show hero image ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

function SlideLink({ href, active, label, children }: { href: string; active: boolean; label: string; children: ReactNode }) {
  const className = cn("absolute inset-0 transition-opacity duration-1000", active ? "pointer-events-auto" : "pointer-events-none");
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} className={className} style={{ opacity: active ? 1 : 0 }} aria-label={label} aria-hidden={!active}>
      {children}
    </a>
  );
}
