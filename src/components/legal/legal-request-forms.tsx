import { submitCopyrightNotice, submitPrivacyRequest } from "@/actions/legal-request-actions";
import type { AppLocale } from "@/i18n/locales";

const field = "w-full border border-[#c9c5bb] bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function PrivacyRequestForm({ locale }: { locale: AppLocale }) {
  return <section className="mt-10 border border-[#d9d6ce] bg-white p-6">
    <h2 className="font-display text-3xl">Exercise your privacy rights</h2>
    <p className="mt-2 text-sm text-slate-600">Sign-in verification is required. For a direct machine-readable copy, <Link className="underline" href={"/api/account/export" as Route}>download your account export</Link>.</p>
    <form action={submitPrivacyRequest} className="mt-5 grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <select required name="type" className={field} defaultValue="ACCESS"><option value="ACCESS">Access</option><option value="EXPORT">Export</option><option value="CORRECTION">Correction</option><option value="DELETION">Account deletion</option><option value="OBJECTION">Object or opt out</option></select>
      <textarea required name="details" minLength={10} maxLength={5000} className={`${field} min-h-32`} placeholder="Explain your request and any relevant account or portfolio details." />
      <button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Submit verified request</button>
    </form>
  </section>;
}

export function CopyrightNoticeForm({ locale }: { locale: AppLocale }) {
  return <section className="mt-10 border border-[#d9d6ce] bg-white p-6">
    <h2 className="font-display text-3xl">Submit a copyright notice</h2>
    <form action={submitCopyrightNotice} className="mt-5 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <input required name="name" minLength={2} maxLength={120} className={field} placeholder="Full legal name" />
      <input required name="email" type="email" maxLength={200} className={field} placeholder="Email address" />
      <input required name="sourceUrl" type="url" maxLength={2000} className={`${field} sm:col-span-2`} placeholder="Exact allegedly infringing URL" />
      <textarea required name="workDescription" minLength={10} maxLength={2000} className={`${field} min-h-24 sm:col-span-2`} placeholder="Describe the copyrighted work and your authority." />
      <textarea required name="details" minLength={20} maxLength={5000} className={`${field} min-h-32 sm:col-span-2`} placeholder="Explain the infringement and requested action." />
      <label className="flex gap-3 text-sm leading-6 sm:col-span-2"><input required name="declaration" type="checkbox" className="mt-1" /><span>I state in good faith that the disputed use is not authorized and that this notice is accurate. I understand knowingly false notices may create liability.</span></label>
      <button className="w-fit bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Submit notice</button>
    </form>
  </section>;
}
import Link from "next/link";
import type { Route } from "next";
