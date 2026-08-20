import Link from "next/link";
import { acceptCurrentLegalTerms } from "@/actions/legal-request-actions";
import { currentLegalVersions } from "@/config/legal";
import { isLocale, localizePath, type AppLocale } from "@/i18n/locales";

export default async function LegalAcceptPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ returnTo?: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const { returnTo } = await searchParams;
  return <main className="grid min-h-screen place-items-center bg-slate-950 p-5 text-white"><section className="w-full max-w-xl border border-white/15 bg-slate-900 p-7 shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Legal update</p>
    <h1 className="mt-3 text-4xl font-bold">Review the current terms</h1>
    <p className="mt-4 leading-7 text-white/70">Before continuing, review and accept the current <Link className="underline" target="_blank" href={localizePath(locale, "/legal/terms")}>Terms</Link> and <Link className="underline" target="_blank" href={localizePath(locale, "/legal/privacy")}>Privacy Policy</Link>.</p>
    <p className="mt-3 text-xs text-white/50">Terms {currentLegalVersions.terms} · Privacy {currentLegalVersions.privacy}</p>
    <form action={acceptCurrentLegalTerms} className="mt-6">
      <input type="hidden" name="locale" value={locale} /><input type="hidden" name="returnTo" value={returnTo ?? "/"} />
      <label className="flex gap-3 text-sm leading-6"><input required type="checkbox" name="accepted" className="mt-1" /><span>I accept the current Terms and acknowledge the current Privacy Policy.</span></label>
      <button className="mt-5 bg-white px-5 py-3 font-semibold text-slate-950">Accept and continue</button>
    </form>
  </section></main>;
}
