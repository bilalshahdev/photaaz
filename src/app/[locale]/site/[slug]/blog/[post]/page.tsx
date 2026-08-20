import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CustomerPublicPage,
  customerPublicSurface,
  isDarkCustomerVariant,
} from "@/components/customer/customer-public-page";
import { customerDemos } from "@/data/customer-demos";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { resolveCustomerSiteThemeVariant } from "@/lib/customer-theme";
import { cn } from "@/lib/utils";
import {
  getCustomerPublicBlogs,
  getCustomerSiteView,
  type CustomerSiteView,
} from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerBlogPostPageProps = {
  params: Promise<{ locale: string; slug: string; post: string }>;
};

export default async function CustomerBlogPostPage({
  params,
}: CustomerBlogPostPageProps) {
  const { locale: rawLocale, slug, post: postSlug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = ((await getCustomerSiteView(slug)) ?? customerDemos[slug]) as
    | CustomerSiteView
    | undefined;
  const posts = await getCustomerPublicBlogs(slug);
  const post = posts.find((item) => item.slug === postSlug);

  if (!site || !post) {
    notFound();
  }

  const variant = resolveCustomerSiteThemeVariant(site.themeKey ?? slug);
  const surface = customerPublicSurface(variant);
  const isDark = isDarkCustomerVariant(variant);

  return (
    <CustomerPublicPage
      slug={slug}
      locale={locale}
      site={{ ...site, heroImage: post.featuredImage ?? site.heroImage }}
      eyebrow="Blog"
      title={post.title}
      description={post.excerpt}
      heroImageAlt={post.title}
    >
      <article className={cn(surface.section, variant === "editorial" && "grid gap-10 lg:grid-cols-[0.72fr_1.28fr]", variant === "masonry" && "max-w-none px-5 sm:px-8 lg:px-10", variant === "cinematic" && "max-w-5xl py-20", variant === "luxury" && "max-w-5xl py-24", variant === "panorama" && "max-w-6xl py-20")}>
        {post.featuredImage ? (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-current/10">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : null}
        {post.tags.length ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "border px-3 py-1 font-nav text-xs font-semibold uppercase tracking-[0.2em]",
                  surface.card,
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div
          className={cn(
            "max-w-none [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-light [&_h2]:tracking-[-0.05em] [&_p]:mt-5 [&_p]:max-w-3xl [&_p]:text-base [&_p]:leading-8",
            isDark ? "[&_p]:text-white/68" : "[&_p]:text-slate-700",
          )}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </CustomerPublicPage>
  );
}
