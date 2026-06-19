import { Tags } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { saveCoupon } from "@/app/admin/actions";
import { getAdminCoupons } from "@/services/admin/admin-data";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Coupons" title="Manage discounts and coupons." body="Create promo codes, discount values, expiry dates, usage limits, and active states." />
        <section className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
          <AdminPanel title="Create Coupon" icon={Tags}>
            <CouponForm />
          </AdminPanel>
          <AdminPanel title="Coupon List" icon={Tags}>
            <div className="grid gap-3">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="border border-slate-200 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{coupon.code}</p>
                      <p className="mt-1 text-sm text-slate-600">{coupon.type === "PERCENT" ? `${coupon.amount}% off` : `$${coupon.amount} off`} · {coupon.enabled ? "Active" : "Disabled"}</p>
                    </div>
                    <p className="text-xs text-slate-500">{coupon.redeemedCount}/{coupon.maxRedemptions ?? "∞"} used</p>
                  </div>
                  <CouponForm coupon={coupon} />
                </div>
              ))}
            </div>
          </AdminPanel>
        </section>
      </div>
    </main>
  );
}

function CouponForm({ coupon }: { coupon?: Awaited<ReturnType<typeof getAdminCoupons>>[number] }) {
  return (
    <form
      action={async (formData) => {
        "use server";
        await saveCoupon({
          id: coupon?.id,
          code: String(formData.get("code")),
          type: String(formData.get("type")) as "PERCENT" | "FIXED",
          amount: Number(formData.get("amount")),
          enabled: formData.get("enabled") === "on",
          maxRedemptions: formData.get("maxRedemptions") ? Number(formData.get("maxRedemptions")) : null,
          expiresAt: String(formData.get("expiresAt") ?? ""),
          notes: String(formData.get("notes") ?? "")
        });
      }}
      className="grid gap-3 md:grid-cols-2"
    >
      <input name="code" required placeholder="CODE" defaultValue={coupon?.code ?? ""} className="h-10 border border-slate-200 px-3 outline-none focus:border-teal-700" />
      <select name="type" defaultValue={coupon?.type ?? "PERCENT"} className="h-10 border border-slate-200 px-3 outline-none focus:border-teal-700">
        <option value="PERCENT">Percent</option>
        <option value="FIXED">Fixed</option>
      </select>
      <input name="amount" required type="number" min={1} defaultValue={coupon?.amount ?? 10} className="h-10 border border-slate-200 px-3 outline-none focus:border-teal-700" />
      <input name="maxRedemptions" type="number" min={1} placeholder="Max redemptions" defaultValue={coupon?.maxRedemptions ?? ""} className="h-10 border border-slate-200 px-3 outline-none focus:border-teal-700" />
      <input name="expiresAt" type="date" defaultValue={coupon?.expiresAt?.toISOString().slice(0, 10) ?? ""} className="h-10 border border-slate-200 px-3 outline-none focus:border-teal-700" />
      <label className="flex items-center gap-2 text-sm font-medium">
        <input name="enabled" type="checkbox" defaultChecked={coupon?.enabled ?? true} />
        Enabled
      </label>
      <textarea name="notes" placeholder="Internal notes" defaultValue={coupon?.notes ?? ""} className="min-h-20 resize-y border border-slate-200 px-3 py-2 outline-none focus:border-teal-700 md:col-span-2" />
      <button type="submit" className="h-10 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white md:col-span-2">{coupon ? "Save coupon" : "Create coupon"}</button>
    </form>
  );
}
