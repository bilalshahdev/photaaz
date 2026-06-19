"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Crown, LayoutTemplate, MonitorSmartphone } from "lucide-react";
import { themes, type ThemeConfig } from "@/config/themes";
import { cn } from "@/lib/utils";

function DevicePreview({ theme }: { theme: ThemeConfig }) {
  const isDark = theme.key === "cinematic" || theme.key === "luxury";
  const accent = theme.palette[2];

  return (
    <div className={cn("overflow-hidden rounded-lg border shadow-2xl", isDark ? "border-white/12 bg-[#101418] text-white" : "border-black/10 bg-[#f8f4eb] text-[#15120f]")}>
      <div className="flex items-center justify-between border-b border-current/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-yellow-400" />
          <span className="size-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-xs opacity-55">demo.photofolio.site</span>
      </div>
      <div className={cn("grid min-h-[560px] gap-0 lg:grid-cols-[0.86fr_1fr]", theme.defaultSettings.navbarStyle === "sidebar" && "lg:grid-cols-[220px_1fr]")}>
        {theme.defaultSettings.navbarStyle === "sidebar" ? (
          <aside className="hidden border-r border-current/10 p-5 lg:block">
            <p className="font-display text-2xl font-black tracking-[-0.04em]">{theme.name}</p>
            <div className="mt-10 space-y-3 text-sm opacity-65">
              <p>Work</p>
              <p>Journal</p>
              <p>Contact</p>
            </div>
          </aside>
        ) : null}
        <section className="relative min-h-[360px] overflow-hidden">
          <Image src={theme.previewImage} alt={`${theme.name} theme preview`} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-full bg-black/22 px-4 py-2 text-white backdrop-blur">
            <span className="font-display text-xl font-black tracking-[-0.04em]">{theme.name}</span>
            <span className="text-xs uppercase tracking-[0.2em]">Portfolio</span>
          </div>
          <div className="absolute bottom-6 left-6 max-w-md text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/62">{theme.mood}</p>
            <h2 className="mt-3 font-display text-5xl font-black leading-none tracking-[-0.05em]">Visual stories with a signature.</h2>
          </div>
        </section>
        <section className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-55">Theme layout</p>
            <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: accent }}>
              {theme.premium ? "Premium" : "Free"}
            </span>
          </div>
          <div className={cn("mt-6 grid gap-3", theme.defaultSettings.galleryStyle === "masonry" ? "grid-cols-2" : "grid-cols-3")}>
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={cn("rounded-md bg-current/10", theme.defaultSettings.galleryStyle === "masonry" && item % 3 === 0 ? "h-36" : "h-24")}
              />
            ))}
          </div>
          <div className="mt-6 rounded-md border border-current/10 p-4">
            <p className="font-display text-2xl font-black tracking-[-0.04em]">About the frame</p>
            <p className="mt-2 text-sm leading-6 opacity-66">{theme.description}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ThemePreviewStudio({ initialThemeKey = themes[0].key }: { initialThemeKey?: string }) {
  const initialTheme = themes.find((theme) => theme.key === initialThemeKey) ?? themes[0];
  const [activeKey, setActiveKey] = useState(initialTheme.key);
  const activeTheme = useMemo(() => themes.find((theme) => theme.key === activeKey) ?? themes[0], [activeKey]);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <aside className="space-y-3">
        {themes.map((theme) => (
          <button
            key={theme.key}
            type="button"
            onClick={() => setActiveKey(theme.key)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition",
              activeKey === theme.key
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-2xl font-black tracking-[-0.04em]">{theme.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-60">{theme.mood}</p>
              </div>
              {activeKey === theme.key ? <Check className="size-5" aria-hidden="true" /> : theme.premium ? <Crown className="size-5 opacity-50" aria-hidden="true" /> : null}
            </div>
            <div className="mt-4 flex gap-1.5">
              {theme.palette.map((color) => (
                <span key={color} className="size-5 rounded-full border border-black/10" style={{ backgroundColor: color }} />
              ))}
            </div>
          </button>
        ))}
      </aside>
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Live theme preview</p>
            <h2 className="mt-1 font-display text-4xl font-black tracking-[-0.04em]">{activeTheme.name}</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
            <MonitorSmartphone className="size-4 text-accent" aria-hidden="true" />
            Responsive preview
          </div>
        </div>
        <DevicePreview theme={activeTheme} />
      </section>
    </div>
  );
}
