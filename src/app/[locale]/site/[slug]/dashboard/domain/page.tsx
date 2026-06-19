import { notFound } from "next/navigation";
import { Globe2, ShieldCheck } from "lucide-react";
import { getCustomerSettingsView } from "@/services/tenant/customer-dashboard-data";

type CustomerDomainPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerDomainPage({ params }: CustomerDomainPageProps) {
  const { slug } = await params;
  const data = await getCustomerSettingsView(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Domain</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Manage public address.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Start with the free subdomain, then connect a custom domain when billing and DNS verification are wired.
          </p>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Globe2 className="size-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-8 font-display text-3xl font-black tracking-[-0.04em]">Free subdomain</h2>
            <p className="mt-3 text-lg font-semibold">{data.slug}.photofolio.com</p>
            <p className="mt-2 text-sm text-slate-600">Available locally at /{data.slug}</p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <ShieldCheck className="size-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-8 font-display text-3xl font-black tracking-[-0.04em]">Custom domains</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {data.domains.length ? `${data.domains.length} custom domains configured.` : "No custom domains connected yet."}
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
