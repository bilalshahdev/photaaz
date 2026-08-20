import { notFound } from "next/navigation";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage
} from "@/components/customer/customer-dashboard-ui";
import { CustomerBlogCategoryManager } from "@/components/customer/customer-blog-category-manager";
import { getCustomerBlogCategoriesView } from "@/services/tenant/customer-dashboard-data";

type CustomerBlogCategoriesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerBlogCategoriesPage({ params }: CustomerBlogCategoriesPageProps) {
  const { slug } = await params;
  const data = await getCustomerBlogCategoriesView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Blog Categories"
        title="Organize journal posts."
        body="Create editorial categories for blog posts, separate from photography categories used for uploaded photos."
      />

      <section className="mt-5">
        <CustomerBlogCategoryManager tenantSlug={slug} categories={data.categories} />
      </section>
    </CustomerDashboardPage>
  );
}
