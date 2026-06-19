import { Languages } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { saveTranslationLocaleConfig } from "@/app/admin/actions";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";

export default async function AdminTranslationsPage() {
  const locales = await getTranslationLocaleConfig();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Translations"
          title="Manage translation languages and charges."
          body="Only predefined app locales can be enabled. Set the charge for each translated language so billing can enforce it later."
        />

        <AdminPanel title="Predefined Locales" icon={Languages}>
          <form
            action={async (formData) => {
              "use server";
              await saveTranslationLocaleConfig(
                locales.map((locale) => ({
                  code: locale.code,
                  label: locale.label,
                  nativeLabel: locale.nativeLabel,
                  direction: locale.direction,
                  enabled: formData.get(`${locale.code}:enabled`) === "on",
                  priceCents: Number(formData.get(`${locale.code}:priceCents`) ?? 0),
                  billingNote: String(formData.get(`${locale.code}:billingNote`) ?? "")
                }))
              );
            }}
            className="grid gap-4"
          >
            {locales.map((locale) => (
              <section key={locale.code} className="grid gap-4 border border-slate-200 p-4 lg:grid-cols-[0.35fr_0.2fr_0.2fr_0.25fr] lg:items-center">
                <div>
                  <p className="font-semibold">{locale.label}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {locale.nativeLabel} · /{locale.code} · {locale.direction.toUpperCase()}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    This locale is predefined in the codebase. Add new languages in code before admins can enable them.
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input name={`${locale.code}:enabled`} type="checkbox" defaultChecked={locale.enabled} disabled={locale.code === "en"} />
                  {locale.code === "en" ? "Default enabled" : "Enabled"}
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Charge in cents
                  <div className="mt-1 flex h-10 border border-slate-200">
                    <span className="flex items-center border-r border-slate-200 px-3 text-slate-500">¢</span>
                    <input
                      name={`${locale.code}:priceCents`}
                      type="number"
                      min={0}
                      step={100}
                      defaultValue={locale.priceCents}
                      className="min-w-0 flex-1 px-3 outline-none focus:border-teal-700"
                    />
                  </div>
                  <span className="mt-1 block text-xs text-slate-500">Example: 500 = $5.00</span>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Billing note
                  <textarea
                    name={`${locale.code}:billingNote`}
                    defaultValue={locale.billingNote}
                    className="mt-1 min-h-20 w-full resize-y border border-slate-200 px-3 py-2 outline-none focus:border-teal-700"
                  />
                </label>
              </section>
            ))}

            <button type="submit" className="h-11 w-fit bg-slate-950 px-5 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Save translation settings
            </button>
          </form>
        </AdminPanel>
      </div>
    </main>
  );
}
