import Image from "next/image";
import { notFound } from "next/navigation";
import { CustomerSiteNav } from "@/components/layout/customer-site-nav";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { getCustomerSiteView } from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerGalleryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerGalleryPage({ params }: CustomerGalleryPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = await getCustomerSiteView(slug);

  if (!site) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#15120f]">
      <section className="relative min-h-[52vh] overflow-hidden bg-[#15120f] text-white">
        <CustomerSiteNav slug={slug} locale={locale} name={site.studioName} />
        <Image src={site.heroImage} alt={`${site.studioName} gallery cover`} fill priority className="object-cover opacity-58" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,18,15,0.86),rgba(21,18,15,0.36))]" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl items-end px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/62">Gallery</p>
            <h1 className="mt-4 font-display text-6xl font-light leading-none tracking-[-0.05em] sm:text-7xl">Selected galleries</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {site.galleries.map((gallery) => (
            <article key={gallery.title} className="overflow-hidden border border-[#d7dedb] bg-white">
              <div className="relative aspect-[4/5]">
                <Image src={gallery.image} alt={gallery.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-display text-3xl font-light tracking-[-0.05em]">{gallery.title}</p>
                <p className="mt-2 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                  {gallery.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
