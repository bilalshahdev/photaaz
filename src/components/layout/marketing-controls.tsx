"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { type AppLocale, type MarketingMessages } from "@/i18n/locales";

type LanguageDef = {
  code: AppLocale;
  labelKey: keyof MarketingMessages["language"];
  shortLabel: string;
  flag: string;
};

const languages: LanguageDef[] = [
  { code: "en", labelKey: "english", shortLabel: "EN", flag: "🇺🇸" },
  { code: "es", labelKey: "spanish", shortLabel: "ES", flag: "🇪🇸" },
  { code: "ar", labelKey: "arabic", shortLabel: "AR", flag: "🇸🇦" },
  { code: "tr", labelKey: "turkish", shortLabel: "TR", flag: "🇹🇷" },
  { code: "hi", labelKey: "hindi", shortLabel: "HI", flag: "🇮🇳" },
  { code: "pt", labelKey: "portuguese", shortLabel: "PT", flag: "🇧🇷" },
  { code: "de", labelKey: "german", shortLabel: "DE", flag: "🇩🇪" },
  { code: "fr", labelKey: "french", shortLabel: "FR", flag: "🇫🇷" },
];

type MarketingControlsProps = {
  locale: AppLocale;
  messages: MarketingMessages;
  variant?: "overlay" | "solid";
  enabledLocales?: AppLocale[];
};

export function MarketingControls({ locale, messages, variant = "overlay", enabledLocales }: MarketingControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const visibleLanguages = enabledLocales?.length ? languages.filter((language) => enabledLocales.includes(language.code)) : languages;
  const selectedLanguage = visibleLanguages.find((language) => language.code === locale) ?? visibleLanguages[0] ?? languages[0];
  const isSolid = variant === "solid";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function switchPath() {
    return pathname || "/";
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`inline-flex h-10 touch-manipulation items-center gap-1.5 border px-2 font-nav text-xs font-semibold uppercase tracking-[0.16em] shadow-sm transition sm:gap-2 sm:px-3 ${
          isSolid
            ? "border-[#101418]/18 bg-transparent text-[#101418] hover:border-[#101418]/30"
            : "border-white/40 bg-transparent text-white hover:bg-white/10"
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={messages.language.select}
      >
        <span className="text-sm leading-none" aria-hidden="true">{selectedLanguage.flag}</span>
        <span>{selectedLanguage.shortLabel}</span>
        <ChevronDown className={`size-4 transition ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-52 border border-[#d7dedb] bg-white p-1.5 text-[#101418] shadow-[0_18px_60px_rgba(16,20,24,0.18)]">
          {visibleLanguages.map((language) => {
            const isSelected = language.code === locale;

            return (
              <Link
                key={language.code}
                href={switchPath()}
                locale={language.code}
                onClick={closeMenu}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition ${
                  isSelected ? "bg-[#eef7f4] text-[#101418]" : "text-[#101418] hover:bg-[#f7f8f6]"
                }`}
                role="menuitemradio"
                aria-checked={isSelected}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg leading-none" aria-hidden="true">{language.flag}</span>
                  <span>
                    <span className="block font-nav text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#101418]">
                      {language.shortLabel}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-[#59636b]">{messages.language[language.labelKey]}</span>
                  </span>
                </span>
                {isSelected ? <Check className="size-4 shrink-0 text-primary" aria-hidden="true" /> : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
