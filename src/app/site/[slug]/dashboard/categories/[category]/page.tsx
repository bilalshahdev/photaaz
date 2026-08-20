import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderTree, ImageIcon, Images, UploadCloud } from "lucide-react";
import {
  CustomerAddButton,
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerEmptyState,
  CustomerPanel,
  CustomerRecordCard
} from "@/components/customer/customer-dashboard-ui";
import { customerDashboardPath } from "@/config/routes";
import { getCustomerCategoryDetailView } from "@/services/tenant/customer-dashboard-data";

type CustomerCategoryDetailPageProps = {
  params: Promise<{ slug: string; category: string }>;
};

export default async function CustomerCategoryDetailPage({ params }: CustomerCategoryDetailPageProps) {
  const { slug, category } = await params;
  const data = await getCustomerCategoryDetailView(slug, category);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
        <Link href={customerDashboardPath(slug, "/categories")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to categories
        </Link>

        <CustomerDashboardHeader
          eyebrow="Category detail"
          title={data.category.name}
          body={data.category.parentName ?? `${data.category.photos.length} photos / ${data.category.albums.length} galleries`}
          actions={
            <CustomerAddButton href={customerDashboardPath(slug, "/photos")} icon={UploadCloud}>Upload photo</CustomerAddButton>
          }
        />

        <section className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <CustomerPanel title="Photos" icon={ImageIcon}>
            {data.category.photos.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.category.photos.map((photo) => (
                  <CustomerRecordCard key={photo.id} className="overflow-hidden p-0">
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <Image src={photo.image} alt={photo.alt} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-semibold text-slate-950">{photo.title}</h2>
                        <span className={getPhotoBadgeClass(photo.status)}>{photo.status}</span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">{photo.gallery}</p>
                    </div>
                  </CustomerRecordCard>
                ))}
              </div>
            ) : (
              <CustomerEmptyState
                title="No photos here yet."
                body="Uploaded photos linked to this category will appear here."
              />
            )}
          </CustomerPanel>

          <div className="grid gap-5">
            <CustomerPanel title="Subcategories" icon={FolderTree}>
              {data.category.children.length ? (
                <div className="grid gap-3">
                  {data.category.children.map((child) => (
                    <Link key={child.id} href={customerDashboardPath(slug, `/categories/${child.slug}`)} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 transition-colors hover:border-teal-200">
                      <div>
                        <p className="font-semibold text-slate-950">{child.name}</p>
                        <p className="mt-1 text-sm text-slate-500">/{child.slug}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        {child.photoCount} photos / {child.albumCount} galleries
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-600">No subcategories yet.</p>
              )}
            </CustomerPanel>

            <CustomerPanel title="Galleries using this category" icon={Images}>
              {data.category.albums.length ? (
                <div className="grid gap-3">
                  {data.category.albums.map((album) => (
                    <Link key={album.id} href={customerDashboardPath(slug, `/galleries/${album.slug}`)} className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 transition-colors hover:border-teal-200">
                      <div>
                        <p className="font-semibold text-slate-950">{album.title}</p>
                        <p className="mt-1 text-sm text-slate-500">/{album.slug}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-500">{album.photoCount} photos</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-600">No galleries are linked to this category yet.</p>
              )}
            </CustomerPanel>
          </div>
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
