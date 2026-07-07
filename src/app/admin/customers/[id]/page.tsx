import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { Bell, CalendarPlus, CheckCircle2, CreditCard, Globe2, Images, RotateCcw, UserRound, XCircle } from "lucide-react";
import { AdminPage, AdminPageHeader, AdminPanel, MetricCard } from "@/components/admin/admin-ui";
import { SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import { extendTenantPackage, resetTenantThemeSwitchCooldown, sendClientNotification, updateTenantPlan, updateTenantStatus } from "@/app/admin/actions";
import { getAdminCustomerById, getAdminPlans } from "@/services/admin/admin-data";
import { formatSubscriptionDate, getSubscriptionLifecycle, getSubscriptionTextClass } from "@/services/subscription/lifecycle";

type AdminCustomerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { id } = await params;
  const [customer, plans] = await Promise.all([getAdminCustomerById(id), getAdminPlans()]);

  if (!customer) {
    notFound();
  }

  const packageEndsAt = customer.subscription?.currentPeriodEnds ?? null;
  const packageState = getSubscriptionLifecycle(customer.subscription);
  const packageFeatures = customer.subscription?.plan.features ?? [];
  const themeChangedAt = customer.settings?.themeChangedAt ?? null;

  return (
    <AdminPage>
        <AdminPageHeader eyebrow="Customer Detail" title={customer.name} body={`Manage /${customer.slug}, owner details, package access, notifications, domain, and published content.`} />

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Images} label="Galleries" value={String(customer._count.albums)} body={`${customer._count.photos} photos`} />
          <MetricCard icon={CreditCard} label="Package" value={customer.subscription?.plan.name ?? "No plan"} body={customer.subscription ? `${customer.subscription.status} · ${packageState.label}` : "No subscription"} />
          <MetricCard icon={Globe2} label="Domain" value={customer.domains[0]?.hostname ?? "Free address"} body={`Free slug: /${customer.slug}`} />
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
                  <SelectField
                    name="status"
                    defaultValue={customer.status}
                    triggerClassName="h-11"
                    options={[
                      { label: "Active", value: "ACTIVE" },
                      { label: "Suspended", value: "SUSPENDED" },
                      { label: "Deleted", value: "DELETED" }
                    ]}
                  />
                  <Button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">Update status</Button>
                </form>
              </div>
            </AdminPanel>

            <AdminPanel title="Theme Switch Control" icon={RotateCcw}>
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Current theme</p>
                    <p className="mt-1 font-semibold text-slate-950">{customer.settings?.themeKey ?? "minimal"}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Last switched</p>
                    <p className="mt-1 font-semibold text-slate-950">{themeChangedAt ? formatSubscriptionDate(themeChangedAt) : "Not switched yet"}</p>
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await resetTenantThemeSwitchCooldown({ tenantId: customer.id });
                  }}
                >
                  <Button type="submit" variant="outline" className="h-11 gap-2 px-4 font-semibold">
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Reset theme wait
                  </Button>
                </form>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                This only clears the tenant&apos;s theme switch wait. The global wait duration is managed from App Config.
              </p>
            </AdminPanel>

            <AdminPanel title="Package / Compensation" icon={CreditCard}>
              <div className="mb-5 grid gap-3 border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-3">
                <div>
                  <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Current plan</p>
                  <p className="mt-1 font-semibold text-slate-950">{customer.subscription?.plan.name ?? "No plan assigned"}</p>
                </div>
                <div>
                  <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Access ends</p>
                  <p className="mt-1 font-semibold text-slate-950">{packageEndsAt ? formatSubscriptionDate(packageEndsAt) : "Not set"}</p>
                </div>
                <div>
                  <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
                  <p className={`mt-1 font-semibold ${getSubscriptionTextClass(packageState.tone)}`}>{packageState.label}</p>
                </div>
              </div>

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
                <SelectField name="planId" defaultValue={customer.subscription?.planId ?? plans[0]?.id} triggerClassName="h-11" options={plans.map((plan) => ({ label: plan.name, value: plan.id }))} />
                <SelectField
                  name="subscriptionStatus"
                  defaultValue={customer.subscription?.status ?? "TRIALING"}
                  triggerClassName="h-11"
                  options={[
                    { label: "Trialing", value: "TRIALING" },
                    { label: "Active", value: "ACTIVE" },
                    { label: "Past due", value: "PAST_DUE" },
                    { label: "Canceled", value: "CANCELED" },
                    { label: "Expired", value: "EXPIRED" }
                  ]}
                />
                <TextField name="currentPeriodEnds" type="date" defaultValue={customer.subscription?.currentPeriodEnds?.toISOString().slice(0, 10) ?? ""} className="h-11" />
                <TextField name="adminNote" placeholder="Extension / compensation note" defaultValue={customer.subscription?.adminNote ?? ""} className="h-11" />
                <Button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800 md:col-span-2">Save package</Button>
              </form>
            </AdminPanel>

            <AdminPanel title="Package Features & Limits" icon={CheckCircle2}>
              {packageFeatures.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {packageFeatures.map((access) => (
                    <div key={access.id} className={`border p-4 text-sm ${access.enabled ? "border-teal-100 bg-teal-50/40" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex items-start gap-3">
                        {access.enabled ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" /> : <XCircle className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-950">{access.feature.name}</p>
                          <p className="mt-1 font-mono text-xs text-slate-500">{access.feature.key}</p>
                          {access.feature.description ? <p className="mt-2 leading-6 text-slate-600">{access.feature.description}</p> : null}
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {access.enabled ? `Limit: ${access.limit == null ? "Unlimited" : access.limit.toLocaleString("en-US")}` : "Disabled"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">No package features are linked to this plan yet. Add them from Packages.</p>
              )}
            </AdminPanel>

            <AdminPanel title="Extend Package Access" icon={CalendarPlus}>
              <form
                action={async (formData) => {
                  "use server";
                  await extendTenantPackage({
                    tenantId: customer.id,
                    days: Number(formData.get("days")),
                    adminNote: String(formData.get("adminNote") ?? "")
                  });
                }}
                className="grid gap-3"
              >
                <div className="grid gap-3 sm:grid-cols-[0.45fr_0.55fr]">
                  <SelectField
                    name="days"
                    defaultValue="30"
                    triggerClassName="h-11"
                    options={[
                      { label: "7 days", value: "7" },
                      { label: "14 days", value: "14" },
                      { label: "30 days", value: "30" },
                      { label: "60 days", value: "60" },
                      { label: "90 days", value: "90" },
                      { label: "1 year", value: "365" }
                    ]}
                  />
                  <TextField name="adminNote" placeholder="Reason, e.g. launch compensation" className="h-11" />
                </div>
                <p className="text-sm leading-6 text-slate-500">
                  Extends from the current end date if it is still active, otherwise from today. The client will receive a dashboard notification.
                </p>
                <Button type="submit" disabled={!customer.subscription} className="h-11 bg-teal-700 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                  Extend access
                </Button>
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
                <TextField name="title" required placeholder="Message title" className="h-11" />
                <TextareaField name="body" required placeholder="Message body for the client dashboard" className="min-h-28 resize-y" />
                <Button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">Send message</Button>
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
    </AdminPage>
  );
}
