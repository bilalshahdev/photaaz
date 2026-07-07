import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingContainer } from "@/components/layout/marketing-container";
import { Button } from "@/components/ui/button";
import { getPlatformBlogArticles } from "@/data/platform-blog";
import { getMessages, localizePath, resolveLocalizedString } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { createMetadata, getLocalizedSeoUrl } from "@/lib/seo";
import { getEnabledTranslationLocales } from "@/services/admin/admin-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return createMetadata({
    title: "Photaaz Blog - Photography Website Guides",
    description: "Practical guides about photography portfolios, galleries, categories, SEO, and publishing cleaner photographer websites.",
    path: "/blog",
    locale,
    keywords: ["photography website blog", "photographer SEO", "portfolio guides", "photo gallery website"],
    image: getPlatformBlogArticles()[0]?.coverImage
  });
}

export default async function PlatformBlogPage() {
  const [locale, enabledLocales] = await Promise.all([getRequestLocale(), getEnabledTranslationLocales()]);
  const articles = getPlatformBlogArticles();
  const messages = getMessages(locale);
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Photaaz Blog",
    url: getLocalizedSeoUrl("/blog", locale),
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: resolveLocalizedString(article.title, locale),
      url: getLocalizedSeoUrl(`/blog/${article.slug}`, locale),
      datePublished: article.publishedAt,
      image: article.coverImage
    }))
  };

  return (
    <>
      <MarketingHeader locale={locale} messages={messages} variant="solid" enabledLocales={enabledLocales} />
      <main className="bg-[#f7f8f6] text-[#101418]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
        <MarketingContainer className="py-16 sm:py-20">
          <div className="border-b border-[#d7dedb] pb-8">
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Photography business notes</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-light leading-none tracking-[-0.06em] sm:text-7xl">
              Guides for cleaner photographer websites.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#59636b]">
              Practical writing for portfolio structure, SEO, galleries, categories, and the small decisions that make a photography site feel professional.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="group flex h-full flex-col border border-[#d7dedb] bg-white">
                <Link href={localizePath(locale, `/blog/${article.slug}`)} className="relative block aspect-[4/3] overflow-hidden bg-[#101418]">
                  <Image
                    src={article.coverImage}
                    alt={resolveLocalizedString(article.title, locale)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-nav text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    {new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(new Date(article.publishedAt))} / {article.readTime}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-[-0.04em]">
                    <Link href={localizePath(locale, `/blog/${article.slug}`)}>{resolveLocalizedString(article.title, locale)}</Link>
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#59636b]">{resolveLocalizedString(article.excerpt, locale)}</p>
                  <Button asChild variant="outline" className="mt-6 w-fit rounded-none border-[#101418]/20 bg-transparent font-nav text-xs uppercase tracking-[0.18em]">
                    <Link href={localizePath(locale, `/blog/${article.slug}`)}>
                      Read guide
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </MarketingContainer>
      </main>
    </>
  );
}
