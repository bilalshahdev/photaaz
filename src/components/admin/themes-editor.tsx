"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useState, useTransition } from "react";
import { Edit3, ExternalLink, Loader2, Palette, Save } from "lucide-react";
import { toast } from "sonner";
import { savePlatformTheme, savePlatformThemes } from "@/app/admin/actions";
import {
  AdminDragHandle,
  AdminRecordCard,
  AdminRecordGrid,
  AdminStatusPill
} from "@/components/admin/admin-crud-ui";
import { AdminIconLink, AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, LocalizedStringList, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { planGateOptions, themeCustomizationKeys, themeCustomizationLabels, type ThemeCustomizationKey } from "@/config/theme-customization";
import type { LocalizedString, PlatformThemeView } from "@/services/platform/platform-data";

export function ThemesEditor({ initialThemes }: { initialThemes: PlatformThemeView[] }) {
  const [themes, setThemes] = useState(initialThemes);
  const [draggedThemeSlug, setDraggedThemeSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const orderedThemes = [...themes].sort((first, second) => first.displayOrder - second.displayOrder);

  function reorderThemes(activeSlug: string, targetSlug: string) {
    if (activeSlug === targetSlug) return;

    const currentOrder = orderedThemes.map((theme) => theme.slug);
    const activeIndex = currentOrder.indexOf(activeSlug);
    const targetIndex = currentOrder.indexOf(targetSlug);

    if (activeIndex < 0 || targetIndex < 0) return;

    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeSlug);

    setThemes((current) =>
      current.map((theme) => ({
        ...theme,
        displayOrder: currentOrder.indexOf(theme.slug) + 1
      }))
    );
  }

  function saveOrder() {
    startTransition(async () => {
      try {
        await savePlatformThemes(themes);
        toast.success("Theme order saved.");
      } catch {
        toast.error("Could not save theme order. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel
      title="Theme Catalog"
      icon={Palette}
    >
      <AdminRecordGrid>
        {orderedThemes.map((theme) => {
          const themeName = previewText(theme.name);
          const themeDescription = previewText(theme.description);

          return (
            <AdminRecordCard
              key={theme.slug}
              draggable
              onDragStart={() => setDraggedThemeSlug(theme.slug)}
              onDragEnd={() => setDraggedThemeSlug(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedThemeSlug) {
                  reorderThemes(draggedThemeSlug, theme.slug);
                }
                setDraggedThemeSlug(null);
              }}
              className={`overflow-hidden p-0 ${draggedThemeSlug === theme.slug ? "border-primary bg-primary/5 opacity-70" : "hover:border-slate-400"}`}
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image src={theme.image} alt={themeName} fill unoptimized className="object-cover" />
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{themeName}</h2>
                    <p className="mt-1 font-mono text-xs text-slate-500">{theme.slug}</p>
                  </div>
                  <AdminDragHandle className="size-9 shrink-0" />
                </div>
                <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{themeDescription}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                  <AdminStatusPill active={theme.enabled} activeLabel="Live" inactiveLabel="Hidden" />
                  {theme.premium ? <span className="rounded-full bg-slate-950 px-2.5 py-1 text-white">Premium</span> : null}
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                  <AdminIconLink href={theme.demoPath as Route} icon={ExternalLink} label={`Open ${themeName} demo`} tooltip="Open public demo" />
                  <AdminIconLink href={`/admin/themes/${theme.slug}` as Route} icon={Edit3} label={`Edit ${themeName}`} tooltip="Edit theme" tone="solid" />
                </div>
              </div>
            </AdminRecordCard>
          );
        })}
      </AdminRecordGrid>
      <div className="sticky bottom-4 z-20 flex justify-end">
        <Button type="button" onClick={saveOrder} disabled={isPending} className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
          {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
          {isPending ? "Saving\u2026" : "Save order"}
        </Button>
      </div>
    </AdminPanel>
  );
}

export function ThemeDetailEditor({ initialTheme, locales }: { initialTheme: PlatformThemeView; locales: AdminLocaleOption[] }) {
  const [theme, setTheme] = useState(initialTheme);
  const [isPending, startTransition] = useTransition();

  function updateTheme(nextTheme: Partial<PlatformThemeView>) {
    setTheme((current) => ({ ...current, ...nextTheme }));
  }

  function updateThemeCustomization(key: ThemeCustomizationKey, field: "allowed" | "minPlan", value: boolean | string) {
    setTheme((current) => ({
      ...current,
      customization: {
        ...current.customization,
        [field]: {
          ...current.customization[field],
          [key]: value
        }
      }
    }));
  }

  function save() {
    startTransition(async () => {
      try {
        await savePlatformTheme(theme);
        toast.success("Theme saved.");
      } catch {
        toast.error("Could not save theme. Check the fields and try again.");
      }
    });
  }

  const themeName = previewText(theme.name);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]">
      <div className="space-y-6">
        <AdminPanel
          title="Theme Details"
          icon={Palette}
        >
          <div className="grid gap-5">
            <LocalizedInput locales={locales} label="Name" placeholder="Theme name" value={theme.name} onChange={(name) => updateTheme({ name })} />
            <LocalizedTextarea locales={locales} label="Description" placeholder="What makes this theme unique" value={theme.description} onChange={(description) => updateTheme({ description })} />
            <LocalizedStringList locales={locales} label="Features" placeholder="Theme feature" value={theme.features} onChange={(features) => updateTheme({ features })} />
            <LocalizedInput locales={locales} label="SEO title" placeholder="SEO page title" value={theme.seoTitle ?? ""} onChange={(seoTitle) => updateTheme({ seoTitle })} />
            <LocalizedTextarea locales={locales} label="SEO description" placeholder="SEO meta description" value={theme.seoDescription ?? ""} onChange={(seoDescription) => updateTheme({ seoDescription })} />
          </div>
        </AdminPanel>

        <AdminPanel title="Theme Controls" icon={Palette}>
          <div className="grid gap-4 md:grid-cols-2">
            <ReadOnlyField label="Slug" value={theme.slug} />
            <AdminTextInput label="Icon key" value={theme.iconKey} onChange={(iconKey) => updateTheme({ iconKey })} placeholder="palette" />
            <AdminTextInput label="Preview image URL" value={theme.image} onChange={(image) => updateTheme({ image })} placeholder="https://..." />
            <AdminTextInput label="Live demo route" value={theme.demoPath} onChange={(demoPath) => updateTheme({ demoPath })} placeholder="/themes/demo" />
            <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Checkbox checked={theme.enabled} onCheckedChange={(checked) => updateTheme({ enabled: checked === true })} />
              Enabled
            </Label>
            <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Checkbox checked={theme.premium} onCheckedChange={(checked) => updateTheme({ premium: checked === true })} />
              Premium
            </Label>
          </div>
        </AdminPanel>

        <AdminPanel title="Customization Gates" icon={Palette}>
          <div className="grid gap-3">
            {themeCustomizationKeys.map((key) => (
              <div key={key} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_140px] sm:items-center">
                <Label className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <Checkbox checked={theme.customization.allowed[key]} onCheckedChange={(checked) => updateThemeCustomization(key, "allowed", checked === true)} />
                  {themeCustomizationLabels[key]}
                </Label>
                <Select
                  value={theme.customization.minPlan[key]}
                  onValueChange={(value) => updateThemeCustomization(key, "minPlan", value)}
                >
                  <SelectTrigger className="h-10 bg-white capitalize" aria-label={`${themeCustomizationLabels[key]} minimum plan`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {planGateOptions.map((plan) => (
                      <SelectItem key={plan} value={plan} className="capitalize">
                        {plan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </AdminPanel>
        <div className="sticky bottom-4 z-20 flex justify-end">
          <Button type="button" onClick={save} disabled={isPending} className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {isPending ? "Saving\u2026" : "Save theme"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <AdminPanel title="Preview" icon={Palette}>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="relative aspect-[16/10] bg-slate-100">
              <Image src={theme.image} alt={themeName} fill unoptimized className="object-cover" />
            </div>
            <div className="p-4">
              <p className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{themeName}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{theme.slug}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={theme.demoPath as Route} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                  Open demo
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
                <Link href={`/themes/${theme.slug}` as Route} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary">
                  Public page
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function AdminTextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <Label className="text-sm font-medium text-slate-700">
      {label}
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-11 bg-white" />
    </Label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Label className="text-sm font-medium text-slate-700">
      {label}
      <Input value={value} readOnly className="mt-2 h-11 bg-slate-50 text-slate-500" />
    </Label>
  );
}

function previewText(value: LocalizedString) {
  return typeof value === "string" ? value : value.en ?? Object.values(value).find(Boolean) ?? "";
}
