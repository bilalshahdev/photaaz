import enMessages from "../../messages/en.json";
import esMessages from "../../messages/es.json";
import arMessages from "../../messages/ar.json";
import trMessages from "../../messages/tr.json";
import hiMessages from "../../messages/hi.json";
import ptMessages from "../../messages/pt.json";
import deMessages from "../../messages/de.json";
import frMessages from "../../messages/fr.json";
import type { Route } from "next";

export const locales = ["en", "es", "ar", "tr", "hi", "pt", "de", "fr"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

const rtlLocales: ReadonlySet<string> = new Set(["ar"]);

export const messages = {
  en: enMessages,
  es: esMessages,
  ar: arMessages,
  tr: trMessages,
  hi: hiMessages,
  pt: ptMessages,
  de: deMessages,
  fr: frMessages
} as const;

export type MarketingMessages = (typeof messages)["en"];

export function isLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export function getMessages(locale: AppLocale) {
  return messages[locale];
}

export function getTextDirection(locale: AppLocale) {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}

export function localizePath(locale: AppLocale, path: string): Route {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale) {
    return normalizedPath as Route;
  }

  return (normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`) as Route;
}

export function resolveLocalizedString(value: string | Record<string, string>, locale: AppLocale) {
  return typeof value === "string" ? value : value[locale] || value.en || Object.values(value)[0] || "";
}

export function resolveLocalizedStringList(value: string[] | Record<string, string[]> | undefined, locale: AppLocale) {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : value[locale] || value.en || Object.values(value)[0] || [];

  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}
