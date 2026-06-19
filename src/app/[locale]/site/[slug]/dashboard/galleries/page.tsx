import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Images } from "lucide-react";
import { getCustomerGalleriesView } from "@/services/tenant/customer-dashboard-data";
import { createCustomerPhoto } from "@/app/[locale]/site/[slug]/dashboard/galleries/photo-actions";

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
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Galleries</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Manage albums and categories.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            {data.categories.length} categories and {data.albums.length} starter galleries for {data.name}.
          </p>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold">Categories</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Categories and subcategories are managed by PhotoFolio admin. Photos can be uploaded only to categories without subcategories.
            </p>
            <div className="mt-4 space-y-2">
              {data.categories.map((category) => (
                <div key={category.id} className="rounded-md border border-slate-200 p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-medium text-slate-950">{category.name}</span>
                      <p className="mt-1 text-xs text-slate-500">
                        {category.albumCount} albums · {category.photoCount} direct photos
                      </p>
                    </div>
                    <CheckCircle2 className="size-4 shrink-0 text-teal-700" aria-hidden="true" />
                  </div>
                  {category.children.length ? (
                    <div className="mt-3 space-y-2 border-l border-slate-200 pl-3">
                      {category.children.map((child) => (
                        <div key={child.id} className="rounded-md bg-slate-50 px-3 py-2">
                          <p className="font-medium text-slate-800">{child.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {child.albumCount} albums · {child.photoCount} direct photos
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold">Upload photo</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select a final category. Parent categories with subcategories are not selectable here.
              </p>
              <form action={createCustomerPhoto} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_1.2fr_auto]">
                <input type="hidden" name="tenantSlug" value={slug} />
                <input name="title" required minLength={2} placeholder="Photo title" className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-700" />
                <select name="categoryId" required className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-700">
                  <option value="">Choose category</option>
                  {data.uploadCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <input name="imageUrl" required type="url" placeholder="Image URL" className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-teal-700" />
                <button type="submit" className="h-11 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-800">
                  Upload
                </button>
              </form>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              {data.albums.map((album) => (
                <article key={album.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    {album.coverImage ? <Image src={album.coverImage} alt={album.title} fill className="object-cover" /> : <Images className="absolute left-5 top-5 size-6 text-slate-400" aria-hidden="true" />}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-3xl font-black tracking-[-0.04em]">{album.title}</h2>
                        <p className="mt-1 text-sm text-slate-500">/{album.slug}</p>
                      </div>
                      <span className={album.published ? "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"}>
                        {album.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{album.description ?? "No description yet."}</p>
                    {album.category ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{album.category}</p> : null}
                    <p className="mt-4 text-sm font-medium text-slate-950">{album.photoCount} photos</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
