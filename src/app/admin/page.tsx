import Link from "next/link";
import type { Route } from "next";
import { AlertTriangle, BadgeDollarSign, CalendarClock, Camera, FileText, Images, LifeBuoy, ShieldAlert, Tags, UsersRound } from "lucide-react";
import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { getAdminDashboardStats } from "@/services/admin/admin-data";

export default async function AdminOverviewPage() {
  const stats = await getAdminDashboardStats();

  const needsAttention = stats.pendingModeration + stats.supportOpen + stats.pendingCategoryRequests + stats.expiringSoonSubscriptions;

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Super Admin" title="Platform Overview" body="Key metrics, alerts, and quick actions across the platform." />

      {/* ── Attention banner ── */}
      {needsAttention > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm text-amber-900">
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          <span>
            <strong>{needsAttention} item{needsAttention === 1 ? "" : "s"} need attention:</strong>{" "}
            {stats.pendingModeration > 0 && <>{stats.pendingModeration} pending moderation · </>}
            {stats.supportOpen > 0 && <>{stats.supportOpen} open support · </>}
            {stats.pendingCategoryRequests > 0 && <>{stats.pendingCategoryRequests} category requests · </>}
            {stats.expiringSoonSubscriptions > 0 && <>{stats.expiringSoonSubscriptions} expiring packages</>}
          </span>
        </div>
      )}

      {/* ── Primary metrics ── */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Customers" value={stats.tenants} sub={`${stats.users} owner accounts`} href="/admin/customers" />
        <Stat label="Est. MRR" value={`$${stats.monthlyRevenue.toLocaleString("en-US")}`} sub={`${stats.activeSubscriptions} active subscriptions`} href="/admin/packages" />
        <Stat label="Photos" value={stats.totalPhotos.toLocaleString("en-US")} sub={`${stats.totalAlbums} galleries`} />
        <Stat label="Blog Posts" value={stats.totalBlogs} sub={`Across all tenants`} />
      </div>

      {/* ── Secondary metrics + Quick actions ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Subscription health */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Subscription Health</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat icon={BadgeDollarSign} label="Active / Trial" value={stats.activeSubscriptions} tone="green" />
              <MiniStat icon={CalendarClock} label="Expiring in 7d" value={stats.expiringSoonSubscriptions} tone={stats.expiringSoonSubscriptions > 0 ? "amber" : "default"} />
              <MiniStat icon={CalendarClock} label="Expired" value={stats.expiredSubscriptions} tone={stats.expiredSubscriptions > 0 ? "red" : "default"} />
            </div>
          </div>

          {/* Moderation & Support */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Moderation & Support</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat icon={ShieldAlert} label="Pending moderation" value={stats.pendingModeration} tone={stats.pendingModeration > 0 ? "amber" : "default"} href="/admin/moderation" />
              <MiniStat icon={Tags} label="Category requests" value={stats.pendingCategoryRequests} tone={stats.pendingCategoryRequests > 0 ? "amber" : "default"} href="/admin/categories" />
              <MiniStat icon={LifeBuoy} label="Open support" value={stats.supportOpen} tone={stats.supportOpen > 0 ? "amber" : "default"} href="/admin/support" />
            </div>
          </div>

          {/* Platform content */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Platform Inventory</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat icon={Camera} label="Photos uploaded" value={stats.totalPhotos} />
              <MiniStat icon={Images} label="Galleries" value={stats.totalAlbums} />
              <MiniStat icon={FileText} label="Blog posts" value={stats.totalBlogs} />
            </div>
          </div>
        </div>

        {/* Quick actions sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
            <div className="mt-3 grid gap-2">
              <QuickLink href="/admin/customers/new" label="Register new customer" />
              <QuickLink href="/admin/moderation" label="Review moderation queue" />
              <QuickLink href="/admin/support" label="Check support requests" />
              <QuickLink href="/admin/landing" label="Edit landing page" />
              <QuickLink href="/admin/themes" label="Manage theme catalog" />
              <QuickLink href="/admin/packages" label="Edit packages & pricing" />
              <QuickLink href="/admin/settings" label="App configuration" />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Operations</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>{stats.coupons} active coupon{stats.coupons === 1 ? "" : "s"}</p>
              <p>{stats.unreadNotifications} unread client notification{stats.unreadNotifications === 1 ? "" : "s"}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

function Stat({ label, value, sub, href }: { label: string; value: string | number; sub: string; href?: string }) {
  const content = (
    <div className="bg-white p-5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
    </div>
  );

  if (href) {
    return <Link href={href as Route} className="transition hover:bg-slate-50">{content}</Link>;
  }

  return content;
}

function MiniStat({ icon: Icon, label, value, tone = "default", href }: { icon: React.ElementType; label: string; value: number; tone?: "default" | "green" | "amber" | "red"; href?: string }) {
  const toneClass = tone === "green" ? "text-primary" : tone === "amber" ? "text-amber-600" : tone === "red" ? "text-red-600" : "text-slate-900";
  const bgClass = tone === "green" ? "bg-primary/5" : tone === "amber" ? "bg-amber-50" : tone === "red" ? "bg-red-50" : "bg-slate-50";

  const content = (
    <div className={`flex items-center gap-3 rounded-md border border-slate-200 p-3 ${bgClass}`}>
      <Icon className={`size-4 shrink-0 ${toneClass}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className={`text-lg font-bold ${toneClass}`}>{value}</p>
        <p className="text-[10px] text-slate-500">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href as Route} className="transition hover:opacity-80">{content}</Link>;
  }

  return content;
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href as Route} className="flex items-center gap-2 rounded-md border border-slate-100 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary">
      {label}
    </Link>
  );
}
