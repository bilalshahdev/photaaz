import { notFound } from "next/navigation";
import { Images } from "lucide-react";
import { CustomerGalleryManager } from "@/components/customer/customer-gallery-manager";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { getCustomerGalleriesView } from "@/services/tenant/customer-dashboard-data";

type CustomerGalleriesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerGalleriesPage({ params }: CustomerGalleriesPageProps) {
  const { slug } = await params;
  const data = await getCustomerGalleriesView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
        <CustomerDashboardHeader
          eyebrow="Galleries"
          title="Curate public galleries."
          body="Galleries are albums made from uploaded photos. Categories organize photos; galleries tell the finished story."
        />

        <section className="mt-5">
          <CustomerGalleryManager tenantSlug={slug} galleries={data.albums} categories={data.uploadCategories} />
        </section>

        <section className="mt-5">
          <CustomerPanel title="How galleries work" icon={Images}>
            <p className="text-sm leading-6 text-slate-600">
              Galleries are public albums built from approved photos. Create the gallery here, then assign photos from the photo library.
            </p>
          </CustomerPanel>
        </section>
    </CustomerDashboardPage>
  );
}
