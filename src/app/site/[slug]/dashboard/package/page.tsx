import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, CreditCard, Gauge, ShieldCheck } from "lucide-react";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { customerDashboardPath } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { PackageCheckoutButton } from "@/components/customer/package-checkout-button";
import { PaymentSuccessNotice } from "@/components/customer/payment-success-notice";
import { cn } from "@/lib/utils";
import { formatSubscriptionDate, getSubscriptionBadgeClass } from "@/services/subscription/lifecycle";
import { getPrimaryPlanPrice } from "@/services/subscription/plan-presentation";
import { getCustomerPackageView } from "@/services/tenant/customer-dashboard-data";

type CustomerPackagePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    checkout?: string;
    _ptxn?: string;
  }>;
};

export default async function CustomerPackagePage({ params, searchParams }: CustomerPackagePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const data = await getCustomerPackageView(slug);

  if (!data) {
    notFound();
  }

  const checkoutNotice = getCheckoutNotice(query?.checkout);
  const badgeClass = getSubscriptionBadgeClass(data.current.tone);

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Subscription"
        title="Plan and billing."
        body="Your current plan, renewal status, included limits, and available upgrade options."
      />
      {checkoutNotice?.tone === "success" ? (
        <PaymentSuccessNotice planName={data.current.name} />
      ) : checkoutNotice ? (
        <div
          className={cn(
            "mt-5 rounded-lg border px-4 py-3 text-sm font-medium",
            checkoutNotice.tone === "pending" && "border-amber-200 bg-amber-50 text-amber-900",
            checkoutNotice.tone === "error" && "border-red-200 bg-red-50 text-red-900"
          )}
        >
          {checkoutNotice.message}
        </div>
      ) : null}

      <CustomerPanel title="Current plan" icon={CreditCard} className="mt-5">
        <div className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Active plan</p>
                <h2 className="mt-3 font-display text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-5xl">{data.current.name}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{data.current.description}</p>
              </div>
              <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold sm:text-sm ${badgeClass}`}>
                {data.current.label}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Status" value={formatStatus(data.current.status)} />
              <MiniStat label="Renews / ends" value={data.current.endsAt ? formatSubscriptionDate(data.current.endsAt) : "No end date"} />
              <MiniStat label="Billing" value={pickPrimaryPrice(data.current)} />
            </div>

            <div className="mt-5">
              <Button asChild variant="outline" className="h-11">
                <Link href={customerDashboardPath(slug, `/package/${data.current.key}`)}>
                  View full plan details
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              {data.current.key !== "free" ? <a href="https://paddle.net" target="_blank" rel="noreferrer" className="ml-3 inline-flex h-11 items-center border border-slate-300 px-4 text-sm font-semibold text-slate-700">Manage or cancel with Paddle</a> : null}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Gauge className="size-5 text-teal-700" aria-hidden="true" />
              <h3 className="font-semibold text-slate-950">Usage limits</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <LimitCard label="Total photos" value={formatLimit(data.limits.photosTotal)} />
              <LimitCard label="Photos per category" value={formatLimit(data.limits.photosPerCategory)} />
              <LimitCard label="Categories" value={formatLimit(data.limits.categoriesTotal)} />
              <LimitCard label="Subcategories per category" value={formatLimit(data.limits.subcategoriesPerCategory)} />
              <LimitCard label="Galleries" value={formatLimit(data.limits.galleriesTotal)} />
              <LimitCard label="Photos per gallery" value={formatLimit(data.limits.photosPerGallery)} />
              <LimitCard label="Category requests" value={formatLimit(data.limits.categoryRequestsTotal)} />
            </div>
          </section>
        </div>
      </CustomerPanel>

      <CustomerPanel title="Available plans" icon={ShieldCheck} className="mt-5">
        <div className="grid gap-4 xl:grid-cols-2">
          {data.availablePlans.map((plan) => {
            const isCurrent = plan.key === data.current.key;
            const isOwnershipPlan = plan.key === "ownership";
            const visibleFeatures = plan.features.slice(0, 5);
            const hiddenFeatureCount = Math.max(plan.features.length - visibleFeatures.length, 0);

            return (
              <article
                key={plan.id}
                id={`plan-${plan.key}`}
                className={cn(
                  "flex h-full flex-col rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
                  isCurrent ? "border-teal-700 ring-1 ring-teal-700" : "border-slate-200"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{plan.name}</h3>
                      {plan.featured ? <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">Popular</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
                  </div>
                  {isCurrent ? <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">Current</span> : null}
                </div>

                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <PriceDisplay plan={plan} />
                  <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {plan.key === data.current.key ? "Current subscription" : "Available for this portfolio"}
                  </p>
                </div>

                {plan.lifetimePrice && plan.lifetimePrice > 0 ? (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <span className="text-slate-600">Own permanently</span>
                    <span className="font-semibold text-slate-950">{formatPrice(plan.lifetimePrice)}</span>
                  </div>
                ) : null}

                <div className="mt-5 grid flex-1 gap-2 sm:grid-cols-2">
                  {visibleFeatures.length ? (
                    visibleFeatures.map((feature) => (
                      <div key={feature.key} className="flex gap-2 text-sm leading-6 text-slate-600">
                        <Check className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" />
                        <span>
                          {feature.name}
                          {feature.limit === null ? "" : ` (${feature.limit})`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-slate-500">No public features listed yet.</p>
                  )}
                  {hiddenFeatureCount ? (
                    <p className="flex items-center text-sm font-semibold text-slate-500">+ {hiddenFeatureCount} more feature{hiddenFeatureCount === 1 ? "" : "s"}</p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Button asChild variant="outline" className="h-11">
                    <Link href={customerDashboardPath(slug, `/package/${plan.key}`)}>
                      View details
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <PackageCheckoutButton
                    tenantSlug={slug}
                    planKey={plan.key}
                    billingInterval={isOwnershipPlan ? "lifetime" : "monthly"}
                    isCurrent={isCurrent}
                    disabled={isOwnershipPlan ? !plan.checkout.lifetime : !plan.checkout.monthly}
                    className={cn(isCurrent ? "bg-slate-200 text-slate-500" : "bg-slate-950 text-white hover:bg-teal-800")}
                  >
                    {isCurrent ? "Current" : isOwnershipPlan ? "Buy ownership" : "Checkout"}
                  </PackageCheckoutButton>
                </div>
              </article>
            );
          })}
        </div>
      </CustomerPanel>
    </CustomerDashboardPage>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function LimitCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="flex min-h-28 flex-col justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="max-w-44 text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.14em] text-slate-500">{label}</p>
      <p className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{value}</p>
    </article>
  );
}

function PriceDisplay({ plan }: { plan: { monthlyPrice: number | null; annualPrice: number | null; lifetimePrice: number | null } }) {
  const price = getPrimaryPlanPrice(plan);

  return (
    <div className="flex items-end gap-2">
      <span className="pb-2 text-sm font-semibold text-slate-500">{price.prefix}</span>
      <span className="font-display text-5xl font-black leading-none tracking-[-0.06em] text-slate-950">
        {price.amount}
      </span>
      <span className="pb-2 text-sm font-medium text-slate-600">{price.suffix}</span>
    </div>
  );
}

function formatPrice(value: number | null) {
  if (value == null || value === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 100 === 0 ? 0 : 2
  }).format(value / 100);
}

function pickPrimaryPrice(plan: { monthlyPrice: number | null; annualPrice: number | null; lifetimePrice: number | null }) {
  if (plan.monthlyPrice && plan.monthlyPrice > 0) {
    return `${formatPrice(plan.monthlyPrice)} /mo`;
  }

  if (plan.annualPrice && plan.annualPrice > 0) {
    return `${formatPrice(plan.annualPrice)} /yr`;
  }

  if (plan.lifetimePrice && plan.lifetimePrice > 0) {
    return `${formatPrice(plan.lifetimePrice)} once`;
  }

  return "$0 /mo";
}

function formatLimit(value: number | null | undefined) {
  if (value == null) {
    return "Unlimited";
  }

  return new Intl.NumberFormat("en").format(value);
}

function formatStatus(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase());
}

function getCheckoutNotice(checkout: string | undefined): { tone: "success" | "pending" | "error"; message: string } | null {
  if (checkout === "success") {
    return {
      tone: "success",
      message: "Payment verified. Your plan has been updated."
    };
  }

  if (checkout === "pending") {
    return {
      tone: "pending",
      message: "Checkout returned. Paddle is still confirming the payment, so your plan will update as soon as the confirmation arrives."
    };
  }

  if (checkout === "error") {
    return {
      tone: "error",
      message: "Checkout returned, but we could not verify the payment yet. If payment was completed, the webhook will still update your plan."
    };
  }

  return null;
}
