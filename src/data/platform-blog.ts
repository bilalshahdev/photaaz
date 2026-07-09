import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { LocalizedString } from "@/services/platform/platform-data";

type LocalizedStringArray = string[] | Record<string, string[]>;

export type PlatformBlogArticle = {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  keywords: string[];
  sections: Array<{
    heading: LocalizedString;
    body: LocalizedStringArray;
  }>;
};

export const platformBlogArticles: PlatformBlogArticle[] = [
  {
    slug: "photography-portfolio-homepage",
    title: {
      en: "What a photography portfolio homepage should show first"
    },
    excerpt: {
      en: "A practical homepage structure for photographers who want visitors to understand their style quickly."
    },
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=90",
    publishedAt: "2026-07-01",
    readTime: "4 min read",
    keywords: ["photography portfolio", "portfolio homepage", "photographer website", "gallery layout"],
    sections: [
      {
        heading: {
          en: "Start with the strongest visual signal"
        },
        body: {
          en: [
            "A photography website should not make visitors hunt for the photographer's style. The first screen should show a clear image direction, the photographer name, and a simple path into galleries or contact.",
            "This is why Photaaz themes treat the hero, gallery preview, and category structure as connected parts of the same portfolio experience."
          ]
        }
      },
      {
        heading: {
          en: "Keep the first actions simple"
        },
        body: {
          en: [
            "Most visitors need one of three routes: view work, understand the photographer, or send an inquiry. A clean nav and a focused contact section help more than a crowded homepage.",
            "For newer photographers, categories are useful. For established studios, galleries and featured stories usually work better."
          ]
        }
      }
    ]
  },
  {
    slug: "categories-vs-galleries",
    title: {
      en: "Categories and galleries are not the same thing"
    },
    excerpt: {
      en: "Use categories to organize photos by type, and galleries to curate complete stories or albums."
    },
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=90",
    publishedAt: "2026-06-28",
    readTime: "5 min read",
    keywords: ["photo categories", "photo galleries", "portfolio taxonomy", "photographer albums"],
    sections: [
      {
        heading: {
          en: "Categories describe what the photo is"
        },
        body: {
          en: [
            "A category is the taxonomy of the work: weddings, wildlife, portraits, travel, or products. Subcategories make sense only when the parent category needs more detail.",
            "This keeps uploads clean because a photographer can select the right category or subcategory when adding a photo."
          ]
        }
      },
      {
        heading: {
          en: "Galleries are curated experiences"
        },
        body: {
          en: [
            "A gallery can mix photos from one or more categories to tell a complete visual story. A wedding album, a travel series, or a client campaign can all be galleries.",
            "Separating both concepts makes the public site easier to browse and the dashboard easier to manage."
          ]
        }
      }
    ]
  },
  {
    slug: "seo-for-photographers",
    title: {
      en: "SEO basics every photographer website should handle"
    },
    excerpt: {
      en: "Titles, descriptions, image context, structured data, and fast pages matter before advanced SEO tactics."
    },
    coverImage: DEFAULT_OG_IMAGE,
    publishedAt: "2026-06-22",
    readTime: "6 min read",
    keywords: ["photographer SEO", "portfolio SEO", "image SEO", "structured data"],
    sections: [
      {
        heading: {
          en: "Make every public page understandable"
        },
        body: {
          en: [
            "A search engine should understand the page purpose from the title, description, URL, headings, and image context. A visitor should understand it even faster.",
            "Portfolio sites need canonical URLs, Open Graph previews, image alt text, and stable page structure for gallery, category, blog, and about pages."
          ]
        }
      },
      {
        heading: {
          en: "Speed is also SEO"
        },
        body: {
          en: [
            "Large photos are the main performance risk in photography websites. Upload limits, image optimization, responsive sizes, and caching are not optional details.",
            "A fast portfolio feels more premium and gives visitors less friction before they reach the contact section."
          ]
        }
      }
    ]
  }
];

export function getPlatformBlogArticles() {
  return platformBlogArticles;
}

export function getPlatformBlogArticle(slug: string) {
  return platformBlogArticles.find((article) => article.slug === slug) ?? null;
}
