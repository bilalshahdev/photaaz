import { notFound } from "next/navigation";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage
} from "@/components/customer/customer-dashboard-ui";
import { CustomerPhotoLibrary } from "@/components/customer/customer-photo-library";
import { getCustomerPhotosView } from "@/services/tenant/customer-dashboard-data";

type CustomerPhotosPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerPhotosPage({ params }: CustomerPhotosPageProps) {
  const { slug } = await params;
  const data = await getCustomerPhotosView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Photos"
        title="Photo library."
        body="Review uploaded photos, update their category, or add new images for approval."
      />

      <CustomerPhotoLibrary tenantSlug={slug} categories={data.uploadCategories} galleries={data.galleryOptions} photos={data.photos} />
    </CustomerDashboardPage>
  );
}
