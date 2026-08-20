import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CustomerPublicPage,
  customerPublicSurface,
  isDarkCustomerVariant,
} from "@/components/customer/customer-public-page";
import { resolveCustomerSiteThemeVariant } from "@/lib/customer-theme";
import { customerDemos } from "@/data/customer-demos";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";
import { customerPath } from "@/config/routes";
import {
  getCustomerSiteView,
  type CustomerSiteView,
} from "@/services/tenant/customer-site-data";
import { getCustomerPublicBlogs } from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerBlogPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerBlogPage({
  params,
}: CustomerBlogPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = ((await getCustomerSiteView(slug)) ?? customerDemos[slug]) as
    | CustomerSiteView
    | undefined;
  const posts = await getCustomerPublicBlogs(slug);

  if (!site) {
    notFound();
  }

  const variant = resolveCustomerSiteThemeVariant(site.themeKey ?? slug);
  const surface = customerPublicSurface(variant);
  const isDark = isDarkCustomerVariant(variant);
  const isVelvet = site.themeKey === "velvet";
  const displayPosts = posts.length
    ? posts
    : site.isDemo !== false
      ? site.galleries.map((gallery) => ({
          title: gallery.title,
          slug: gallery.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          excerpt:
            "A short journal entry can describe the story, mood, category, and context behind this collection.",
          featuredImage: gallery.image,
        }))
      : [];

  return (
    <CustomerPublicPage
      slug={slug}
      locale={locale}
      site={site}
      eyebrow="Blog"
      title="Blog"
      description="Notes from recent shoots, location choices, and the process behind selected collections."
      heroImageAlt={`${site.studioName} journal cover`}
      pageKey="blog"
    >
      <section className={cn(surface.section, isVelvet && "max-w-none bg-[#101010] px-5 sm:px-8 lg:px-12")}>
        {displayPosts.length ? (
          <div className={cn("grid", isVelvet ? "gap-3 md:grid-cols-3 lg:grid-cols-4" : variant === "editorial" || variant === "luxury" ? "gap-x-6 gap-y-14 md:grid-cols-12" : variant === "masonry" ? "gap-px bg-[#101418] md:grid-cols-4" : variant === "cinematic" ? "gap-3 md:grid-cols-2" : variant === "panorama" ? "gap-8 md:grid-cols-2" : "gap-x-8 gap-y-12 md:grid-cols-2")}>
            {displayPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={customerPath(slug, `/blog/${post.slug}`)}
                className={cn(
                  "block border",
                  isVelvet ? "border-white/15 bg-[#151515] p-0 text-white" : variant === "editorial" ? cn("border-0 bg-transparent p-0 shadow-none", index % 3 === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24") : variant === "luxury" ? cn("border-[#d8bf88]/25 bg-[#171511] p-4", index % 3 === 0 ? "md:col-span-5" : "md:col-span-7 md:mt-20") : variant === "masonry" ? "border-0 bg-white p-4" : variant === "cinematic" ? cn("border-white/10 bg-white/5 p-3", index === 0 && "md:col-span-2") : variant === "panorama" ? "rounded-[1.5rem] border-[#cbd3cd] bg-white/70 p-3" : cn("border-0 border-t border-black/20 bg-transparent p-0 pt-5 shadow-none", surface.card),
                )}
              >
                {post.featuredImage ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <p
                  className={cn(
                    "mt-5 font-nav text-xs font-semibold uppercase tracking-[0.24em]",
                    surface.accent,
                  )}
                >
                  Blog
                </p>
                <h2 className="mt-3 font-display text-3xl font-light tracking-[-0.05em]">
                  {post.title}
                </h2>
                <p
                  className={cn(
                    "mt-3 text-sm leading-6",
                    isDark ? "text-white/58" : "text-[#59636b]",
                  )}
                >
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={cn("border px-6 py-12 text-center", surface.card)}>
            <p className="font-display text-3xl font-light tracking-[-0.05em]">
              No published stories yet.
            </p>
            <p
              className={cn(
                "mx-auto mt-3 max-w-md text-sm leading-6",
                isDark ? "text-white/60" : "text-[#59636b]",
              )}
            >
              Approved blog posts from this portfolio will appear here.
            </p>
          </div>
        )}
      </section>
    </CustomerPublicPage>
  );
}
