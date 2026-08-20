import { CustomerDashboardShell } from "@/components/layout/customer-dashboard-shell";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { currentLegalVersions } from "@/config/legal";

export default async function CustomerDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const authorizedTenant = await requireTenantOwner(slug).catch(() => null);

  if (!authorizedTenant) {
    redirect("/sign-in");
  }

  const accepted = authorizedTenant.ownerUserId ? await prisma.legalAcceptance.findUnique({
    where: { userId_termsVersion_privacyVersion: { userId: authorizedTenant.ownerUserId, termsVersion: currentLegalVersions.terms, privacyVersion: currentLegalVersions.privacy } },
    select: { id: true },
  }) : null;
  if (!accepted) redirect(`/legal-accept?returnTo=${encodeURIComponent(`/site/${slug}/dashboard`)}` as never);

  const tenant = await getCustomerDashboardView(slug);

  return (
    <CustomerDashboardShell
      slug={slug}
      name={tenant?.name}
      planName={tenant?.planName}
    >
      {children}
    </CustomerDashboardShell>
  );
}
