import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingContainer } from "@/components/layout/marketing-container";
import { Button } from "@/components/ui/button";
import { getPlatformBlogArticle, getPlatformBlogArticles } from "@/data/platform-blog";
import { getMessages, isLocale, localizePath, resolveLocalizedString, resolveLocalizedStringList, type AppLocale } from "@/i18n/locales";
import { createMetadata, getLocalizedSeoUrl } from "@/lib/seo";
import { getEnabledTranslationLocales } from "@/services/admin/admin-data";

type PlatformBlogArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 3600;

export function generateStaticParams() {
  return getPlatformBlogArticles().flatMap((article) => [
    { locale: "en", slug: article.slug },
    { locale: "ur", slug: article.slug }
  ]);
}

export async function generateMetadata({ params }: PlatformBlogArticlePageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "en";
  const article = getPlatformBlogArticle(slug);

  if (!article) {
    return createMetadata({ title: "Blog post not found", noIndex: true, locale });
  }

  return createMetadata({
    title: `${resolveLocalizedString(article.title, locale)} - Photaaz Blog`,
    description: resolveLocalizedString(article.excerpt, locale),
    path: `/blog/${article.slug}`,
    locale,
    keywords: article.keywords,
    image: article.coverImage,
    type: "article"
  });
}

export default async function PlatformBlogArticlePage({ params }: PlatformBlogArticlePageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "en";
  const article = getPlatformBlogArticle(slug);

  if (!article) {
    notFound();
  }

  const [enabledLocales] = await Promise.all([getEnabledTranslationLocales()]);
  const messages = getMessages(locale);
  const title = resolveLocalizedString(article.title, locale);
  const excerpt = resolveLocalizedString(article.excerpt, locale);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: article.coverImage,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Photaaz"
    },
    publisher: {
      "@type": "Organization",
      name: "Photaaz"
    },
    mainEntityOfPage: getLocalizedSeoUrl(`/blog/${article.slug}`, locale),
    keywords: article.keywords
  };

  return (
    <>
      <MarketingHeader locale={locale} messages={messages} variant="solid" enabledLocales={enabledLocales} />
      <main className="bg-[#f7f8f6] text-[#101418]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <article>
          <MarketingContainer className="py-12 sm:py-16">
            <Button asChild variant="ghost" className="rounded-none px-0 font-nav text-xs uppercase tracking-[0.18em] hover:bg-transparent hover:text-teal-700">
              <Link href={localizePath(locale, "/blog")}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to blog
              </Link>
            </Button>

            <header className="mt-8 grid gap-8 border-b border-[#d7dedb] pb-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.8fr)] lg:items-end">
              <div>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                  {new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" }).format(new Date(article.publishedAt))} / {article.readTime}
                </p>
                <h1 className="mt-4 max-w-4xl font-display text-5xl font-light leading-none tracking-[-0.06em] sm:text-7xl">
                  {title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#59636b]">{excerpt}</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border border-[#d7dedb] bg-[#101418]">
                <Image src={article.coverImage} alt={title} fill priority className="object-cover" sizes="(min-width: 1024px) 42vw, 100vw" />
              </div>
            </header>

            <div className="mx-auto mt-10 max-w-3xl space-y-10">
              {article.sections.map((section) => (
                <section key={resolveLocalizedString(section.heading, locale)} className="border-b border-[#d7dedb] pb-8 last:border-b-0">
                  <h2 className="font-display text-4xl font-light leading-tight tracking-[-0.05em]">{resolveLocalizedString(section.heading, locale)}</h2>
                  <div className="mt-5 space-y-5 text-lg leading-9 text-[#334155]">
                    {resolveLocalizedStringList(section.body, locale).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </MarketingContainer>
        </article>
      </main>
    </>
  );
}
