"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  LayoutTemplate,
  ListOrdered,
  Loader2,
  Megaphone,
  MessageSquareText,
  Save,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AdminDragHandle } from "@/components/admin/admin-crud-ui";
import { AdminPanel } from "@/components/admin/admin-ui";
import {
  LocalizedInput,
  LocalizedTextarea,
  type AdminLocaleOption,
} from "@/components/admin/localized-fields";
import { saveLandingSettings, savePlatformThemes } from "@/app/admin/actions";
import type {
  LocalizedString,
  PlatformLandingSectionKey,
  PlatformLandingSettings,
  PlatformThemeView,
} from "@/services/platform/platform-data";
import {
  brandFontKeys,
  brandFontLabels,
  type BrandFont,
} from "@/lib/brand-fonts";

const sectionLabels: Record<PlatformLandingSectionKey, string> = {
  hero: "Hero",
  themes: "Theme showcase",
  features: "Feature cards",
  pricing: "Pricing",
  faq: "FAQ",
  contact: "Contact",
  finalCta: "Final CTA",
};

export function LandingEditor({
  initialSettings,
  initialThemes,
  locales,
}: {
  initialSettings: PlatformLandingSettings;
  initialThemes: PlatformThemeView[];
  locales: AdminLocaleOption[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [themes, setThemes] = useState(initialThemes);
  const [draggedSection, setDraggedSection] =
    useState<PlatformLandingSectionKey | null>(null);
  const [draggedThemeSlug, setDraggedThemeSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);
  const orderedSectionKeys = (
    Object.keys(settings.sections) as PlatformLandingSectionKey[]
  ).sort(
    (first, second) =>
      settings.sections[first].displayOrder -
      settings.sections[second].displayOrder,
  );
  const orderedThemes = [...themes].sort(
    (first, second) => first.displayOrder - second.displayOrder,
  );

  function reorderSections(
    activeKey: PlatformLandingSectionKey,
    targetKey: PlatformLandingSectionKey,
  ) {
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
        (sections, key, index) => ({
          ...sections,
          [key]: { ...current.sections[key], displayOrder: index + 1 },
        }),
        {} as PlatformLandingSettings["sections"],
      ),
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
    setThemes((current) =>
      current.map((t) => ({
        ...t,
        displayOrder: currentOrder.indexOf(t.slug) + 1,
      })),
    );
  }

  function save() {
    startTransition(async () => {
      try {
        await Promise.all([
          saveLandingSettings(settings),
          savePlatformThemes(themes),
        ]);
        toast.success("Landing settings saved.");
      } catch {
        toast.error(
          "Could not save landing settings. Check your local database connection.",
        );
      }
    });
  }

  async function uploadHeroImage(file: File, slideId: string) {
    setUploadingSlideId(slideId);
    try {
      const response = await fetch("/api/admin/uploads/cloudinary/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      });
      const authorization = await response.json();
      if (!response.ok)
        throw new Error(authorization.error || "Upload authorization failed.");
      const upload = new FormData();
      upload.append("file", file);
      upload.append("api_key", authorization.apiKey);
      upload.append("folder", authorization.folder);
      upload.append("public_id", authorization.publicId);
      upload.append("timestamp", String(authorization.timestamp));
      upload.append("signature", authorization.signature);
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${authorization.cloudName}/image/upload`,
        { method: "POST", body: upload },
      );
      const result = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok)
        throw new Error(result.error?.message || "Cloudinary upload failed.");
      setSettings((current) => ({
        ...current,
        hero: {
          ...current.hero,
          slides: current.hero.slides.map((slide) =>
            slide.id === slideId
              ? { ...slide, image: result.secure_url }
              : slide,
          ),
        },
      }));
      toast.success("Hero image uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Hero upload failed.",
      );
    } finally {
      setUploadingSlideId(null);
    }
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
              onDrop={(e) => {
                e.preventDefault();
                if (draggedSection) reorderSections(draggedSection, key);
                setDraggedSection(null);
              }}
              className={`cursor-grab border border-slate-200 bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.05)] transition active:cursor-grabbing ${
                draggedSection === key
                  ? "border-primary bg-primary/5 opacity-70"
                  : "hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {sectionLabels[key]}
                    </p>
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
                      setSettings((c) => ({
                        ...c,
                        sections: {
                          ...c.sections,
                          [key]: {
                            ...c.sections[key],
                            enabled: checked === true,
                          },
                        },
                      }))
                    }
                  />
                  Visible
                </Label>
              </div>
            </div>
          ))}
        </div>
        <SaveButton
          onClick={save}
          isPending={isPending}
          label="Save sections"
        />
      </AdminPanel>

      {/* ── Hero Content ── */}
      <AdminPanel title="Hero Content" icon={Megaphone}>
        <div className="grid gap-4">
          <LocalizedInput
            locales={locales}
            label="Headline"
            value={settings.hero.headline}
            onChange={(headline) =>
              setSettings((c) => ({ ...c, hero: { ...c.hero, headline } }))
            }
            placeholder="Main heading text"
          />
          <LocalizedTextarea
            locales={locales}
            label="Subheadline"
            value={settings.hero.subheadline}
            onChange={(subheadline) =>
              setSettings((c) => ({ ...c, hero: { ...c.hero, subheadline } }))
            }
            placeholder="Supporting description text"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-1.5">
              <Label>Headline font</Label>
              <select
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                value={settings.hero.headlineFont}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      headlineFont: event.target.value as BrandFont,
                    },
                  }))
                }
              >
                {brandFontKeys.map((font) => (
                  <option key={font} value={font}>
                    {brandFontLabels[font]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label>Headline size (px)</Label>
              <input
                type="number"
                min={48}
                max={120}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                value={settings.hero.headlineSize}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      headlineSize: Number(event.target.value),
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Headline color</Label>
              <input
                type="color"
                className="h-11 w-full rounded-md border border-slate-300 bg-white p-1"
                value={settings.hero.headlineColor}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      headlineColor: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Slide duration (seconds)</Label>
              <input
                type="number"
                min={3}
                max={30}
                className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                value={settings.hero.carouselIntervalSeconds}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      carouselIntervalSeconds: Number(event.target.value),
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <LocalizedInput
              locales={locales}
              label="Primary CTA"
              value={settings.hero.primaryCta}
              onChange={(primaryCta) =>
                setSettings((c) => ({ ...c, hero: { ...c.hero, primaryCta } }))
              }
              placeholder="Button label"
            />
            <LocalizedInput
              locales={locales}
              label="Secondary CTA"
              value={settings.hero.secondaryCta}
              onChange={(secondaryCta) =>
                setSettings((c) => ({
                  ...c,
                  hero: { ...c.hero, secondaryCta },
                }))
              }
              placeholder="Button label"
            />
          </div>
          <div className="grid gap-4 border-t border-slate-200 pt-4">
            <div>
              <p className="font-semibold text-slate-900">Hero slides</p>
              <p className="mt-1 text-sm text-slate-500">
                Global content above is used by default. Each slide can
                optionally use its own heading and subheading.
              </p>
            </div>
            {settings.hero.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">Hero {index + 1}</p>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={settings.hero.slides.length === 1}
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          slides: current.hero.slides.filter(
                            (item) => item.id !== slide.id,
                          ),
                        },
                      }))
                    }
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-[14rem_1fr]">
                  <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
                    {slide.image ? (
                      <Image
                        src={slide.image}
                        alt=""
                        width={560}
                        height={420}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center text-sm text-slate-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="grid content-start gap-3">
                    <Label className="grid cursor-pointer gap-2">
                      <span>Hero image</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="block w-full text-sm"
                        disabled={uploadingSlideId === slide.id}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadHeroImage(file, slide.id);
                        }}
                      />
                    </Label>
                    {uploadingSlideId === slide.id ? (
                      <p className="text-sm font-medium text-teal-700">
                        Uploading to Cloudinary...
                      </p>
                    ) : null}
                    <div className="grid gap-1.5">
                      <Label>Alt text (optional)</Label>
                      <input
                        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                        value={slide.alt}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            hero: {
                              ...current.hero,
                              slides: current.hero.slides.map((item) =>
                                item.id === slide.id
                                  ? { ...item, alt: event.target.value }
                                  : item,
                              ),
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    {
                      key: "blank" as const,
                      label: "Blank hero (image only)",
                    },
                    {
                      key: "showButtons" as const,
                      label: "Show CTA buttons",
                    },
                  ].map((option) => (
                    <Label key={option.key} className="flex items-center gap-2">
                      <Checkbox
                        checked={slide[option.key]}
                        disabled={option.key !== "blank" && slide.blank}
                        onCheckedChange={(checked) =>
                          setSettings((current) => ({
                            ...current,
                            hero: {
                              ...current.hero,
                              slides: current.hero.slides.map((item) =>
                                item.id === slide.id
                                  ? { ...item, [option.key]: checked === true }
                                  : item,
                              ),
                            },
                          }))
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
                <div className="grid gap-4">
                  <LocalizedInput
                    locales={locales}
                    label="Hero heading (optional)"
                    value={slide.headline}
                    onChange={(headline) =>
                      setSettings((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          slides: current.hero.slides.map((item) =>
                            item.id === slide.id ? { ...item, headline } : item,
                          ),
                        },
                      }))
                    }
                  />
                  <LocalizedTextarea
                    locales={locales}
                    label="Hero subheading (optional)"
                    value={slide.subheadline}
                    onChange={(subheadline) =>
                      setSettings((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          slides: current.hero.slides.map((item) =>
                            item.id === slide.id
                              ? { ...item, subheadline }
                              : item,
                          ),
                        },
                      }))
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label>Hero link (optional)</Label>
                    <input
                      type="url"
                      className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm"
                      placeholder="https://example.com"
                      value={slide.linkUrl}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          hero: {
                            ...current.hero,
                            slides: current.hero.slides.map((item) =>
                              item.id === slide.id
                                ? { ...item, linkUrl: event.target.value }
                                : item,
                            ),
                          },
                        }))
                      }
                    />
                    <p className="text-xs text-slate-500">
                      Clicking this hero opens the link in a new tab.
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    slides: [
                      ...current.hero.slides,
                      {
                        id: crypto.randomUUID(),
                        image: "",
                        alt: "",
                        blank: false,
                        showButtons: true,
                        headline: "",
                        subheadline: "",
                        linkUrl: "",
                      },
                    ],
                  },
                }))
              }
            >
              Add hero
            </Button>
          </div>
        </div>
        <SaveButton onClick={save} isPending={isPending} label="Save hero" />
      </AdminPanel>

      {/* ── Contact Section ── */}
      <AdminPanel title="Contact Section" icon={MessageSquareText}>
        <div className="grid gap-4 lg:grid-cols-2">
          <LocalizedInput
            locales={locales}
            label="Eyebrow"
            value={settings.contact.eyebrow}
            onChange={(eyebrow) =>
              setSettings((c) => ({ ...c, contact: { ...c.contact, eyebrow } }))
            }
            placeholder="Short label above the headline"
          />
          <LocalizedInput
            locales={locales}
            label="Submit label"
            value={settings.contact.submitLabel}
            onChange={(submitLabel) =>
              setSettings((c) => ({
                ...c,
                contact: { ...c.contact, submitLabel },
              }))
            }
            placeholder="Form submit button text"
          />
          <LocalizedInput
            locales={locales}
            label="Title"
            value={settings.contact.title}
            onChange={(title) =>
              setSettings((c) => ({ ...c, contact: { ...c.contact, title } }))
            }
            placeholder="Section title"
          />
          <LocalizedTextarea
            locales={locales}
            label="Body"
            value={settings.contact.body}
            onChange={(body) =>
              setSettings((c) => ({ ...c, contact: { ...c.contact, body } }))
            }
            placeholder="Section description"
          />
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
              onDrop={(e) => {
                e.preventDefault();
                if (draggedThemeSlug)
                  reorderThemes(draggedThemeSlug, theme.slug);
                setDraggedThemeSlug(null);
              }}
              className={`cursor-grab border border-slate-200 p-4 transition active:cursor-grabbing ${
                draggedThemeSlug === theme.slug
                  ? "border-primary bg-primary/5 opacity-70"
                  : "bg-white hover:border-slate-300"
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
                  <Checkbox
                    checked={theme.enabled}
                    onCheckedChange={(checked) =>
                      setThemes((c) =>
                        c.map((t) =>
                          t.slug === theme.slug
                            ? { ...t, enabled: checked === true }
                            : t,
                        ),
                      )
                    }
                  />
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
            <div
              key={`feature-${index}`}
              className="grid gap-3 rounded-md border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Feature {index + 1}
                </span>
                <Label className="flex items-center gap-2 text-xs text-slate-600">
                  <Checkbox
                    checked={feature.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((c) => ({
                        ...c,
                        features: c.features.map((f, i) =>
                          i === index ? { ...f, enabled: checked === true } : f,
                        ),
                      }))
                    }
                  />
                  Enabled
                </Label>
              </div>
              <LocalizedInput
                locales={locales}
                label="Title"
                value={feature.title}
                onChange={(title) =>
                  setSettings((c) => ({
                    ...c,
                    features: c.features.map((f, i) =>
                      i === index ? { ...f, title } : f,
                    ),
                  }))
                }
                placeholder="Feature title"
              />
              <LocalizedTextarea
                locales={locales}
                label="Body"
                value={feature.body}
                onChange={(body) =>
                  setSettings((c) => ({
                    ...c,
                    features: c.features.map((f, i) =>
                      i === index ? { ...f, body } : f,
                    ),
                  }))
                }
                placeholder="Feature description"
              />
            </div>
          ))}
        </div>
        <SaveButton
          onClick={save}
          isPending={isPending}
          label="Save features"
        />
      </AdminPanel>
    </div>
  );
}

function SaveButton({
  onClick,
  isPending,
  label,
}: {
  onClick: () => void;
  isPending: boolean;
  label: string;
}) {
  return (
    <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
      <Button
        type="button"
        onClick={onClick}
        disabled={isPending}
        className="h-11 gap-2 bg-slate-950 px-6 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-4" aria-hidden="true" />
        )}
        {isPending ? "Saving\u2026" : label}
      </Button>
    </div>
  );
}

function previewText(value: LocalizedString) {
  return typeof value === "string"
    ? value
    : (value.en ?? Object.values(value).find(Boolean) ?? "");
}
