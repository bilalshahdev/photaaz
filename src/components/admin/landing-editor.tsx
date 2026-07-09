"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LayoutTemplate, ListOrdered, Loader2, Megaphone, MessageSquareText, Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AdminDragHandle } from "@/components/admin/admin-crud-ui";
import { AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { saveLandingSettings, savePlatformThemes } from "@/app/admin/actions";
import type { LocalizedString, PlatformLandingSectionKey, PlatformLandingSettings, PlatformThemeView } from "@/services/platform/platform-data";

const sectionLabels: Record<PlatformLandingSectionKey, string> = {
  hero: "Hero",
  themes: "Theme showcase",
  features: "Feature cards",
  pricing: "Pricing",
  faq: "FAQ",
  contact: "Contact",
  finalCta: "Final CTA"
};

export function LandingEditor({
  initialSettings,
  initialThemes,
  locales
}: {
  initialSettings: PlatformLandingSettings;
  initialThemes: PlatformThemeView[];
  locales: AdminLocaleOption[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [themes, setThemes] = useState(initialThemes);
  const [draggedSection, setDraggedSection] = useState<PlatformLandingSectionKey | null>(null);
  const [draggedThemeSlug, setDraggedThemeSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const orderedSectionKeys = (Object.keys(settings.sections) as PlatformLandingSectionKey[]).sort(
    (first, second) => settings.sections[first].displayOrder - settings.sections[second].displayOrder
  );
  const orderedThemes = [...themes].sort((first, second) => first.displayOrder - second.displayOrder);

  function reorderSections(activeKey: PlatformLandingSectionKey, targetKey: PlatformLandingSectionKey) {
    if (activeKey === targetKey) return;
    const currentOrder = [...orderedSectionKeys];
    const activeIndex = currentOrder.indexOf(activeKey);
    const targetIndex = currentOrder.indexOf(targetKey);
    if (activeIndex < 0 || targetIndex < 0) return;
    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeKey);
    setSettings((current) => ({
      ...current,
      sections: currentOrder.reduce(
        (sections, key, index) => ({ ...sections, [key]: { ...current.sections[key], displayOrder: index + 1 } }),
        {} as PlatformLandingSettings["sections"]
      )
    }));
  }

  function reorderThemes(activeSlug: string, targetSlug: string) {
    if (activeSlug === targetSlug) return;
    const currentOrder = orderedThemes.map((t) => t.slug);
    const activeIndex = currentOrder.indexOf(activeSlug);
    const targetIndex = currentOrder.indexOf(targetSlug);
    if (activeIndex < 0 || targetIndex < 0) return;
    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeSlug);
    setThemes((current) => current.map((t) => ({ ...t, displayOrder: currentOrder.indexOf(t.slug) + 1 })));
  }

  function save() {
    startTransition(async () => {
      try {
        await Promise.all([saveLandingSettings(settings), savePlatformThemes(themes)]);
        toast.success("Landing settings saved.");
      } catch {
        toast.error("Could not save landing settings. Check your local database connection.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Section ordering ── */}
      <AdminPanel title="Landing Sections" icon={ListOrdered}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {orderedSectionKeys.map((key, index) => (
            <div
              key={key}
              draggable
              onDragStart={() => setDraggedSection(key)}
              onDragEnd={() => setDraggedSection(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (draggedSection) reorderSections(draggedSection, key); setDraggedSection(null); }}
              className={`cursor-grab border border-slate-200 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.05)] transition active:cursor-grabbing ${
                draggedSection === key ? "border-primary bg-primary/5 opacity-70" : "hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{sectionLabels[key]}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <AdminDragHandle className="size-5 border-transparent" />
                      Drag to reorder
                    </p>
                  </div>
                </div>
                <Label className="flex items-center gap-2 text-xs text-slate-600">
                  <Checkbox
                    checked={settings.sections[key].enabled}
                    onCheckedChange={(checked) => setSettings((c) => ({ ...c, sections: { ...c.sections, [key]: { ...c.sections[key], enabled: checked === true } } }))}
                  />
                  Visible
                </Label>
              </div>
            </div>
          ))}
        </div>
        <SaveButton onClick={save} isPending={isPending} label="Save sections" />
      </AdminPanel>

      {/* ── Hero Content ── */}
      <AdminPanel title="Hero Content" icon={Megaphone}>
        <div className="grid gap-4">
          <LocalizedInput locales={locales} label="Eyebrow" value={settings.hero.eyebrow} onChange={(eyebrow) => setSettings((c) => ({ ...c, hero: { ...c.hero, eyebrow } }))} placeholder="Short label above the headline" />
          <LocalizedInput locales={locales} label="Headline" value={settings.hero.headline} onChange={(headline) => setSettings((c) => ({ ...c, hero: { ...c.hero, headline } }))} placeholder="Main heading text" />
          <LocalizedTextarea locales={locales} label="Subheadline" value={settings.hero.subheadline} onChange={(subheadline) => setSettings((c) => ({ ...c, hero: { ...c.hero, subheadline } }))} placeholder="Supporting description text" />
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedInput locales={locales} label="Primary CTA" value={settings.hero.primaryCta} onChange={(primaryCta) => setSettings((c) => ({ ...c, hero: { ...c.hero, primaryCta } }))} placeholder="Button label" />
            <LocalizedInput locales={locales} label="Secondary CTA" value={settings.hero.secondaryCta} onChange={(secondaryCta) => setSettings((c) => ({ ...c, hero: { ...c.hero, secondaryCta } }))} placeholder="Button label" />
          </div>
        </div>
        <SaveButton onClick={save} isPending={isPending} label="Save hero" />
      </AdminPanel>

      {/* ── Contact Section ── */}
      <AdminPanel title="Contact Section" icon={MessageSquareText}>
        <div className="grid gap-4 lg:grid-cols-2">
          <LocalizedInput locales={locales} label="Eyebrow" value={settings.contact.eyebrow} onChange={(eyebrow) => setSettings((c) => ({ ...c, contact: { ...c.contact, eyebrow } }))} placeholder="Short label above the headline" />
          <LocalizedInput locales={locales} label="Submit label" value={settings.contact.submitLabel} onChange={(submitLabel) => setSettings((c) => ({ ...c, contact: { ...c.contact, submitLabel } }))} placeholder="Form submit button text" />
          <LocalizedInput locales={locales} label="Title" value={settings.contact.title} onChange={(title) => setSettings((c) => ({ ...c, contact: { ...c.contact, title } }))} placeholder="Section title" />
          <LocalizedTextarea locales={locales} label="Body" value={settings.contact.body} onChange={(body) => setSettings((c) => ({ ...c, contact: { ...c.contact, body } }))} placeholder="Section description" />
        </div>
        <SaveButton onClick={save} isPending={isPending} label="Save contact" />
      </AdminPanel>

      {/* ── Theme Showcase Cards ── */}
      <AdminPanel title="Theme Showcase Cards" icon={LayoutTemplate}>
        <div className="grid gap-3 md:grid-cols-2">
          {orderedThemes.map((theme) => (
            <div
              key={theme.slug}
              draggable
              onDragStart={() => setDraggedThemeSlug(theme.slug)}
              onDragEnd={() => setDraggedThemeSlug(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (draggedThemeSlug) reorderThemes(draggedThemeSlug, theme.slug); setDraggedThemeSlug(null); }}
              className={`cursor-grab border border-slate-200 p-4 transition active:cursor-grabbing ${
                draggedThemeSlug === theme.slug ? "border-primary bg-primary/5 opacity-70" : "bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{previewText(theme.name)}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <AdminDragHandle className="size-5 border-transparent" />
                    Drag to reorder
                  </p>
                </div>
                <Label className="flex items-center gap-2 text-xs text-slate-600">
                  <Checkbox checked={theme.enabled} onCheckedChange={(checked) => setThemes((c) => c.map((t) => (t.slug === theme.slug ? { ...t, enabled: checked === true } : t)))} />
                  Visible
                </Label>
              </div>
            </div>
          ))}
        </div>
        <SaveButton onClick={save} isPending={isPending} label="Save themes" />
      </AdminPanel>

      {/* ── Feature Cards ── */}
      <AdminPanel title="Feature Cards" icon={Wand2}>
        <div className="grid gap-4">
          {settings.features.map((feature, index) => (
            <div key={`feature-${index}`} className="grid gap-3 rounded-md border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Feature {index + 1}</span>
                <Label className="flex items-center gap-2 text-xs text-slate-600">
                  <Checkbox
                    checked={feature.enabled}
                    onCheckedChange={(checked) => setSettings((c) => ({ ...c, features: c.features.map((f, i) => (i === index ? { ...f, enabled: checked === true } : f)) }))}
                  />
                  Enabled
                </Label>
              </div>
              <LocalizedInput locales={locales} label="Title" value={feature.title} onChange={(title) => setSettings((c) => ({ ...c, features: c.features.map((f, i) => (i === index ? { ...f, title } : f)) }))} placeholder="Feature title" />
              <LocalizedTextarea locales={locales} label="Body" value={feature.body} onChange={(body) => setSettings((c) => ({ ...c, features: c.features.map((f, i) => (i === index ? { ...f, body } : f)) }))} placeholder="Feature description" />
            </div>
          ))}
        </div>
        <SaveButton onClick={save} isPending={isPending} label="Save features" />
      </AdminPanel>
    </div>
  );
}

function SaveButton({ onClick, isPending, label }: { onClick: () => void; isPending: boolean; label: string }) {
  return (
    <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
      <Button type="button" onClick={onClick} disabled={isPending} className="h-11 gap-2 bg-slate-950 px-6 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
        {isPending ? "Saving\u2026" : label}
      </Button>
    </div>
  );
}

function previewText(value: LocalizedString) {
  return typeof value === "string" ? value : value.en ?? Object.values(value).find(Boolean) ?? "";
}
