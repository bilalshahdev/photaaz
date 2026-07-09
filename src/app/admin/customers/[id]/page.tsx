import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Bell, CalendarPlus, CheckCircle2, CreditCard, ExternalLink, Globe2, Images, RotateCcw, UserRound, XCircle, Zap } from "lucide-react";
import { booleanOnlyFeatures, featureDisplayOrder } from "@/config/features";
import { AdminPage, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
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
      <div className="mb-1">
        <Link href={"/admin/customers" as Route} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-primary">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to customers
        </Link>
      </div>
      <AdminPageHeader eyebrow="Customer Detail" title={customer.name} body={`Manage /${customer.slug}, owner details, package access, and published content.`} />

      {/* ── Overview strip ── */}
      <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-sm lg:grid-cols-4">
        <InfoCell label="Galleries" value={`${customer._count.albums} galleries`} sub={`${customer._count.photos} photos`} />
        <InfoCell label="Package" value={customer.subscription?.plan.name ?? "No plan"} sub={customer.subscription ? `${customer.subscription.status} · ${packageState.label}` : "No subscription"} tone={packageState.tone === "success" ? "green" : undefined} />
        <InfoCell label="Domain" value={customer.domains[0]?.hostname ?? `/${customer.slug}`} sub={customer.domains[0] ? `Free slug: /${customer.slug}` : "Free address"} />
        <InfoCell label="Theme" value={customer.settings?.themeKey ?? "minimal"} sub={`Locale: ${customer.defaultLocale}`} />
      </div>

      {/* ── Main layout ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Owner & Status */}
          <AdminPanel title="Owner & Status" icon={UserRound}>
            <div className="grid gap-5 md:grid-cols-[1fr_auto]">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Owner" value={customer.owner?.name ?? "No owner"} />
                <Detail label="Email" value={customer.owner?.email ?? "-"} />
                <Detail label="Theme" value={customer.settings?.themeKey ?? "minimal"} />
                <Detail label="Locale" value={customer.defaultLocale} />
              </div>
              <form
                action={async (formData) => {
                  "use server";
                  await updateTenantStatus({
                    tenantId: customer.id,
                    status: String(formData.get("status")) as "ACTIVE" | "SUSPENDED" | "DELETED"
                  });
                }}
                className="grid w-full gap-2 md:w-48"
              >
                <SelectField
                  name="status"
                  defaultValue={customer.status}
                  triggerClassName="h-10"
                  options={[
                    { label: "Active", value: "ACTIVE" },
                    { label: "Suspended", value: "SUSPENDED" },
                    { label: "Deleted", value: "DELETED" }
                  ]}
                />
                <Button type="submit" className="h-10 bg-slate-950 text-xs font-semibold text-white hover:bg-primary/90">Update status</Button>
              </form>
            </div>
          </AdminPanel>

          {/* Package / Compensation */}
          <AdminPanel title="Package / Compensation" icon={CreditCard}>
            <div className="mb-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-slate-200 bg-slate-200">
              <div className="bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Plan</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{customer.subscription?.plan.name ?? "None"}</p>
              </div>
              <div className="bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Ends</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{packageEndsAt ? formatSubscriptionDate(packageEndsAt) : "Not set"}</p>
              </div>
              <div className="bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Status</p>
                <p className={`mt-1 text-sm font-semibold ${getSubscriptionTextClass(packageState.tone)}`}>{packageState.label}</p>
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
              <SelectField name="planId" defaultValue={customer.subscription?.planId ?? plans[0]?.id} triggerClassName="h-10" options={plans.map((p) => ({ label: p.name, value: p.id }))} />
              <SelectField
                name="subscriptionStatus"
                defaultValue={customer.subscription?.status ?? "TRIALING"}
                triggerClassName="h-10"
                options={[
                  { label: "Trialing", value: "TRIALING" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Past due", value: "PAST_DUE" },
                  { label: "Canceled", value: "CANCELED" },
                  { label: "Expired", value: "EXPIRED" }
                ]}
              />
              <TextField name="currentPeriodEnds" type="date" defaultValue={customer.subscription?.currentPeriodEnds?.toISOString().slice(0, 10) ?? ""} className="h-10" />
              <TextField name="adminNote" placeholder="Extension / compensation note" defaultValue={customer.subscription?.adminNote ?? ""} className="h-10" />
              <div className="flex justify-end md:col-span-2">
                <Button type="submit" className="h-10 bg-slate-950 px-5 text-xs font-semibold text-white hover:bg-primary/90">Save package</Button>
              </div>
            </form>
          </AdminPanel>

          {/* Theme Switch */}
          <AdminPanel title="Theme Switch Control" icon={RotateCcw}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Current</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{customer.settings?.themeKey ?? "minimal"}</p>
                </div>
                <div className="flex-1 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Last switched</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{themeChangedAt ? formatSubscriptionDate(themeChangedAt) : "Never"}</p>
                </div>
              </div>
              <form action={async () => { "use server"; await resetTenantThemeSwitchCooldown({ tenantId: customer.id }); }}>
                <Button type="submit" variant="outline" className="h-10 gap-2 px-4 text-xs font-semibold">
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Reset wait
                </Button>
              </form>
            </div>
          </AdminPanel>

          {/* Extend Access */}
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
              className="grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end"
            >
              <SelectField
                name="days"
                label="Duration"
                defaultValue="30"
                triggerClassName="h-10"
                options={[
                  { label: "7 days", value: "7" },
                  { label: "14 days", value: "14" },
                  { label: "30 days", value: "30" },
                  { label: "60 days", value: "60" },
                  { label: "90 days", value: "90" },
                  { label: "1 year", value: "365" }
                ]}
              />
              <TextField name="adminNote" label="Reason" placeholder="e.g. launch compensation" className="h-10" />
              <Button type="submit" disabled={!customer.subscription} className="h-10 bg-primary px-5 text-xs font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300">
                Extend
              </Button>
            </form>
          </AdminPanel>

          {/* Features & Limits */}
          <AdminPanel title="Package Features & Limits" icon={Zap}>
            {packageFeatures.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {[...packageFeatures].sort((a, b) => {
                  const ai = featureDisplayOrder.indexOf(a.feature.key);
                  const bi = featureDisplayOrder.indexOf(b.feature.key);
                  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                }).map((access) => {
                  const isBool = booleanOnlyFeatures.has(access.feature.key);
                  return (
                    <div key={access.id} className={`flex items-start gap-2.5 rounded-md border p-3 text-sm ${access.enabled ? "border-primary/10 bg-primary/5" : "border-slate-200 bg-slate-50"}`}>
                      {access.enabled ? <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" /> : <XCircle className="mt-0.5 size-3.5 shrink-0 text-slate-400" />}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{access.feature.name}</p>
                        <p className="text-[10px] text-slate-500">
                          {!access.enabled ? "Disabled" : isBool ? "Enabled" : access.limit == null ? "Unlimited" : `Limit: ${access.limit}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No features linked to this plan.</p>
            )}
          </AdminPanel>

          {/* Content */}
          {customer.albums.length > 0 && (
            <AdminPanel title="Content" icon={Images}>
              <div className="grid gap-2 sm:grid-cols-2">
                {customer.albums.map((album) => (
                  <div key={album.id} className="rounded-md border border-slate-200 p-3 text-sm">
                    <p className="font-semibold text-slate-900">{album.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">/{album.slug} · {album._count.photos} photos · {album.published ? "Published" : "Draft"}</p>
                  </div>
                ))}
              </div>
            </AdminPanel>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Send Notification */}
          <AdminPanel title="Send Notification" icon={Bell}>
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
              <TextField name="title" required placeholder="Notification title" className="h-10" />
              <TextareaField name="body" required placeholder="Message for the client dashboard" className="min-h-24 resize-y" />
              <Button type="submit" className="h-10 bg-slate-950 text-xs font-semibold text-white hover:bg-primary/90">Send</Button>
            </form>
          </AdminPanel>

          {/* Notification History */}
          <AdminPanel title="Notification History" icon={Bell}>
            <div className="space-y-2">
              {customer.notifications.length ? customer.notifications.map((n) => (
                <article key={n.id} className="rounded-md border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">{n.body}</p>
                </article>
              )) : <p className="text-sm text-slate-500">No notifications sent yet.</p>}
            </div>
          </AdminPanel>

          {/* Quick Links */}
          <AdminPanel title="Quick Links" icon={Globe2}>
            <div className="grid gap-2">
              <Link href={`/${customer.slug}` as Route} className="flex items-center gap-2 text-sm font-medium text-primary transition hover:underline">
                <ExternalLink className="size-3.5" aria-hidden="true" />
                Open public site
              </Link>
              <Link href={`/site/${customer.slug}/dashboard` as Route} className="flex items-center gap-2 text-sm font-medium text-primary transition hover:underline">
                <ExternalLink className="size-3.5" aria-hidden="true" />
                Open customer dashboard
              </Link>
            </div>
          </AdminPanel>
        </div>
      </div>
    </AdminPage>
  );
}

function InfoCell({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "green" }) {
  return (
    <div className="bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1 truncate text-sm font-bold ${tone === "green" ? "text-primary" : "text-slate-950"}`}>{value}</p>
      <p className="mt-0.5 truncate text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-slate-900">{value}</p>
    </div>
  );
}
