import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { Button } from "@/components/ui/button";
import { customerDashboardPath } from "@/config/routes";
import { getCustomerPackageView } from "@/services/tenant/customer-dashboard-data";

type CustomerPackageDetailPageProps = {
  params: Promise<{ slug: string; plan: string }>;
};

export default async function CustomerPackageDetailPage({ params }: CustomerPackageDetailPageProps) {
  const { slug, plan: planKey } = await params;
  const data = await getCustomerPackageView(slug);
  const plan = data?.availablePlans.find((item) => item.key === planKey);

  if (!data || !plan) {
    notFound();
  }

  const isCurrent = plan.key === data.current.key;
  const isOwnershipPlan = plan.key === "ownership";

  return (
    <CustomerDashboardPage>
      <Link href={customerDashboardPath(slug, "/package")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to subscription
      </Link>

      <CustomerDashboardHeader
        eyebrow="Plan details"
        title={`${plan.name} package.`}
        body={plan.description ?? "Package limits, features, and billing options for this portfolio."}
      />

      <CustomerPanel title="Package summary" icon={CreditCard} className="mt-5">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-4xl font-black tracking-[-0.05em] text-slate-950">{plan.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
              </div>
              {isCurrent ? <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">Current</span> : null}
            </div>

            <div className="mt-6 space-y-3">
              <PriceRow label="Monthly" value={formatPrice(plan.monthlyPrice)} />
              <PriceRow label="Annual" value={formatPrice(plan.annualPrice)} />
              <PriceRow label="Own permanently" value={formatPrice(plan.lifetimePrice)} />
            </div>

            <Button type="button" disabled className="mt-6 h-11 w-full bg-slate-950 text-white hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-500">
              {isCurrent ? "Current plan" : isOwnershipPlan ? "Ownership checkout soon" : "Checkout coming soon"}
            </Button>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-950">Everything included</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <article key={feature.key} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-teal-700" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-slate-950">
                        {feature.name}
                        {feature.limit === null ? "" : ` (${feature.limit})`}
                      </p>
                      {feature.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{feature.description}</p> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </CustomerPanel>
    </CustomerDashboardPage>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function formatPrice(value: number | null) {
  if (value == null || value === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(value);
}
