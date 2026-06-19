"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useTransition, useState } from "react";
import { ExternalLink, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-ui";
import { savePlatformThemes } from "@/app/admin/actions";
import type { PlatformThemeView } from "@/services/platform/platform-data";

export function ThemesEditor({ initialThemes }: { initialThemes: PlatformThemeView[] }) {
  const [themes, setThemes] = useState(initialThemes);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePlatformThemes(themes);
        setMessage("Theme catalog saved.");
      } catch {
        setMessage("Could not save themes. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel title="Theme Inventory" icon={Palette}>
      {message ? <div className="mb-4 border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{message}</div> : null}
      <div className="mb-5 flex justify-end">
        <Button type="button" onClick={save} disabled={isPending} className="rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
          <Save className="size-4" aria-hidden="true" />
          {isPending ? "Saving" : "Save themes"}
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {themes.map((theme) => (
          <article key={theme.slug} className="grid overflow-hidden border border-slate-200 md:grid-cols-[0.4fr_0.6fr]">
            <div className="relative min-h-48">
              <Image src={theme.image} alt={theme.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <div className="grid gap-3">
                <input
                  value={theme.name}
                  onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, name: event.target.value } : item)))}
                  className="h-10 border border-slate-200 px-3 font-semibold outline-none focus:border-teal-700"
                />
                <textarea
                  value={theme.description}
                  onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, description: event.target.value } : item)))}
                  className="min-h-20 resize-y border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700"
                />
                <input
                  value={theme.seoTitle ?? ""}
                  placeholder="SEO title"
                  onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, seoTitle: event.target.value } : item)))}
                  className="h-10 border border-slate-200 px-3 text-sm outline-none focus:border-teal-700"
                />
                <textarea
                  value={theme.seoDescription ?? ""}
                  placeholder="SEO description"
                  onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, seoDescription: event.target.value } : item)))}
                  className="min-h-16 resize-y border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700"
                />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={theme.enabled} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, enabled: event.target.checked } : item)))} />
                  Enabled
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={theme.premium} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, premium: event.target.checked } : item)))} />
                  Premium
                </label>
                <label className="text-sm text-slate-500">
                  Order
                  <input type="number" min={1} value={theme.displayOrder} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, displayOrder: Number(event.target.value) } : item)))} className="mt-1 h-9 w-full border border-slate-200 px-2 text-slate-950 outline-none" />
                </label>
              </div>
              <Link href={theme.demoPath as Route} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                Open demo
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </AdminPanel>
  );
}
