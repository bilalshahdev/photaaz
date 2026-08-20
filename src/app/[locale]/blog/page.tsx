import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingContainer } from "@/components/layout/marketing-container";
import { Button } from "@/components/ui/button";
import {
  getMessages,
  localizePath,
  resolveLocalizedString,
  type AppLocale,
} from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { createMetadata, getLocalizedSeoUrl } from "@/lib/seo";
import {
  getEnabledTranslationLocales,
  getPlatformAppConfig,
} from "@/services/admin/admin-data";
import {
  getManagedPlatformBlogArticles,
  hasPlatformBlogTranslation,
} from "@/services/platform/platform-blog-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = blogPageCopy[locale] ?? blogPageCopy.en;

  const [articles, enabledLocales] = await Promise.all([
    getManagedPlatformBlogArticles(),
    getEnabledTranslationLocales(),
  ]);

  return createMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/blog",
    locale,
    keywords: copy.keywords,
    image: articles[0]?.coverImage,
    alternateLocales: enabledLocales,
  });
}

export default async function PlatformBlogPage() {
  const [locale, enabledLocales, appConfig, articles] = await Promise.all([
    getRequestLocale(),
    getEnabledTranslationLocales(),
    getPlatformAppConfig(),
    getManagedPlatformBlogArticles(),
  ]);
  const translatedArticles = articles.filter((article) =>
    hasPlatformBlogTranslation(article, locale),
  );
  const messages = getMessages(locale);
  const copy = blogPageCopy[locale] ?? blogPageCopy.en;
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: copy.jsonLdName,
    url: getLocalizedSeoUrl("/blog", locale),
    blogPost: translatedArticles.map((article) => ({
      "@type": "BlogPosting",
      headline: resolveLocalizedString(article.title, locale),
      url: getLocalizedSeoUrl(`/blog/${article.slug}`, locale),
      datePublished: article.publishedAt,
      image: article.coverImage,
    })),
  };

  return (
    <>
      <MarketingHeader
        locale={locale}
        messages={messages}
        variant="solid"
        enabledLocales={enabledLocales}
        brandName={appConfig.brandName}
        brandFontSize={appConfig.brandFontSize}
      />
      <main className="bg-[#f7f8f6] text-[#101418]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
        <MarketingContainer className="py-16 sm:py-20">
          <div className="border-b border-[#d7dedb] pb-8">
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-light leading-none tracking-[-0.06em] sm:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#59636b]">
              {copy.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {translatedArticles.map((article) => (
              <article
                key={article.slug}
                className="group flex h-full flex-col border border-[#d7dedb] bg-white"
              >
                <Link
                  href={localizePath(locale, `/blog/${article.slug}`)}
                  className="relative block aspect-[4/3] overflow-hidden bg-[#101418]"
                >
                  <Image
                    src={article.coverImage}
                    alt={resolveLocalizedString(article.title, locale)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-nav text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {new Intl.DateTimeFormat(locale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(article.publishedAt))}{" "}
                    / {resolveLocalizedString(article.readTime, locale)}
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-[-0.04em]">
                    <Link href={localizePath(locale, `/blog/${article.slug}`)}>
                      {resolveLocalizedString(article.title, locale)}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#59636b]">
                    {resolveLocalizedString(article.excerpt, locale)}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-fit rounded-none border-[#101418]/20 bg-transparent font-nav text-xs uppercase tracking-[0.18em]"
                  >
                    <Link href={localizePath(locale, `/blog/${article.slug}`)}>
                      {copy.readGuide}
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

type BlogPageCopy = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  jsonLdName: string;
  eyebrow: string;
  title: string;
  description: string;
  readGuide: string;
};

const blogPageCopy: Partial<Record<AppLocale, BlogPageCopy>> & {
  en: BlogPageCopy;
} = {
  en: {
    metaTitle: "Photaaz Blog - Photography Website Guides",
    metaDescription:
      "Practical guides about photography portfolios, galleries, categories, SEO, and publishing cleaner photographer websites.",
    keywords: [
      "photography website blog",
      "photographer SEO",
      "portfolio guides",
      "photo gallery website",
    ],
    jsonLdName: "Photaaz Blog",
    eyebrow: "Photography business notes",
    title: "Guides for cleaner photographer websites.",
    description:
      "Practical writing for portfolio structure, SEO, galleries, categories, and the small decisions that make a photography site feel professional.",
    readGuide: "Read guide",
  },
  ur: {
    metaTitle: "Photaaz Blog - فوٹوگرافی ویب سائٹ گائیڈز",
    metaDescription:
      "فوٹوگرافی پورٹ فولیو، گیلریز، کیٹیگریز، SEO، اور صاف فوٹوگرافر ویب سائٹس شائع کرنے کے بارے میں عملی گائیڈز۔",
    keywords: [
      "فوٹوگرافی ویب سائٹ بلاگ",
      "فوٹوگرافر SEO",
      "پورٹ فولیو گائیڈز",
      "فوٹو گیلری ویب سائٹ",
    ],
    jsonLdName: "Photaaz بلاگ",
    eyebrow: "فوٹوگرافی بزنس نوٹس",
    title: "صاف فوٹوگرافر ویب سائٹس کے لیے گائیڈز۔",
    description:
      "پورٹ فولیو اسٹرکچر، SEO، گیلریز، کیٹیگریز، اور وہ چھوٹے فیصلے جو فوٹوگرافی سائٹ کو پروفیشنل محسوس کرواتے ہیں۔",
    readGuide: "گائیڈ پڑھیں",
  },
  es: {
    metaTitle: "Blog de Photaaz - Guías para sitios web de fotografía",
    metaDescription:
      "Guías prácticas sobre portafolios de fotografía, galerías, categorías, SEO y publicación de sitios más limpios para fotógrafos.",
    keywords: [
      "blog de sitio web de fotografía",
      "SEO para fotógrafos",
      "guías de portafolio",
      "sitio web de galería de fotos",
    ],
    jsonLdName: "Blog de Photaaz",
    eyebrow: "Notas para negocios de fotografía",
    title: "Guías para sitios web de fotógrafos más claros.",
    description:
      "Consejos prácticos sobre estructura de portafolio, SEO, galerías, categorías y las pequeñas decisiones que hacen que un sitio de fotografía se sienta profesional.",
    readGuide: "Leer guía",
  },
  ar: {
    metaTitle: "مدونة Photaaz - أدلة مواقع التصوير",
    metaDescription:
      "أدلة عملية حول محافظ التصوير، المعارض، التصنيفات، تحسين محركات البحث، ونشر مواقع أنظف للمصورين.",
    keywords: [
      "مدونة موقع تصوير",
      "SEO للمصورين",
      "أدلة البورتفوليو",
      "موقع معرض صور",
    ],
    jsonLdName: "مدونة Photaaz",
    eyebrow: "ملاحظات لأعمال التصوير",
    title: "أدلة لمواقع مصورين أوضح.",
    description:
      "كتابة عملية حول هيكلة البورتفوليو، SEO، المعارض، التصنيفات، والقرارات الصغيرة التي تجعل موقع التصوير يبدو احترافياً.",
    readGuide: "اقرأ الدليل",
  },
  tr: {
    metaTitle: "Photaaz Blog - Fotoğraf Web Sitesi Rehberleri",
    metaDescription:
      "Fotoğraf portfolyoları, galeriler, kategoriler, SEO ve daha temiz fotoğrafçı web siteleri yayınlama hakkında pratik rehberler.",
    keywords: [
      "fotoğraf web sitesi blogu",
      "fotoğrafçı SEO",
      "portfolyo rehberleri",
      "foto galeri sitesi",
    ],
    jsonLdName: "Photaaz Blog",
    eyebrow: "Fotoğrafçılık işi notları",
    title: "Daha temiz fotoğrafçı siteleri için rehberler.",
    description:
      "Portfolyo yapısı, SEO, galeriler, kategoriler ve bir fotoğraf sitesini profesyonel hissettiren küçük kararlar hakkında pratik yazılar.",
    readGuide: "Rehberi oku",
  },
  hi: {
    metaTitle: "Photaaz ब्लॉग - फोटोग्राफी वेबसाइट गाइड",
    metaDescription:
      "फोटोग्राफी पोर्टफोलियो, गैलरी, श्रेणियां, SEO और साफ-सुथरी फोटोग्राफर वेबसाइट प्रकाशित करने पर व्यावहारिक गाइड।",
    keywords: [
      "फोटोग्राफी वेबसाइट ब्लॉग",
      "फोटोग्राफर SEO",
      "पोर्टफोलियो गाइड",
      "फोटो गैलरी वेबसाइट",
    ],
    jsonLdName: "Photaaz ब्लॉग",
    eyebrow: "फोटोग्राफी व्यवसाय नोट्स",
    title: "बेहतर फोटोग्राफर वेबसाइटों के लिए गाइड।",
    description:
      "पोर्टफोलियो संरचना, SEO, गैलरी, श्रेणियों और उन छोटे फैसलों पर व्यावहारिक लेख जो फोटोग्राफी साइट को प्रोफेशनल बनाते हैं।",
    readGuide: "गाइड पढ़ें",
  },
  pt: {
    metaTitle: "Blog Photaaz - Guias para sites de fotografia",
    metaDescription:
      "Guias práticos sobre portfólios de fotografia, galerias, categorias, SEO e publicação de sites mais limpos para fotógrafos.",
    keywords: [
      "blog de site de fotografia",
      "SEO para fotógrafos",
      "guias de portfólio",
      "site de galeria de fotos",
    ],
    jsonLdName: "Blog Photaaz",
    eyebrow: "Notas para negócios de fotografia",
    title: "Guias para sites de fotógrafos mais limpos.",
    description:
      "Conteúdo prático sobre estrutura de portfólio, SEO, galerias, categorias e pequenas decisões que deixam um site de fotografia mais profissional.",
    readGuide: "Ler guia",
  },
  de: {
    metaTitle: "Photaaz Blog - Leitfäden für Fotografie-Websites",
    metaDescription:
      "Praxisnahe Leitfäden zu Fotografie-Portfolios, Galerien, Kategorien, SEO und klareren Websites für Fotografen.",
    keywords: [
      "Fotografie Website Blog",
      "SEO für Fotografen",
      "Portfolio Leitfäden",
      "Fotogalerie Website",
    ],
    jsonLdName: "Photaaz Blog",
    eyebrow: "Notizen für Fotografie-Businesses",
    title: "Leitfäden für klarere Fotografen-Websites.",
    description:
      "Praktische Texte zu Portfolio-Struktur, SEO, Galerien, Kategorien und den kleinen Entscheidungen, die eine Fotografie-Website professionell wirken lassen.",
    readGuide: "Leitfaden lesen",
  },
  fr: {
    metaTitle: "Blog Photaaz - Guides pour sites de photographie",
    metaDescription:
      "Guides pratiques sur les portfolios photo, les galeries, les catégories, le SEO et la publication de sites plus propres pour photographes.",
    keywords: [
      "blog de site photo",
      "SEO pour photographes",
      "guides de portfolio",
      "site de galerie photo",
    ],
    jsonLdName: "Blog Photaaz",
    eyebrow: "Notes pour activité photo",
    title: "Guides pour des sites de photographes plus clairs.",
    description:
      "Des conseils pratiques sur la structure de portfolio, le SEO, les galeries, les catégories et les petits choix qui rendent un site photo professionnel.",
    readGuide: "Lire le guide",
  },
} as const;
