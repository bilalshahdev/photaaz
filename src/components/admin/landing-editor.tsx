"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, LayoutTemplate, ListOrdered, Megaphone, MessageSquareText, Save, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AdminDragHandle, AdminStatusMessage } from "@/components/admin/admin-crud-ui";
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
  const [message, setMessage] = useState("");
  const [draggedSection, setDraggedSection] = useState<PlatformLandingSectionKey | null>(null);
  const [draggedThemeSlug, setDraggedThemeSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const orderedSectionKeys = (Object.keys(settings.sections) as PlatformLandingSectionKey[]).sort(
    (first, second) => settings.sections[first].displayOrder - settings.sections[second].displayOrder
  );
  const orderedThemes = [...themes].sort((first, second) => first.displayOrder - second.displayOrder);

  function reorderSections(activeKey: PlatformLandingSectionKey, targetKey: PlatformLandingSectionKey) {
    if (activeKey === targetKey) {
      return;
    }

    const currentOrder = [...orderedSectionKeys];
    const activeIndex = currentOrder.indexOf(activeKey);
    const targetIndex = currentOrder.indexOf(targetKey);

    if (activeIndex < 0 || targetIndex < 0) {
      return;
    }

    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeKey);

    setSettings((current) => ({
      ...current,
      sections: currentOrder.reduce(
        (sections, key, index) => ({
          ...sections,
          [key]: {
            ...current.sections[key],
            displayOrder: index + 1
          }
        }),
        {} as PlatformLandingSettings["sections"]
      )
    }));
  }

  function reorderThemes(activeSlug: string, targetSlug: string) {
    if (activeSlug === targetSlug) {
      return;
    }

    const currentOrder = orderedThemes.map((theme) => theme.slug);
    const activeIndex = currentOrder.indexOf(activeSlug);
    const targetIndex = currentOrder.indexOf(targetSlug);

    if (activeIndex < 0 || targetIndex < 0) {
      return;
    }

    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeSlug);

    setThemes((current) =>
      current.map((theme) => ({
        ...theme,
        displayOrder: currentOrder.indexOf(theme.slug) + 1
      }))
    );
  }

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await Promise.all([saveLandingSettings(settings), savePlatformThemes(themes)]);
        setMessage("Landing settings saved.");
      } catch {
        setMessage("Could not save landing settings. Check your local database connection.");
      }
    });
  }

  return (
    <>
      {message ? <AdminStatusMessage className="mb-6">{message}</AdminStatusMessage> : null}

      <section className="mb-6">
        <AdminPanel title="Landing Sections" icon={ListOrdered}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {orderedSectionKeys.map((key, index) => (
              <div
                key={key}
                draggable
                onDragStart={() => setDraggedSection(key)}
                onDragEnd={() => setDraggedSection(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedSection) {
                    reorderSections(draggedSection, key);
                  }
                  setDraggedSection(null);
                }}
                className={`cursor-grab border border-slate-200 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.05)] transition active:cursor-grabbing ${
                  draggedSection === key ? "border-teal-500 bg-teal-50/40 opacity-70" : "hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                      {index + 1}
                    </span>
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
                      onCheckedChange={(checked) =>
                        setSettings((current) => ({
                          ...current,
                          sections: {
                            ...current.sections,
                            [key]: {
                              ...current.sections[key],
                              enabled: checked === true
                            }
                          }
                        }))
                      }
                    />
                    Visible
                  </Label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end border-t border-slate-200 pt-5">
            <Button type="button" onClick={save} disabled={isPending} className="bg-slate-950 text-white hover:bg-teal-800">
              <Save className="size-4" aria-hidden="true" />
              {isPending ? "Saving" : "Save Sections"}
            </Button>
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-6">
        <AdminPanel title="Hero Content" icon={Megaphone}>
          <div className="grid gap-4">
            <LocalizedInput locales={locales} label="Eyebrow" value={settings.hero.eyebrow} onChange={(eyebrow) => setSettings((current) => ({ ...current, hero: { ...current.hero, eyebrow } }))} />
            <LocalizedInput locales={locales} label="Headline" value={settings.hero.headline} onChange={(headline) => setSettings((current) => ({ ...current, hero: { ...current.hero, headline } }))} />
            <LocalizedTextarea locales={locales} label="Subheadline" value={settings.hero.subheadline} onChange={(subheadline) => setSettings((current) => ({ ...current, hero: { ...current.hero, subheadline } }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <LocalizedInput locales={locales} label="Primary CTA" value={settings.hero.primaryCta} onChange={(primaryCta) => setSettings((current) => ({ ...current, hero: { ...current.hero, primaryCta } }))} />
              <LocalizedInput locales={locales} label="Secondary CTA" value={settings.hero.secondaryCta} onChange={(secondaryCta) => setSettings((current) => ({ ...current, hero: { ...current.hero, secondaryCta } }))} />
            </div>
            <Button type="button" onClick={save} disabled={isPending} className="w-fit rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
              <Save className="size-4" aria-hidden="true" />
              {isPending ? "Saving" : "Save landing"}
            </Button>
          </div>
        </AdminPanel>
      </section>

      <section className="mt-6">
        <AdminPanel title="Contact Section" icon={MessageSquareText}>
          <div className="grid gap-4 lg:grid-cols-2">
            <LocalizedInput locales={locales} label="Eyebrow" value={settings.contact.eyebrow} onChange={(eyebrow) => setSettings((current) => ({ ...current, contact: { ...current.contact, eyebrow } }))} />
            <LocalizedInput locales={locales} label="Submit label" value={settings.contact.submitLabel} onChange={(submitLabel) => setSettings((current) => ({ ...current, contact: { ...current.contact, submitLabel } }))} />
            <LocalizedInput locales={locales} label="Title" value={settings.contact.title} onChange={(title) => setSettings((current) => ({ ...current, contact: { ...current.contact, title } }))} />
            <LocalizedTextarea locales={locales} label="Body" value={settings.contact.body} onChange={(body) => setSettings((current) => ({ ...current, contact: { ...current.contact, body } }))} />
          </div>
        </AdminPanel>
      </section>

      <section className="mt-6 grid gap-6">
        <AdminPanel title="Theme Showcase Cards" icon={LayoutTemplate}>
          <div className="grid gap-3 md:grid-cols-2">
            {orderedThemes.map((theme) => (
              <div
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
                className={`cursor-grab border border-slate-200 p-4 transition active:cursor-grabbing ${
                  draggedThemeSlug === theme.slug ? "border-teal-500 bg-teal-50/40 opacity-70" : "bg-white hover:border-slate-300"
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
                    <Checkbox checked={theme.enabled} onCheckedChange={(checked) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, enabled: checked === true } : item)))} />
                    Visible
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Feature Cards" icon={Wand2}>
          <div className="grid gap-3">
            {settings.features.map((feature, index) => (
              <div key={`feature-${index}`} className="border border-slate-200 p-4">
                <CheckCircle2 className="size-4 text-teal-700" aria-hidden="true" />
                <LocalizedInput locales={locales} label="Title" value={feature.title} onChange={(title) => setSettings((current) => ({ ...current, features: current.features.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)) }))} />
                <LocalizedTextarea locales={locales} label="Body" value={feature.body} onChange={(body) => setSettings((current) => ({ ...current, features: current.features.map((item, itemIndex) => (itemIndex === index ? { ...item, body } : item)) }))} />
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>
    </>
  );
}

function previewText(value: LocalizedString) {
  return typeof value === "string" ? value : value.en ?? Object.values(value).find(Boolean) ?? "";
}
