"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ThemeInquiryForm } from "@/components/customer/theme-inquiry-form";
import type { CustomerSiteThemeVariant } from "@/lib/customer-theme";
import type { NewThemeKey } from "@/lib/new-themes";
import { cn } from "@/lib/utils";

type CustomerContactControlProps = {
  slug: string;
  variant: CustomerSiteThemeVariant | NewThemeKey;
  triggerClassName?: string;
  triggerLabel?: string;
};

export function CustomerContactControl({
  slug,
  variant,
  triggerClassName,
  triggerLabel = "Contact",
}: CustomerContactControlProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dark = ["cinematic", "luxury", "monochrome", "panorama"].includes(
    variant,
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  function handleContact() {
    const contactSection = document.querySelector<HTMLElement>(
      "[data-customer-contact-section]",
    );
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleContact}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>
      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/70 p-3 backdrop-blur-md sm:p-5"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${variant}-contact-title`}
            >
              <div
                className={cn(
                  "relative mx-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-hidden border p-4 sm:max-h-[calc(100dvh-2.5rem)] sm:p-6",
                  dark
                    ? "border-white/20 bg-[#0c0c0c] text-white"
                    : "border-black/15 bg-[#f8f4ed] text-[#171513]",
                  variant === "editorial" && "bg-[#f4e9dc]",
                  variant === "masonry" && "max-w-4xl bg-white",
                  variant === "luxury" &&
                    "border-[#c9a875]/40 bg-[#15120e] sm:px-9",
                  variant === "panorama" && "max-w-xl bg-[#07130f]",
                  variant === "relay" &&
                    "border-[#17211d] bg-[#f2f0e8] text-[#17211d]",
                  variant === "fieldbook" &&
                    "max-w-2xl border-[#26322b]/40 bg-[#ede6d5] text-[#26322b]",
                  variant === "kaleido" &&
                    "max-w-2xl rounded-[2rem] border-2 border-[#232136] bg-[#f6f2e7] text-[#232136]",
                  variant === "proscenium" &&
                    "border-[#d44b3e]/55 bg-[#120f15] text-[#f1e9dc]",
                  variant === "cartograph" &&
                    "max-w-2xl border-[#6f9484] bg-[#dfe7df] text-[#10271f]",
                  variant === "vitrine" &&
                    "max-w-2xl border-[#9b8d76] bg-[#e7e2d8] text-[#26221e]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 flex size-9 items-center justify-center border border-current/20 sm:right-6 sm:top-6"
                  aria-label="Close contact form"
                >
                  <X className="size-5" />
                </button>
                <p className="pr-12 font-nav text-[10px] font-semibold uppercase tracking-[0.26em] opacity-55">
                  Contact
                </p>
                <h2
                  id={`${variant}-contact-title`}
                  className={cn(
                    "mt-2 max-w-[85%] font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-[-0.06em]",
                    variant === "masonry" && "font-black uppercase",
                    variant === "cinematic" && "uppercase",
                  )}
                >
                  Start a conversation.
                </h2>
                <ThemeInquiryForm
                  slug={slug}
                  variant={variant}
                  className="mt-5"
                  compact
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
