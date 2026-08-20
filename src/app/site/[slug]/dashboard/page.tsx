import Image from "next/image";
import { Bell, CalendarClock, CheckCircle2, FolderTree, Globe2, ImageIcon, Images, RadioTower, UploadCloud } from "lucide-react";
import {
  CustomerActionLink,
  CustomerAddButton,
  CustomerDashboardHeader,
  CustomerDashboardPage as CustomerDashboardPageShell,
  CustomerMetricCard,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { customerDashboardPath, customerPath } from "@/config/routes";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";
import { formatSubscriptionDate, getSubscriptionBadgeClass } from "@/services/subscription/lifecycle";

type CustomerDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerDashboardPage({ params }: CustomerDashboardPageProps) {
  const { slug } = await params;
  const tenant = await getCustomerDashboardView(slug);
  const title = tenant?.name ?? `/${slug}`;
  const packageBadgeClass = getSubscriptionBadgeClass(tenant?.packageTone ?? "neutral");

  return (
    <CustomerDashboardPageShell>
        <CustomerDashboardHeader
          eyebrow="Customer Dashboard"
          title={`Manage ${title}`}
          body="Keep photos, categories, galleries, domain, and subscription health in one place."
          actions={
            <>
              <CustomerAddButton href={customerDashboardPath(slug, "/photos")} icon={UploadCloud}>Upload photo</CustomerAddButton>
              <CustomerActionLink href={customerPath(slug)} target="_blank" variant="outline">
                <RadioTower className="size-4" aria-hidden="true" />
                View site
              </CustomerActionLink>
            </>
          }
          media={
            <div className="relative min-h-56 overflow-hidden rounded-lg bg-slate-900">
              <Image
                src={tenant?.heroImage ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85"}
                alt="Portfolio publish preview"
                fill
                className="object-cover opacity-80"
              />
            </div>
          }
        />
            {tenant && !tenant.packageIsUsable ? (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
                Your package is not active right now. Public showcase remains visible, but paid dashboard features may be limited until your access is renewed.
              </div>
            ) : null}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CustomerMetricCard href={customerDashboardPath(slug, "/photos")} icon={ImageIcon} label="Photos" value={String(tenant?.photoCount ?? 0)} body={`${tenant?.approvedPhotoCount ?? 0} approved / ${tenant?.pendingPhotoCount ?? 0} pending`} />
          <CustomerMetricCard href={customerDashboardPath(slug, "/categories")} icon={FolderTree} label="Categories" value={String(tenant?.categoryCount ?? 0)} body={`${tenant?.subcategoryCount ?? 0} subcategories included`} />
          <CustomerMetricCard href={customerDashboardPath(slug, "/galleries")} icon={Images} label="Galleries" value={String(tenant?.albumCount ?? 0)} body="Curated albums for public viewing" />
          <CustomerMetricCard href={customerDashboardPath(slug, "/messages")} icon={Bell} label="Unread" value={String(tenant?.unreadNotificationCount ?? 0)} body="Messages from Photaaz admin" />
        </section>

        {tenant ? (
          <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <CustomerPanel title="Subscription" icon={CalendarClock}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{tenant.planName}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Status: {tenant.subscriptionStatus}
                    {tenant.packageEndsAt ? ` / Ends ${formatSubscriptionDate(tenant.packageEndsAt)}` : " / No end date"}
                  </p>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${packageBadgeClass}`}>{tenant.packageLabel}</span>
              </div>
            </CustomerPanel>

            <CustomerPanel title="Public address" icon={Globe2}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 text-teal-700" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-950">{tenant.domain?.hostname ?? `${tenant.slug}.photaaz.com`}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {tenant.domain ? `Custom domain is ${tenant.domain.status.toLowerCase()}.` : "Using the free Photaaz subdomain until a custom domain is connected."}
                  </p>
                </div>
              </div>
            </CustomerPanel>
          </section>
        ) : null}

        {tenant?.notifications.length ? (
          <section className="mt-5">
            <CustomerPanel title="Messages from Photaaz" icon={Bell}>
              <div className="grid gap-3 md:grid-cols-2">
                {tenant.notifications.map((notification) => (
                  <article key={notification.id} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-950">{notification.title}</p>
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-400">{notification.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{notification.body}</p>
                  </article>
                ))}
              </div>
            </CustomerPanel>
          </section>
        ) : null}
    </CustomerDashboardPageShell>
  );
}
