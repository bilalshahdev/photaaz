import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { Bell, CreditCard, Globe2, Images, UserRound } from "lucide-react";
import { AdminPageHeader, AdminPanel, MetricCard } from "@/components/admin/admin-ui";
import { sendClientNotification, updateTenantPlan, updateTenantStatus } from "@/app/admin/actions";
import { getAdminCustomerById, getAdminPlans } from "@/services/admin/admin-data";

type AdminCustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { id } = await params;
  const [customer, plans] = await Promise.all([getAdminCustomerById(id), getAdminPlans()]);

  if (!customer) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Customer Detail" title={customer.name} body={`Manage /${customer.slug}, owner details, package access, notifications, domains, and published content.`} />

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Images} label="Galleries" value={String(customer._count.albums)} body={`${customer._count.photos} photos`} />
          <MetricCard icon={CreditCard} label="Package" value={customer.subscription?.plan.name ?? "No plan"} body={customer.subscription?.status ?? "No subscription"} />
          <MetricCard icon={Globe2} label="Domains" value={String(customer.domains.length)} body={`Free slug: /${customer.slug}`} />
          <MetricCard icon={Bell} label="Messages" value={String(customer.notifications.length)} body="Latest dashboard notifications" />
        </div>

        <section className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
          <div className="grid gap-6">
            <AdminPanel title="Owner & Status" icon={UserRound}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-sm leading-6 text-slate-600">
                  <p><strong className="text-slate-950">Owner:</strong> {customer.owner?.name ?? "No owner"}</p>
                  <p><strong className="text-slate-950">Email:</strong> {customer.owner?.email ?? "-"}</p>
                  <p><strong className="text-slate-950">Theme:</strong> {customer.settings?.themeKey ?? "minimal"}</p>
                  <p><strong className="text-slate-950">Locale:</strong> {customer.defaultLocale}</p>
                </div>
                <form
                  action={async (formData) => {
                    "use server";
                    await updateTenantStatus({
                      tenantId: customer.id,
                      status: String(formData.get("status")) as "ACTIVE" | "SUSPENDED" | "DELETED"
                    });
                  }}
                  className="grid gap-3"
                >
                  <select name="status" defaultValue={customer.status} className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700">
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="DELETED">Deleted</option>
                  </select>
                  <button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white">Update status</button>
                </form>
              </div>
            </AdminPanel>

            <AdminPanel title="Package / Compensation" icon={CreditCard}>
              <form
                action={async (formData) => {
                  "use server";
                  await updateTenantPlan({
                    tenantId: customer.id,
                    planId: String(formData.get("planId")),
                    status: String(formData.get("subscriptionStatus")) as "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "EXPIRED",
                    currentPeriodEnds: String(formData.get("currentPeriodEnds") ?? ""),
                    adminNote: String(formData.get("adminNote") ?? "")
                  });
                }}
                className="grid gap-3 md:grid-cols-2"
              >
                <select name="planId" defaultValue={customer.subscription?.planId ?? plans[0]?.id} className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700">
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
                <select name="subscriptionStatus" defaultValue={customer.subscription?.status ?? "TRIALING"} className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700">
                  <option value="TRIALING">Trialing</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PAST_DUE">Past due</option>
                  <option value="CANCELED">Canceled</option>
                  <option value="EXPIRED">Expired</option>
                </select>
                <input name="currentPeriodEnds" type="date" defaultValue={customer.subscription?.currentPeriodEnds?.toISOString().slice(0, 10) ?? ""} className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
                <input name="adminNote" placeholder="Extension / compensation note" defaultValue={customer.subscription?.adminNote ?? ""} className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
                <button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white md:col-span-2">Save package</button>
              </form>
            </AdminPanel>

            <AdminPanel title="Content" icon={Images}>
              <div className="grid gap-3 md:grid-cols-2">
                {customer.albums.map((album) => (
                  <div key={album.id} className="border border-slate-200 p-4 text-sm">
                    <p className="font-semibold">{album.title}</p>
                    <p className="mt-1 text-slate-500">/{album.slug} · {album._count.photos} photos · {album.published ? "Published" : "Draft"}</p>
                  </div>
                ))}
              </div>
            </AdminPanel>
          </div>

          <div className="grid gap-6">
            <AdminPanel title="Send Client Notification" icon={Bell}>
              <form
                action={async (formData) => {
                  "use server";
                  await sendClientNotification({
                    tenantId: customer.id,
                    title: String(formData.get("title")),
                    body: String(formData.get("body")),
                    channel: "dashboard"
                  });
                }}
                className="grid gap-3"
              >
                <input name="title" required placeholder="Message title" className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
                <textarea name="body" required placeholder="Message body for the client dashboard" className="min-h-28 resize-y border border-slate-200 px-3 py-2 outline-none focus:border-teal-700" />
                <button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white">Send message</button>
              </form>
            </AdminPanel>

            <AdminPanel title="Latest Notifications" icon={Bell}>
              <div className="space-y-3">
                {customer.notifications.length ? customer.notifications.map((notification) => (
                  <article key={notification.id} className="border border-slate-200 p-3 text-sm">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="mt-1 text-slate-600">{notification.body}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">{notification.status}</p>
                  </article>
                )) : <p className="text-sm text-slate-600">No messages sent yet.</p>}
              </div>
            </AdminPanel>

            <AdminPanel title="Quick Links" icon={Globe2}>
              <div className="grid gap-2 text-sm font-semibold text-teal-700">
                <Link href={`/${customer.slug}` as Route}>Open public site</Link>
                <Link href={`/site/${customer.slug}/dashboard` as Route}>Open customer dashboard</Link>
                <Link href={"/admin/customers" as Route}>Back to customers</Link>
              </div>
            </AdminPanel>
          </div>
        </section>
      </div>
    </main>
  );
}
