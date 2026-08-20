import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Images, UploadCloud } from "lucide-react";
import {
  CustomerAddButton,
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerEmptyState,
  CustomerPanel,
  CustomerRecordCard,
  CustomerStatusPill
} from "@/components/customer/customer-dashboard-ui";
import { Button } from "@/components/ui/button";
import { customerDashboardPath, customerPath } from "@/config/routes";
import { getCustomerGalleryDetailView } from "@/services/tenant/customer-dashboard-data";

type CustomerGalleryDetailPageProps = {
  params: Promise<{ slug: string; album: string }>;
};

export default async function CustomerGalleryDetailPage({ params }: CustomerGalleryDetailPageProps) {
  const { slug, album } = await params;
  const data = await getCustomerGalleryDetailView(slug, album);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
        <Link href={customerDashboardPath(slug, "/galleries")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to galleries
        </Link>

        <CustomerDashboardHeader
          eyebrow="Gallery detail"
          title={data.album.title}
          body={data.album.description ?? "No description yet."}
          actions={
            <>
              <Button asChild variant="outline">
                <Link href={customerPath(slug, "/gallery")} target="_blank">
                  <Eye className="size-4" aria-hidden="true" />
                  View public gallery
                </Link>
              </Button>
              <CustomerAddButton href={customerDashboardPath(slug, "/photos")} icon={UploadCloud}>Add photos</CustomerAddButton>
            </>
          }
        />

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600">{data.album.category}</span>
                <CustomerStatusPill active={data.album.published} activeLabel="Published" inactiveLabel="Draft" inactiveClassName="bg-amber-50 text-amber-800" />
                {data.album.featured ? <span className="rounded-full bg-slate-950 px-3 py-1.5 text-white">Featured</span> : null}
        </div>

        <section className="mt-5">
          <CustomerPanel title={`${data.album.photos.length} photos in this gallery`} icon={Images}>
            {data.album.photos.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {data.album.photos.map((photo) => (
                  <CustomerRecordCard key={photo.id} className="overflow-hidden p-0">
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <Image src={photo.image} alt={photo.alt} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-semibold text-slate-950">{photo.title}</h2>
                        <span className={getPhotoBadgeClass(photo.status)}>{photo.status}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{photo.createdAt.toLocaleDateString("en-US")}</p>
                    </div>
                  </CustomerRecordCard>
                ))}
              </div>
            ) : (
              <CustomerEmptyState
                title="No photos inside this gallery yet."
                body="Upload photos, then assign them to this gallery in the next media-management pass."
              />
            )}
          </CustomerPanel>
        </section>
    </CustomerDashboardPage>
  );
}

function getPhotoBadgeClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "rounded-full bg-teal-50 px-2.5 py-1 text-[0.65rem] font-semibold text-teal-800";
    case "REJECTED":
    case "FLAGGED":
      return "rounded-full bg-red-50 px-2.5 py-1 text-[0.65rem] font-semibold text-red-700";
    default:
      return "rounded-full bg-amber-50 px-2.5 py-1 text-[0.65rem] font-semibold text-amber-800";
  }
}
