"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, Camera, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FallbackScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onPrimaryAction?: () => void;
  isLoading?: boolean;
  className?: string;
};

export function FallbackScreen({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  onPrimaryAction,
  isLoading = false,
  className
}: FallbackScreenProps) {
  return (
    <main
      className={cn(
        "relative h-dvh min-h-dvh overflow-hidden bg-[#0f1417] text-white",
        "selection:bg-teal-300 selection:text-[#0f1417]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

      <section className="relative mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <Link href={"/" as Route} className="flex items-center gap-3 text-lg font-black">
            <span className="flex size-10 items-center justify-center border border-white/20 bg-white/10">
              <Camera className="size-5" />
            </span>
            Photaaz
          </Link>
          <span className="hidden text-xs font-bold uppercase tracking-[0.32em] text-teal-200 sm:inline">
            Portfolio SaaS
          </span>
        </header>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-teal-200">{eyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{description}</p>

            {(primaryLabel || secondaryLabel) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primaryLabel && onPrimaryAction ? (
                  <Button onClick={onPrimaryAction} className="h-12 rounded-none bg-white px-6 text-[#0f1417] hover:bg-teal-100">
                    <RefreshCw className="size-4" />
                    {primaryLabel}
                  </Button>
                ) : null}

                {primaryLabel && primaryHref ? (
                  <Button asChild className="h-12 rounded-none bg-white px-6 text-[#0f1417] hover:bg-teal-100">
                    <Link href={primaryHref as Route}>
                      <Home className="size-4" />
                      {primaryLabel}
                    </Link>
                  </Button>
                ) : null}

                {secondaryLabel && secondaryHref ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-none border-white/25 bg-transparent px-6 text-white hover:bg-white/10"
                  >
                    <Link href={secondaryHref as Route}>
                      <ArrowLeft className="size-4" />
                      {secondaryLabel}
                    </Link>
                  </Button>
                ) : null}
              </div>
            )}
          </div>

          <div className="hidden border border-white/12 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 backdrop-blur lg:block">
            <div className="grid aspect-[4/5] grid-cols-3 grid-rows-4 gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "border border-white/10 bg-white/[0.06]",
                    index % 4 === 0 && "row-span-2",
                    index % 5 === 0 && "bg-teal-300/20",
                    isLoading && "animate-pulse"
                  )}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.28em] text-white/45">
              <span>Photaaz</span>
              <span>{isLoading ? "Loading" : "Fallback"}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
