"use client";

import { useState } from "react";
import { Globe, X } from "lucide-react";
import { useAdminLocale } from "@/components/admin/admin-locale-context";
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

function useLocaleState(locales: AdminLocaleOption[]) {
  const ctx = useAdminLocale();
  const fallback = locales[0]?.code ?? "en";
  const activeLocale = ctx?.activeLocale ?? fallback;
  const activeOption = locales.find((l) => l.code === activeLocale) ?? locales[0];
  return { activeLocale, activeOption };
}

function normalizeLocalizedString(value: LocalizedString, locales: AdminLocaleOption[]) {
  if (typeof value === "string") {
    return locales.reduce<Record<string, string>>((result, locale) => {
      result[locale.code] = locale.code === "en" ? value : "";
      return result;
    }, {});
  }

  return locales.reduce<Record<string, string>>((result, locale) => {
    result[locale.code] = value[locale.code] ?? "";
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
      result[locale.code] = locale.code === "en" ? value : [];
      return result;
    }, {});
  }

  return locales.reduce<Record<string, string[]>>((result, locale) => {
    result[locale.code] = value[locale.code] ?? [];
    return result;
  }, {});
}

function TranslationHint({ enValue, activeLocale, currentValue }: { enValue: string; activeLocale: string; currentValue: string }) {
  if (activeLocale === "en" || currentValue.trim()) return null;
  if (!enValue.trim()) return null;

  return (
    <div className="mt-1.5 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <Globe className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-semibold">No {activeLocale.toUpperCase()} translation.</span>{" "}
        English: <span className="italic text-amber-600">&quot;{enValue.length > 80 ? `${enValue.slice(0, 80)}...` : enValue}&quot;</span>
      </span>
    </div>
  );
}

export function LocalizedInput({
  label,
  value,
  locales,
  onChange,
  placeholder
}: {
  label: string;
  value: LocalizedString;
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedString) => void;
  placeholder?: string;
}) {
  const { activeLocale, activeOption } = useLocaleState(locales);
  const localizedValue = normalizeLocalizedString(value, locales);

  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-slate-700">{label}</Label>
      <Input
        dir={activeOption?.direction ?? "ltr"}
        value={localizedValue[activeLocale] ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange({ ...localizedValue, [activeLocale]: event.target.value })}
        className="h-11"
      />
      <TranslationHint enValue={localizedValue.en ?? ""} activeLocale={activeLocale} currentValue={localizedValue[activeLocale] ?? ""} />
    </div>
  );
}

export function LocalizedTextarea({
  label,
  value,
  locales,
  onChange,
  placeholder
}: {
  label: string;
  value: LocalizedString;
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedString) => void;
  placeholder?: string;
}) {
  const { activeLocale, activeOption } = useLocaleState(locales);
  const localizedValue = normalizeLocalizedString(value, locales);

  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-slate-700">{label}</Label>
      <Textarea
        dir={activeOption?.direction ?? "ltr"}
        value={localizedValue[activeLocale] ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange({ ...localizedValue, [activeLocale]: event.target.value })}
        className="min-h-28 resize-y"
      />
      <TranslationHint enValue={localizedValue.en ?? ""} activeLocale={activeLocale} currentValue={localizedValue[activeLocale] ?? ""} />
    </div>
  );
}

export function LocalizedStringList({
  label,
  addLabel = "Add item",
  value,
  locales,
  onChange,
  placeholder
}: {
  label: string;
  addLabel?: string;
  value: LocalizedString[];
  locales: AdminLocaleOption[];
  onChange: (value: LocalizedString[]) => void;
  placeholder?: string;
}) {
  const { activeLocale, activeOption } = useLocaleState(locales);
  const localizedItems = value.map((item) => normalizeLocalizedString(item, locales));
  const hasUntranslated = activeLocale !== "en" && localizedItems.some((item) => !(item[activeLocale] ?? "").trim() && (item.en ?? "").trim());

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
      <Label className="mb-2 block text-sm font-medium text-slate-700">{label}</Label>
      {hasUntranslated && (
        <div className="mb-2 flex items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Globe className="size-3 shrink-0" aria-hidden="true" />
          <span className="font-semibold">Some items have no {activeLocale.toUpperCase()} translation.</span>
        </div>
      )}
      <div className="grid gap-2">
        {localizedItems.map((item, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <div>
              <Input
                dir={activeOption?.direction ?? "ltr"}
                value={item[activeLocale] ?? ""}
                placeholder={placeholder ?? (activeLocale !== "en" && (item.en ?? "").trim() ? `EN: ${item.en}` : undefined)}
                onChange={(event) => updateItem(index, event.target.value)}
              />
            </div>
            <Button type="button" variant="outline" onClick={() => removeItem(index)} className="h-10 text-xs uppercase tracking-[0.14em] text-red-700 hover:bg-red-50">
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem} className="h-10 border-dashed text-xs uppercase tracking-[0.14em]">
          {addLabel}
        </Button>
      </div>
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
  const { activeLocale, activeOption } = useLocaleState(locales);
  const [draft, setDraft] = useState("");
  const localizedValue = normalizeLocalizedStringList(value, locales);
  const activeKeywords = localizedValue[activeLocale] ?? [];
  const enKeywords = localizedValue.en ?? [];
  const showHint = activeLocale !== "en" && activeKeywords.length === 0 && enKeywords.length > 0;

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
      <Label className="mb-2 block text-sm font-medium text-slate-700">{label}</Label>
      {showHint && (
        <div className="mb-2 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Globe className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">No {activeLocale.toUpperCase()} keywords.</span>{" "}
            English has: <span className="italic text-amber-600">{enKeywords.slice(0, 5).join(", ")}{enKeywords.length > 5 ? "..." : ""}</span>
          </span>
        </div>
      )}
      <div className="min-h-24 border border-slate-200 bg-white p-2 focus-within:border-primary">
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
    </div>
  );
}
