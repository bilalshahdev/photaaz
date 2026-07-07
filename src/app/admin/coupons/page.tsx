import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { CouponCatalog } from "@/components/admin/coupon-catalog";
import { getAdminCoupons } from "@/services/admin/admin-data";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Coupons" title="Manage discounts and coupons." body="Create promo codes, discount values, expiry dates, usage limits, and active states." />
      <CouponCatalog coupons={coupons} />
    </AdminPage>
  );
}
