import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerPublicPage, customerPublicSurface, isDarkCustomerVariant } from "@/components/customer/customer-public-page";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { customerDemos } from "@/data/customer-demos";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";
import { customerPath } from "@/config/routes";
import { getCustomerSiteView, type CustomerSiteView } from "@/services/tenant/customer-site-data";
import { getCustomerPublicBlogs } from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerBlogPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerBlogPage({ params }: CustomerBlogPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = ((await getCustomerSiteView(slug)) ?? customerDemos[slug]) as CustomerSiteView | undefined;
  const posts = await getCustomerPublicBlogs(slug);

  if (!site) {
    notFound();
  }

  const variant = (site.themeKey as CustomerSiteThemeVariant | undefined) ?? resolveCustomerSiteThemeVariant(slug);
  const surface = customerPublicSurface(variant);
  const isDark = isDarkCustomerVariant(variant);
  const displayPosts = posts.length
    ? posts
    : site.isDemo !== false
      ? site.galleries.map((gallery) => ({
          title: gallery.title,
          slug: gallery.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          excerpt: "A short journal entry can describe the story, mood, category, and context behind this collection.",
          featuredImage: gallery.image
        }))
      : [];

  return (
    <CustomerPublicPage
      slug={slug}
      locale={locale}
      site={site}
      eyebrow="Journal"
      title="Stories"
      description="Notes from recent shoots, location choices, and the process behind selected collections."
      heroImageAlt={`${site.studioName} journal cover`}
      pageKey="blog"
    >
      <section className={surface.section}>
        {displayPosts.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {displayPosts.map((post) => (
              <Link key={post.slug} href={customerPath(slug, `/blog/${post.slug}`)} className={cn("block border p-4 shadow-[0_18px_50px_rgba(15,23,42,0.04)]", surface.card)}>
                {post.featuredImage ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  </div>
                ) : null}
                <p className={cn("mt-5 font-nav text-xs font-semibold uppercase tracking-[0.24em]", surface.accent)}>Journal</p>
                <h2 className="mt-3 font-display text-3xl font-light tracking-[-0.05em]">{post.title}</h2>
                <p className={cn("mt-3 text-sm leading-6", isDark ? "text-white/58" : "text-[#59636b]")}>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className={cn("border px-6 py-12 text-center", surface.card)}>
            <p className="font-display text-3xl font-light tracking-[-0.05em]">No published stories yet.</p>
            <p className={cn("mx-auto mt-3 max-w-md text-sm leading-6", isDark ? "text-white/60" : "text-[#59636b]")}>Approved blog posts from this portfolio will appear here.</p>
          </div>
        )}
      </section>
    </CustomerPublicPage>
  );
}
