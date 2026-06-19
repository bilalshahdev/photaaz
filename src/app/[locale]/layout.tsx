import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LocaleDocumentSync } from "@/components/i18n/locale-document-sync";
import { getMessages, getTextDirection, type AppLocale } from "@/i18n/locales";
import { routing } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }

  const locale = rawLocale as AppLocale;

  setRequestLocale(locale);
  const dir = getTextDirection(locale);

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={getMessages(locale)}>
      <LocaleDocumentSync locale={locale} dir={dir} />
      <div lang={locale} dir={dir}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
