import { notFound } from "next/navigation";
import { CustomerCategoryManager } from "@/components/customer/customer-category-manager";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage
} from "@/components/customer/customer-dashboard-ui";
import { getCustomerCategoriesView } from "@/services/tenant/customer-dashboard-data";

type CustomerCategoriesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerCategoriesPage({ params }: CustomerCategoriesPageProps) {
  const { slug } = await params;
  const data = await getCustomerCategoriesView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
        <CustomerDashboardHeader
          eyebrow="Categories"
          title="Organize photo types."
          body="Categories and subcategories decide where uploads live. If something is missing, request it for Photaaz review."
        />

        <section className="mt-5">
          <CustomerCategoryManager
            tenantSlug={slug}
            categories={data.categories}
            availableCategories={data.availableCategories}
            canRequestCustomCategories={data.canRequestCustomCategories}
            categoryRequestLimit={data.categoryRequestLimit}
            parentCategoryOptions={data.parentCategoryOptions}
            requests={data.categoryRequests}
          />
        </section>
    </CustomerDashboardPage>
  );
}
