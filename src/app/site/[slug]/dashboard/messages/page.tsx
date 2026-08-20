import { notFound } from "next/navigation";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage
} from "@/components/customer/customer-dashboard-ui";
import { CustomerMessageManager } from "@/components/customer/customer-message-manager";
import { getCustomerCommunicationView } from "@/services/tenant/customer-dashboard-data";

type CustomerMessagesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerMessagesPage({ params }: CustomerMessagesPageProps) {
  const { slug } = await params;
  const data = await getCustomerCommunicationView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Admin Messages"
        title="Talk with Photaaz admin."
        body="Internal messages between this client dashboard and the Photaaz super admin."
      />

      <section className="mt-5">
        <CustomerMessageManager tenantSlug={slug} threads={data.threads} />
      </section>
    </CustomerDashboardPage>
  );
}
