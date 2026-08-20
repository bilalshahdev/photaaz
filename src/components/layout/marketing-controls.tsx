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
  { code: "ur", labelKey: "urdu", shortLabel: "UR", flag: "🇵🇰" },
  { code: "es", labelKey: "spanish", shortLabel: "ES", flag: "🇪🇸" },
  { code: "ar", labelKey: "arabic", shortLabel: "AR", flag: "🇸🇦" },
  { code: "tr", labelKey: "turkish", shortLabel: "TR", flag: "🇹🇷" },
  { code: "hi", labelKey: "hindi", shortLabel: "HI", flag: "🇮🇳" },
  { code: "pt", labelKey: "portuguese", shortLabel: "PT", flag: "🇧🇷" },
  { code: "de", labelKey: "german", shortLabel: "DE", flag: "🇩🇪" },
  { code: "fr", labelKey: "french", shortLabel: "FR", flag: "🇫🇷" },
];

function FlagIcon({ locale }: { locale: AppLocale }) {
  const className = "h-3.5 w-5 shrink-0 overflow-hidden border border-black/10 shadow-sm";

  if (locale === "en") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="18" fill="#fff" />
        {Array.from({ length: 7 }).map((_, index) => (
          <rect key={index} y={index * 3} width="28" height="1.5" fill="#b22234" />
        ))}
        <rect width="12" height="9.5" fill="#3c3b6e" />
      </svg>
    );
  }

  if (locale === "ur") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="18" fill="#fff" />
        <rect x="6" width="22" height="18" fill="#115740" />
        <circle cx="17" cy="9" r="4.3" fill="#fff" />
        <circle cx="18.6" cy="8.4" r="4.1" fill="#115740" />
        <path d="M21 5.2l.7 1.7 1.8.1-1.4 1.1.5 1.8-1.6-1-1.5 1 .5-1.8-1.4-1.1 1.8-.1z" fill="#fff" />
      </svg>
    );
  }

  if (locale === "es") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="18" fill="#aa151b" />
        <rect y="4.5" width="28" height="9" fill="#f1bf00" />
      </svg>
    );
  }

  if (locale === "ar") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="18" fill="#006c35" />
        <path d="M8 11.5h12M10 7h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (locale === "tr") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="18" fill="#e30a17" />
        <circle cx="12" cy="9" r="4.3" fill="#fff" />
        <circle cx="13.4" cy="9" r="3.5" fill="#e30a17" />
        <path d="M18.5 6.8l.6 1.5 1.6.1-1.2 1 .4 1.6-1.4-.9-1.4.9.4-1.6-1.2-1 1.6-.1z" fill="#fff" />
      </svg>
    );
  }

  if (locale === "hi") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="6" fill="#ff9933" />
        <rect y="6" width="28" height="6" fill="#fff" />
        <rect y="12" width="28" height="6" fill="#138808" />
        <circle cx="14" cy="9" r="1.8" fill="none" stroke="#000080" strokeWidth="0.8" />
      </svg>
    );
  }

  if (locale === "pt") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="18" fill="#009b3a" />
        <path d="M14 3l9 6-9 6-9-6z" fill="#ffdf00" />
        <circle cx="14" cy="9" r="3.2" fill="#002776" />
      </svg>
    );
  }

  if (locale === "de") {
    return (
      <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
        <rect width="28" height="6" fill="#000" />
        <rect y="6" width="28" height="6" fill="#dd0000" />
        <rect y="12" width="28" height="6" fill="#ffce00" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 28 18" className={className} aria-hidden="true">
      <rect width="28" height="6" fill="#0055a4" />
      <rect y="6" width="28" height="6" fill="#fff" />
      <rect y="12" width="28" height="6" fill="#ef4135" />
    </svg>
  );
}

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
        className={`inline-flex h-9 touch-manipulation items-center gap-1.5 border px-2 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.14em] shadow-sm transition sm:gap-2 sm:px-2.5 ${
          isSolid
            ? "border-[#101418]/18 bg-transparent text-[#101418] hover:border-[#101418]/30"
            : "border-white/40 bg-transparent text-white hover:bg-white/10"
        }`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={messages.language.select}
      >
        <FlagIcon locale={selectedLanguage.code} />
        <span>{selectedLanguage.shortLabel}</span>
        <ChevronDown className={`size-4 transition ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-11 z-50 max-h-[min(22rem,calc(100vh-7rem))] w-48 overflow-y-auto overscroll-contain border border-[#d7dedb] bg-white p-1 text-[#101418] shadow-[0_18px_60px_rgba(16,20,24,0.18)]">
          {visibleLanguages.map((language) => {
            const isSelected = language.code === locale;

            return (
              <Link
                key={language.code}
                href={switchPath()}
                locale={language.code}
                onClick={closeMenu}
                className={`flex w-full items-center justify-between gap-2.5 px-2.5 py-2 text-left transition ${
                  isSelected ? "bg-[#eef7f4] text-[#101418]" : "text-[#101418] hover:bg-[#f7f8f6]"
                }`}
                role="menuitemradio"
                aria-checked={isSelected}
              >
                <span className="flex items-center gap-2.5">
                  <FlagIcon locale={language.code} />
                  <span>
                    <span className="block font-nav text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#101418]">
                      {language.shortLabel}
                    </span>
                    <span className="mt-0.5 block text-[0.72rem] font-medium text-[#59636b]">{messages.language[language.labelKey]}</span>
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
