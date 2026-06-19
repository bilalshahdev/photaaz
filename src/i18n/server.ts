import { getLocale } from "next-intl/server";
import { type AppLocale } from "@/i18n/locales";

export async function getRequestLocale(): Promise<AppLocale> {
  return (await getLocale()) as AppLocale;
}
