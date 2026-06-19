import { BadgeDollarSign } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { savePlanPackage } from "@/app/admin/actions";
import { getAdminPlans } from "@/services/admin/admin-data";

export default async function AdminPackagesPage() {
  const plans = await getAdminPlans();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Packages" title="Manage customer packages." body="Control real subscription plans used by customer tenants, package prices, enabled state, and subscriber counts." />
        <AdminPanel title="Package Catalog" icon={BadgeDollarSign}>
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <form
                key={plan.id}
                action={async (formData) => {
                  "use server";
                  await savePlanPackage({
                    id: plan.id,
                    name: String(formData.get("name")),
                    monthlyPrice: Number(formData.get("monthlyPrice")),
                    annualPrice: Number(formData.get("annualPrice")),
                    lifetimePrice: Number(formData.get("lifetimePrice")),
                    enabled: formData.get("enabled") === "on"
                  });
                }}
                className="grid gap-3 border border-slate-200 p-4"
              >
                <input name="name" defaultValue={plan.name} className="h-10 border border-slate-200 px-3 font-semibold outline-none focus:border-teal-700" />
                <label className="text-sm text-slate-600">
                  Monthly price
                  <input name="monthlyPrice" type="number" defaultValue={plan.monthlyPrice ?? 0} className="mt-1 h-10 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
                </label>
                <label className="text-sm text-slate-600">
                  Annual price
                  <input name="annualPrice" type="number" defaultValue={plan.annualPrice ?? 0} className="mt-1 h-10 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
                </label>
                <label className="text-sm text-slate-600">
                  Lifetime price
                  <input name="lifetimePrice" type="number" defaultValue={plan.lifetimePrice ?? 0} className="mt-1 h-10 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input name="enabled" type="checkbox" defaultChecked={plan.enabled} />
                  Enabled
                </label>
                <p className="text-sm text-slate-500">{plan._count.subscriptions} subscriptions</p>
                <button type="submit" className="h-10 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white">Save package</button>
              </form>
            ))}
          </div>
        </AdminPanel>
      </div>
    </main>
  );
}
