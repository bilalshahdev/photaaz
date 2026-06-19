import { CustomerDashboardSidebar } from "@/components/layout/customer-dashboard-sidebar";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";

export default async function CustomerDashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tenant = await getCustomerDashboardView(slug);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <CustomerDashboardSidebar slug={slug} name={tenant?.name} />
      <div className="lg:pl-72">{children}</div>
    </div>
  );
}
