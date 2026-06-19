import { AdminPageHeader } from "@/components/admin/admin-ui";
import { PricingEditor } from "@/components/admin/pricing-editor";
import { getPlatformPricingPlans } from "@/services/platform/platform-data";

export default async function AdminPricingPage() {
  const plans = await getPlatformPricingPlans();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Pricing" title="Manage plans and limits." body="Edit plan copy, pricing, enabled state, and feature lists shown on marketing pages." />
        <PricingEditor initialPlans={plans} />
      </div>
    </main>
  );
}
