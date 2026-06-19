import { notFound } from "next/navigation";
import { Settings, UserRound } from "lucide-react";
import { getCustomerSettingsView } from "@/services/tenant/customer-dashboard-data";

type CustomerSettingsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerSettingsPage({ params }: CustomerSettingsPageProps) {
  const { slug } = await params;
  const data = await getCustomerSettingsView(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Settings</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Site settings.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Core tenant settings for identity, locale, theme, and plan.
          </p>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SettingCard icon={UserRound} label="Name" value={data.name} />
          <SettingCard icon={Settings} label="Status" value={data.status} />
          <SettingCard icon={Settings} label="Locale" value={data.defaultLocale.toUpperCase()} />
          <SettingCard icon={Settings} label="Theme" value={data.themeKey} />
        </section>
      </div>
    </main>
  );
}

function SettingCard({ icon: Icon, label, value }: { icon: typeof Settings; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="size-6 text-teal-700" aria-hidden="true" />
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 break-words font-display text-3xl font-black tracking-[-0.04em]">{value}</p>
    </article>
  );
}
