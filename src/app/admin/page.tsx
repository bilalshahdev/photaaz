import { BadgeDollarSign, Images, LifeBuoy, Mail, Palette, Tags, UsersRound, Wand2 } from "lucide-react";
import { AdminPanel, MetricCard } from "@/components/admin/admin-ui";
import { getAdminDashboardStats } from "@/services/admin/admin-data";
import { getPlatformPhotographyTypes, getPlatformPricingPlans, getPlatformSupportRequests, getPlatformThemes } from "@/services/platform/platform-data";

export default async function AdminPage() {
  const [stats, themes, photographyTypes, pricingPlans, supportRequests] = await Promise.all([
    getAdminDashboardStats(),
    getPlatformThemes(),
    getPlatformPhotographyTypes(),
    getPlatformPricingPlans(),
    getPlatformSupportRequests()
  ]);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Super Admin</p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.04em]">Platform Control Center</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Manage the defaults customers see across landing pages, demos, onboarding, themes, pricing, and support.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={UsersRound} label="Customers" value={String(stats.tenants)} body={`${stats.users} owner accounts`} />
          <MetricCard icon={BadgeDollarSign} label="Estimated MRR" value={`$${stats.monthlyRevenue}`} body={`${stats.activeSubscriptions} active/trial packages`} />
          <MetricCard icon={Palette} label="Themes" value={String(themes.length)} body="Managed theme catalog" />
          <MetricCard icon={LifeBuoy} label="Support" value={String(stats.supportOpen)} body={`${supportRequests.length} total requests`} />
        </div>

        <section className="mt-6 grid gap-6 xl:grid-cols-3">
          <AdminPanel title="What Admin Controls" icon={Wand2}>
            <ul className="space-y-3 text-sm leading-6 text-slate-600">
              <li>Landing hero copy, CTA labels, and feature cards.</li>
              <li>Theme catalog, demos, and onboarding options.</li>
              <li>Photography focus categories and starter category seeds.</li>
            </ul>
          </AdminPanel>
          <AdminPanel title="Demo Inventory" icon={Images}>
            <p className="text-sm leading-6 text-slate-600">
              {themes.length} theme demos are available from the theme catalog. Demo content is still sample data.
            </p>
          </AdminPanel>
          <AdminPanel title="Operations" icon={Mail}>
            <p className="text-sm leading-6 text-slate-600">
              {pricingPlans.length} marketing pricing cards, {stats.coupons} active coupons, and {stats.unreadNotifications} unread client notifications are tracked.
            </p>
          </AdminPanel>
        </section>

        <section className="mt-6 border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Admin settings are local DB-backed when Postgres is connected, with safe fallback data for development.
          Production admin auth still needs server sessions, hashed passwords, role checks, and audit logs.
        </section>
      </div>
    </main>
  );
}
