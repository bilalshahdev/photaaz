"use client";

import { useMemo, useState, useTransition } from "react";
import { Globe2, Image as ImageIcon, Save, Search } from "lucide-react";
import { savePlatformSeoSettings } from "@/app/admin/actions";
import { AdminStatusMessage } from "@/components/admin/admin-crud-ui";
import { AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, LocalizedKeywordInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveLocalizedStringList, type AppLocale } from "@/i18n/locales";
import type { PlatformAppConfig } from "@/services/admin/admin-data";
import type { LocalizedString, PlatformLandingSettings } from "@/services/platform/platform-data";

type SeoEditorProps = {
  initialSettings: PlatformLandingSettings;
  initialAppConfig: PlatformAppConfig;
  locales: AdminLocaleOption[];
};

function pickLocalizedValue(value: LocalizedString, locale: string) {
  if (typeof value === "string") {
    return value;
  }

  return value[locale] ?? value.en ?? Object.values(value)[0] ?? "";
}

export function SeoEditor({ initialSettings, initialAppConfig, locales }: SeoEditorProps) {
  const [seo, setSeo] = useState(initialSettings.seo);
  const [assets, setAssets] = useState({
    signatureColor: initialAppConfig.signatureColor,
    faviconUrl: initialAppConfig.faviconUrl,
    appleTouchIconUrl: initialAppConfig.appleTouchIconUrl,
    socialPreviewImageUrl: initialAppConfig.socialPreviewImageUrl,
    seoKeywords: initialAppConfig.seoKeywords
  });
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const previewLocale = locales[0]?.code ?? "en";
  const previewAppLocale = previewLocale as AppLocale;
  const preview = useMemo(
    () => ({
      title: pickLocalizedValue(seo.title, previewLocale),
      description: pickLocalizedValue(seo.description, previewLocale),
      keywords: [
        ...resolveLocalizedStringList(seo.keywords, previewAppLocale),
        ...resolveLocalizedStringList(assets.seoKeywords, previewAppLocale)
      ]
    }),
    [assets.seoKeywords, previewAppLocale, previewLocale, seo.description, seo.keywords, seo.title]
  );

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePlatformSeoSettings({
          seo,
          ...assets
        });
        setMessage("SEO settings saved.");
      } catch {
        setMessage("Could not save SEO settings. Check the fields and try again.");
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]">
      <div className="space-y-6">
        {message ? <AdminStatusMessage className="mb-0">{message}</AdminStatusMessage> : null}

        <AdminPanel title="Homepage Metadata" icon={Search}>
          <div className="grid gap-5">
            <LocalizedInput locales={locales} label="Meta title" value={seo.title} onChange={(title) => setSeo((current) => ({ ...current, title }))} />
            <LocalizedTextarea locales={locales} label="Meta description" value={seo.description} onChange={(description) => setSeo((current) => ({ ...current, description }))} />
            <LocalizedKeywordInput locales={locales} label="Homepage keywords" value={seo.keywords} onChange={(keywords) => setSeo((current) => ({ ...current, keywords }))} />
            <Button type="button" onClick={save} disabled={isPending} className="w-fit rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
              <Save className="size-4" aria-hidden="true" />
              {isPending ? "Saving" : "Save SEO"}
            </Button>
          </div>
        </AdminPanel>

        <AdminPanel title="Preview Assets" icon={ImageIcon}>
          <div className="grid gap-4 md:grid-cols-2">
            <Label className="text-sm font-medium text-slate-700">
              Signature color
              <span className="mt-2 flex h-11 overflow-hidden border border-slate-200 bg-white">
                <Input value={assets.signatureColor} type="color" onChange={(event) => setAssets((current) => ({ ...current, signatureColor: event.target.value }))} className="h-full w-14 rounded-none border-0 bg-transparent p-1" />
                <Input value={assets.signatureColor} onChange={(event) => setAssets((current) => ({ ...current, signatureColor: event.target.value }))} className="h-full min-w-0 flex-1 rounded-none border-0 text-sm" aria-label="Signature color hex" />
              </span>
            </Label>
            <AdminTextInput label="Favicon URL" value={assets.faviconUrl} onChange={(faviconUrl) => setAssets((current) => ({ ...current, faviconUrl }))} />
            <AdminTextInput label="Apple touch icon URL" value={assets.appleTouchIconUrl} onChange={(appleTouchIconUrl) => setAssets((current) => ({ ...current, appleTouchIconUrl }))} />
            <AdminTextInput label="Social preview image URL" value={assets.socialPreviewImageUrl} onChange={(socialPreviewImageUrl) => setAssets((current) => ({ ...current, socialPreviewImageUrl }))} />
          </div>
          <div className="mt-5">
            <LocalizedKeywordInput locales={locales} label="Global fallback keywords" value={assets.seoKeywords} onChange={(seoKeywords) => setAssets((current) => ({ ...current, seoKeywords }))} />
          </div>
        </AdminPanel>
      </div>

      <div className="space-y-6">
        <AdminPanel title="Search Preview" icon={Globe2}>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs text-slate-500">photaaz.com</p>
            <h2 className="mt-2 text-xl font-semibold leading-tight text-blue-700">{preview.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{preview.description}</p>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <StatusRow label="Sitemap" value="/sitemap.xml" />
            <StatusRow label="Robots" value="/robots.txt" />
            <StatusRow label="Keywords" value={preview.keywords.length ? preview.keywords.join(", ") : "No keywords set"} />
            <StatusRow label="Default locale" value="English at /" />
          </div>
        </AdminPanel>

        <AdminPanel title="Social Card" icon={ImageIcon}>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assets.socialPreviewImageUrl} alt="" className="aspect-[1.91/1] w-full object-cover" />
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Photaaz</p>
              <p className="mt-2 font-semibold text-slate-950">{preview.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{preview.description}</p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function AdminTextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Label className="text-sm font-medium text-slate-700">
      {label}
      <Input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11" />
    </Label>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-slate-200 p-3">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="font-mono text-xs text-slate-500">{value}</span>
    </div>
  );
}
