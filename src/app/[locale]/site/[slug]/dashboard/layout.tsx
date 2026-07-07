import { CustomerDashboardShell } from "@/components/layout/customer-dashboard-shell";
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
    <CustomerDashboardShell slug={slug} name={tenant?.name}>
      {children}
    </CustomerDashboardShell>
  );
}
