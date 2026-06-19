import Image from "next/image";
import { CustomerSiteNav } from "@/components/layout/customer-site-nav";
import { type AppLocale } from "@/i18n/locales";

type CustomerSiteExperienceProps = {
  slug: string;
  locale: AppLocale;
  demo: {
    studioName: string;
    specialty: string;
    tagline: string;
    heroImage: string;
    galleries: Array<{ title: string; location: string; image: string }>;
  };
};

export function CustomerSiteExperience({ slug, locale, demo }: CustomerSiteExperienceProps) {
  return (
    <main className="bg-[#f7f2ea] text-[#15120f]">
      <CustomerSiteNav slug={slug} locale={locale} name={demo.studioName} />
      <section className="relative min-h-screen overflow-hidden bg-[#15120f] text-white">
        <Image
          src={demo.heroImage}
          alt="Featured portfolio cover"
          fill
          priority
          className="object-cover opacity-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,18,15,0.86),rgba(21,18,15,0.38))]" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/62">{demo.specialty}</p>
            <h1 className="mt-5 font-display text-6xl font-light leading-none tracking-[-0.05em] sm:text-8xl">{demo.studioName}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">{demo.tagline}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#d7dedb] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Featured work</p>
            <h2 className="mt-2 font-display text-4xl font-light tracking-[-0.05em]">Selected galleries</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#59636b]">
            Browse the featured galleries, stories, and published collections from this portfolio.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {demo.galleries.map((gallery) => (
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
