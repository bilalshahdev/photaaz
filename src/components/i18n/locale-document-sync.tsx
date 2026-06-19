"use client";

import { useEffect } from "react";
import { type AppLocale } from "@/i18n/locales";

type LocaleDocumentSyncProps = {
  locale: AppLocale;
  dir: "ltr" | "rtl";
};

export function LocaleDocumentSync({ locale, dir }: LocaleDocumentSyncProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  return null;
}
