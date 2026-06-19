"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, HelpCircle, LayoutTemplate, ListOrdered, Megaphone, MessageSquareText, Plus, Save, Search, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-ui";
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

export function LandingEditor({ initialSettings, initialThemes }: { initialSettings: PlatformLandingSettings; initialThemes: PlatformThemeView[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [themes, setThemes] = useState(initialThemes);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

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
      {message ? <div className="mb-6 border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-900">{message}</div> : null}

      <section className="mb-6">
        <AdminPanel title="Landing Sections" icon={ListOrdered}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(Object.keys(settings.sections) as PlatformLandingSectionKey[]).map((key) => (
              <div key={key} className="border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{sectionLabels[key]}</p>
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={settings.sections[key].enabled}
                      onChange={(event) =>
                        setSettings((current) => ({
                          ...current,
                          sections: {
                            ...current.sections,
                            [key]: {
                              ...current.sections[key],
                              enabled: event.target.checked
                            }
                          }
                        }))
                      }
                    />
                    Visible
                  </label>
                </div>
                <label className="mt-3 block text-xs font-medium text-slate-500">
                  Display order
                  <input
                    type="number"
                    min={1}
                    value={settings.sections[key].displayOrder}
                    onChange={(event) =>
                      setSettings((current) => ({
                        ...current,
                        sections: {
                          ...current.sections,
                          [key]: {
                            ...current.sections[key],
                            displayOrder: Number(event.target.value)
                          }
                        }
                      }))
                    }
                    className="mt-1 h-9 w-full border border-slate-200 px-2 outline-none focus:border-teal-700"
                  />
                </label>
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.45fr_0.55fr]">
        <AdminPanel title="Hero Content" icon={Megaphone}>
          <div className="grid gap-4">
            <LocalizedInput label="Eyebrow" value={settings.hero.eyebrow} onChange={(eyebrow) => setSettings((current) => ({ ...current, hero: { ...current.hero, eyebrow } }))} />
            <LocalizedInput label="Headline" value={settings.hero.headline} onChange={(headline) => setSettings((current) => ({ ...current, hero: { ...current.hero, headline } }))} />
            <LocalizedTextarea label="Subheadline" value={settings.hero.subheadline} onChange={(subheadline) => setSettings((current) => ({ ...current, hero: { ...current.hero, subheadline } }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <LocalizedInput label="Primary CTA" value={settings.hero.primaryCta} onChange={(primaryCta) => setSettings((current) => ({ ...current, hero: { ...current.hero, primaryCta } }))} />
              <LocalizedInput label="Secondary CTA" value={settings.hero.secondaryCta} onChange={(secondaryCta) => setSettings((current) => ({ ...current, hero: { ...current.hero, secondaryCta } }))} />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="SEO Settings" icon={Search}>
          <div className="grid gap-4">
            <LocalizedInput label="Meta title" value={settings.seo.title} onChange={(title) => setSettings((current) => ({ ...current, seo: { ...current.seo, title } }))} />
            <LocalizedTextarea label="Meta description" value={settings.seo.description} onChange={(description) => setSettings((current) => ({ ...current, seo: { ...current.seo, description } }))} />
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
            <LocalizedInput label="Eyebrow" value={settings.contact.eyebrow} onChange={(eyebrow) => setSettings((current) => ({ ...current, contact: { ...current.contact, eyebrow } }))} />
            <LocalizedInput label="Submit label" value={settings.contact.submitLabel} onChange={(submitLabel) => setSettings((current) => ({ ...current, contact: { ...current.contact, submitLabel } }))} />
            <LocalizedInput label="Title" value={settings.contact.title} onChange={(title) => setSettings((current) => ({ ...current, contact: { ...current.contact, title } }))} />
            <LocalizedTextarea label="Body" value={settings.contact.body} onChange={(body) => setSettings((current) => ({ ...current, contact: { ...current.contact, body } }))} />
          </div>
        </AdminPanel>
      </section>

      <section className="mt-6">
        <AdminPanel title="FAQ Section" icon={HelpCircle}>
          <div className="grid gap-4">
            {settings.faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">FAQ {index + 1}</p>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={faq.enabled}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            faqs: current.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, enabled: event.target.checked } : item))
                          }))
                        }
                      />
                      Visible
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      Order
                      <input
                        type="number"
                        min={1}
                        value={faq.displayOrder}
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            faqs: current.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, displayOrder: Number(event.target.value) } : item))
                          }))
                        }
                        className="h-8 w-20 border border-slate-200 px-2 outline-none focus:border-teal-700"
                      />
                    </label>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <LocalizedInput
                    label="Question"
                    value={faq.question}
                    onChange={(question) =>
                      setSettings((current) => ({
                        ...current,
                        faqs: current.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, question } : item))
                      }))
                    }
                  />
                  <LocalizedTextarea
                    label="Answer"
                    value={faq.answer}
                    onChange={(answer) =>
                      setSettings((current) => ({
                        ...current,
                        faqs: current.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, answer } : item))
                      }))
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  faqs: [
                    ...current.faqs,
                    {
                      question: { en: "New question", ur: "نیا سوال" },
                      answer: { en: "Add the answer here.", ur: "جواب یہاں شامل کریں۔" },
                      enabled: true,
                      displayOrder: current.faqs.length + 1
                    }
                  ]
                }))
              }
              className="w-fit rounded-none border-slate-950 bg-white font-nav text-xs font-semibold uppercase tracking-[0.18em]"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add FAQ
            </Button>
          </div>
        </AdminPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.55fr_0.45fr]">
        <AdminPanel title="Theme Showcase Cards" icon={LayoutTemplate}>
          <div className="grid gap-3 md:grid-cols-2">
            {themes.map((theme) => (
              <div key={theme.slug} className="border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{theme.name}</p>
                  <label className="flex items-center gap-2 text-xs text-slate-600">
                    <input type="checkbox" checked={theme.enabled} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, enabled: event.target.checked } : item)))} />
                    Visible
                  </label>
                </div>
                <label className="mt-3 block text-xs font-medium text-slate-500">
                  Display order
                  <input type="number" min={1} value={theme.displayOrder} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, displayOrder: Number(event.target.value) } : item)))} className="mt-1 h-9 w-full border border-slate-200 px-2 outline-none" />
                </label>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Feature Cards" icon={Wand2}>
          <div className="grid gap-3">
            {settings.features.map((feature, index) => (
              <div key={`${feature.title}-${index}`} className="border border-slate-200 p-4">
                <CheckCircle2 className="size-4 text-teal-700" aria-hidden="true" />
                <AdminInput label="Title" value={feature.title} onChange={(title) => setSettings((current) => ({ ...current, features: current.features.map((item, itemIndex) => (itemIndex === index ? { ...item, title } : item)) }))} />
                <AdminTextarea label="Body" value={feature.body} onChange={(body) => setSettings((current) => ({ ...current, features: current.features.map((item, itemIndex) => (itemIndex === index ? { ...item, body } : item)) }))} />
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>
    </>
  );
}

function normalizeLocalizedString(value: LocalizedString) {
  return typeof value === "string" ? { en: value, ur: value } : value;
}

function LocalizedInput({ label, value, onChange }: { label: string; value: LocalizedString; onChange: (value: LocalizedString) => void }) {
  const localizedValue = normalizeLocalizedString(value);

  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <AdminInput label="English" value={localizedValue.en} onChange={(en) => onChange({ ...localizedValue, en })} />
        <AdminInput label="Urdu" value={localizedValue.ur} onChange={(ur) => onChange({ ...localizedValue, ur })} />
      </div>
    </div>
  );
}

function LocalizedTextarea({ label, value, onChange }: { label: string; value: LocalizedString; onChange: (value: LocalizedString) => void }) {
  const localizedValue = normalizeLocalizedString(value);

  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <AdminTextarea label="English" value={localizedValue.en} onChange={(en) => onChange({ ...localizedValue, en })} />
        <AdminTextarea label="Urdu" value={localizedValue.ur} onChange={(ur) => onChange({ ...localizedValue, ur })} />
      </div>
    </div>
  );
}

function AdminInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full border border-slate-200 px-3 text-sm outline-none focus:border-teal-700" />
    </label>
  );
}

function AdminTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-28 w-full resize-y border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-700" />
    </label>
  );
}
