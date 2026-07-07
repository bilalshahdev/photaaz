"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LocalizedString, LocalizedStringList } from "@/services/platform/platform-data";

export type AdminLocaleOption = {
  code: string;
  label: string;
  nativeLabel: string;
  direction: "ltr" | "rtl";
};

function normalizeLocalizedString(value: LocalizedString, locales: AdminLocaleOption[]) {
  if (typeof value === "string") {
    return locales.reduce<Record<string, string>>((result, locale) => {
      result[locale.code] = value;
      return result;
    }, {});
  }

  return locales.reduce<Record<string, string>>((result, locale) => {
    result[locale.code] = value[locale.code] ?? value.en ?? "";
    return result;
  }, {});
}

function emptyLocalizedString(locales: AdminLocaleOption[]) {
  return locales.reduce<Record<string, string>>((result, locale) => {
    result[locale.code] = "";
    return result;
  }, {});
}

function normalizeLocalizedStringList(value: LocalizedStringList, locales: AdminLocaleOption[]) {
  if (Array.isArray(value)) {
    return locales.reduce<Record<string, string[]>>((result, locale) => {
      result[locale.code] = value;
      return result;
    }, {});
  }

  return locales.reduce<Record<string, string[]>>((result, locale) => {
    result[locale.code] = value[locale.code] ?? value.en ?? [];
    return result;
  }, {});
}

function LocaleTabs({ locales, activeLocale, onChange }: { locales: AdminLocaleOption[]; activeLocale: string; onChange: (locale: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 border border-slate-200 bg-slate-50 p-1">
      {locales.map((locale) => (
        <Button
          key={locale.code}
          type="button"
          variant={activeLocale === locale.code ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(locale.code)}
          className="h-9 rounded-sm px-3 text-xs uppercase tracking-[0.14em]"
        >
          {locale.code}
        </Button>
      ))}
    </div>
  );
}

export function LocalizedInput({
  label,
  value,
  locales,
  onChange
}: {
  label: string;
  value: LocalizedString;
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedString) => void;
}) {
  const [activeLocale, setActiveLocale] = useState(locales[0]?.code ?? "en");
  const localizedValue = normalizeLocalizedString(value, locales);
  const activeOption = locales.find((locale) => locale.code === activeLocale) ?? locales[0];

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        <LocaleTabs locales={locales} activeLocale={activeLocale} onChange={setActiveLocale} />
      </div>
      <Input
        dir={activeOption?.direction ?? "ltr"}
        value={localizedValue[activeLocale] ?? ""}
        onChange={(event) => onChange({ ...localizedValue, [activeLocale]: event.target.value })}
        className="h-11"
      />
      {activeOption ? <p className="mt-1 text-xs text-slate-500">{activeOption.label} / {activeOption.nativeLabel}</p> : null}
    </div>
  );
}

export function LocalizedTextarea({
  label,
  value,
  locales,
  onChange
}: {
  label: string;
  value: LocalizedString;
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedString) => void;
}) {
  const [activeLocale, setActiveLocale] = useState(locales[0]?.code ?? "en");
  const localizedValue = normalizeLocalizedString(value, locales);
  const activeOption = locales.find((locale) => locale.code === activeLocale) ?? locales[0];

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        <LocaleTabs locales={locales} activeLocale={activeLocale} onChange={setActiveLocale} />
      </div>
      <Textarea
        dir={activeOption?.direction ?? "ltr"}
        value={localizedValue[activeLocale] ?? ""}
        onChange={(event) => onChange({ ...localizedValue, [activeLocale]: event.target.value })}
        className="min-h-28 resize-y"
      />
      {activeOption ? <p className="mt-1 text-xs text-slate-500">{activeOption.label} / {activeOption.nativeLabel}</p> : null}
    </div>
  );
}

export function LocalizedStringList({
  label,
  addLabel = "Add item",
  value,
  locales,
  onChange
}: {
  label: string;
  addLabel?: string;
  value: LocalizedString[];
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedString[]) => void;
}) {
  const [activeLocale, setActiveLocale] = useState(locales[0]?.code ?? "en");
  const activeOption = locales.find((locale) => locale.code === activeLocale) ?? locales[0];
  const localizedItems = value.map((item) => normalizeLocalizedString(item, locales));

  function updateItem(index: number, nextValue: string) {
    onChange(localizedItems.map((item, itemIndex) => (itemIndex === index ? { ...item, [activeLocale]: nextValue } : item)));
  }

  function addItem() {
    onChange([...localizedItems, emptyLocalizedString(locales)]);
  }

  function removeItem(index: number) {
    onChange(localizedItems.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        <LocaleTabs locales={locales} activeLocale={activeLocale} onChange={setActiveLocale} />
      </div>
      <div className="grid gap-2">
        {localizedItems.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <Input
              dir={activeOption?.direction ?? "ltr"}
              value={item[activeLocale] ?? ""}
              onChange={(event) => updateItem(index, event.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => removeItem(index)} className="h-10 text-xs uppercase tracking-[0.14em] text-red-700 hover:bg-red-50">
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem} className="h-10 border-dashed text-xs uppercase tracking-[0.14em]">
          {addLabel}
        </Button>
      </div>
      {activeOption ? <p className="mt-1 text-xs text-slate-500">{activeOption.label} / {activeOption.nativeLabel}</p> : null}
    </div>
  );
}

export function LocalizedKeywordInput({
  label,
  value,
  locales,
  onChange,
  placeholder = "Type a keyword and press Enter"
}: {
  label: string;
  value: LocalizedStringList;
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedStringList) => void;
  placeholder?: string;
}) {
  const [activeLocale, setActiveLocale] = useState(locales[0]?.code ?? "en");
  const [draft, setDraft] = useState("");
  const activeOption = locales.find((locale) => locale.code === activeLocale) ?? locales[0];
  const localizedValue = normalizeLocalizedStringList(value, locales);
  const activeKeywords = localizedValue[activeLocale] ?? [];

  function commitKeyword(rawValue = draft) {
    const keyword = rawValue.trim();

    if (!keyword || activeKeywords.includes(keyword)) {
      setDraft("");
      return;
    }

    onChange({
      ...localizedValue,
      [activeLocale]: [...activeKeywords, keyword]
    });
    setDraft("");
  }

  function removeKeyword(keyword: string) {
    onChange({
      ...localizedValue,
      [activeLocale]: activeKeywords.filter((item) => item !== keyword)
    });
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        <LocaleTabs locales={locales} activeLocale={activeLocale} onChange={setActiveLocale} />
      </div>
      <div className="min-h-24 border border-slate-200 bg-white p-2 focus-within:border-teal-700">
        <div className="flex flex-wrap gap-2">
          {activeKeywords.map((keyword) => (
            <span key={keyword} className="inline-flex h-8 items-center gap-2 border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700">
              {keyword}
              <Button type="button" variant="ghost" size="sm" onClick={() => removeKeyword(keyword)} className="size-5 p-0 text-slate-400 hover:text-red-600" aria-label={`Remove ${keyword}`}>
                <X className="size-3" aria-hidden="true" />
              </Button>
            </span>
          ))}
          <Input
            dir={activeOption?.direction ?? "ltr"}
            value={draft}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => commitKeyword()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                commitKeyword();
              }

              if (event.key === "Backspace" && !draft && activeKeywords.length) {
                removeKeyword(activeKeywords[activeKeywords.length - 1]);
              }
            }}
            className="h-8 min-w-56 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>
      {activeOption ? <p className="mt-1 text-xs text-slate-500">{activeOption.label} / {activeOption.nativeLabel}</p> : null}
    </div>
  );
}
