"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { VelvetInquiryForm } from "@/components/customer/velvet-inquiry-form";
import { cn } from "@/lib/utils";

export type VelvetNavLink = readonly [label: string, href: string];

type VelvetSiteControlsProps = {
  slug: string;
  links: readonly VelvetNavLink[];
};

const contactEvent = "velvet:contact";

function VelvetNavItems({ links }: { links: readonly VelvetNavLink[] }) {
  const pathname = usePathname();

  return links.map(([label, href]) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={label}
        href={href as never}
        aria-current={active ? "page" : undefined}
        className={cn(
          "border-b-2 py-2 transition-colors",
          active
            ? "border-[#d2262e] text-[#ef5559]"
            : "border-transparent hover:text-[#ef5559]",
        )}
      >
        {label}
      </Link>
    );
  });
}

export function VelvetSiteControls({ slug, links }: VelvetSiteControlsProps) {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const showContact = () => setContactOpen(true);
    window.addEventListener(contactEvent, showContact);
    return () => window.removeEventListener(contactEvent, showContact);
  }, []);

  useEffect(() => {
    if (!contactOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [contactOpen]);

  return (
    <>
      <nav className="hidden items-center justify-center gap-7 font-sans text-[9px] font-bold uppercase tracking-[0.2em] lg:flex">
        <VelvetNavItems links={links} />
      </nav>
      <VelvetContactTrigger className="hidden bg-white px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-black hover:bg-[#c52328] hover:text-white lg:block" />
      <details className="relative justify-self-end lg:hidden">
        <summary className="cursor-pointer list-none border border-white/40 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em]">
          Menu
        </summary>
        <nav className="absolute right-0 top-[calc(100%+12px)] grid w-64 gap-4 border border-white/20 bg-[#0b0b0b] p-6 font-sans text-xs font-bold uppercase tracking-[0.18em] shadow-2xl">
          <VelvetNavItems links={links} />
          <VelvetContactTrigger className="text-left text-[#ef5559]" />
        </nav>
      </details>

      {contactOpen ? (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 p-4 text-white backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="velvet-contact-title"
        >
          <div className="mx-auto max-w-3xl border border-white/20 bg-[#101010] p-6 sm:p-10">
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="ml-auto flex size-11 items-center justify-center border border-white/20"
              aria-label="Close contact form"
            >
              <X className="size-5" />
            </button>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ef5559]">
              Contact
            </p>
            <h2
              id="velvet-contact-title"
              className="mt-4 font-display text-5xl font-black uppercase tracking-[-0.06em]"
            >
              Start an inquiry.
            </h2>
            <VelvetInquiryForm slug={slug} className="mt-8" />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function VelvetContactTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(contactEvent))}
    >
      Contact
    </button>
  );
}
