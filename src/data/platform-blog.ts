import type { AppLocale } from "@/i18n/locales";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

export type PlatformBlogArticle = {
  slug: string;
  title: Record<AppLocale, string>;
  excerpt: Record<AppLocale, string>;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  keywords: string[];
  sections: Array<{
    heading: Record<AppLocale, string>;
    body: Record<AppLocale, string[]>;
  }>;
};

export const platformBlogArticles: PlatformBlogArticle[] = [
  {
    slug: "photography-portfolio-homepage",
    title: {
      en: "What a photography portfolio homepage should show first",
      ur: "فوٹوگرافی پورٹ فولیو ہوم پیج پر سب سے پہلے کیا دکھانا چاہیے"
    },
    excerpt: {
      en: "A practical homepage structure for photographers who want visitors to understand their style quickly.",
      ur: "فوٹوگرافرز کے لیے ایک سادہ ہوم پیج ڈھانچہ تاکہ وزیٹر جلدی سے ان کا انداز سمجھ سکیں۔"
    },
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=90",
    publishedAt: "2026-07-01",
    readTime: "4 min read",
    keywords: ["photography portfolio", "portfolio homepage", "photographer website", "gallery layout"],
    sections: [
      {
        heading: {
          en: "Start with the strongest visual signal",
          ur: "سب سے مضبوط بصری تاثر سے شروع کریں"
        },
        body: {
          en: [
            "A photography website should not make visitors hunt for the photographer's style. The first screen should show a clear image direction, the photographer name, and a simple path into galleries or contact.",
            "This is why Photaaz themes treat the hero, gallery preview, and category structure as connected parts of the same portfolio experience."
          ],
          ur: [
            "فوٹوگرافی ویب سائٹ کو وزیٹر سے انداز ڈھونڈوانا نہیں چاہیے۔ پہلے ہی حصے میں واضح تصویر، نام، اور گیلری یا رابطے کا راستہ ہونا چاہیے۔",
            "اسی لیے Photaaz تھیمز ہیرو، گیلری پری ویو، اور کیٹیگری ڈھانچے کو ایک ہی تجربے کا حصہ سمجھتی ہیں۔"
          ]
        }
      },
      {
        heading: {
          en: "Keep the first actions simple",
          ur: "پہلے ایکشن سادہ رکھیں"
        },
        body: {
          en: [
            "Most visitors need one of three routes: view work, understand the photographer, or send an inquiry. A clean nav and a focused contact section help more than a crowded homepage.",
            "For newer photographers, categories are useful. For established studios, galleries and featured stories usually work better."
          ],
          ur: [
            "زیادہ تر وزیٹر تین راستوں میں سے ایک چاہتے ہیں: کام دیکھنا، فوٹوگرافر کو سمجھنا، یا رابطہ کرنا۔ صاف نیویگیشن اور واضح رابطہ سیکشن زیادہ مدد کرتے ہیں۔",
            "نئے فوٹوگرافرز کے لیے کیٹیگریز فائدہ دیتی ہیں۔ قائم شدہ اسٹوڈیوز کے لیے گیلریز اور فیچرڈ اسٹوریز بہتر رہتی ہیں۔"
          ]
        }
      }
    ]
  },
  {
    slug: "categories-vs-galleries",
    title: {
      en: "Categories and galleries are not the same thing",
      ur: "کیٹیگریز اور گیلریز ایک جیسی چیز نہیں ہیں"
    },
    excerpt: {
      en: "Use categories to organize photos by type, and galleries to curate complete stories or albums.",
      ur: "کیٹیگریز تصاویر کو قسم کے حساب سے منظم کرتی ہیں، جبکہ گیلریز مکمل کہانیاں یا البمز دکھاتی ہیں۔"
    },
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=90",
    publishedAt: "2026-06-28",
    readTime: "5 min read",
    keywords: ["photo categories", "photo galleries", "portfolio taxonomy", "photographer albums"],
    sections: [
      {
        heading: {
          en: "Categories describe what the photo is",
          ur: "کیٹیگری بتاتی ہے کہ تصویر کس قسم کی ہے"
        },
        body: {
          en: [
            "A category is the taxonomy of the work: weddings, wildlife, portraits, travel, or products. Subcategories make sense only when the parent category needs more detail.",
            "This keeps uploads clean because a photographer can select the right category or subcategory when adding a photo."
          ],
          ur: [
            "کیٹیگری کام کی درجہ بندی ہے: ویڈنگ، وائلڈ لائف، پورٹریٹ، ٹریول، یا پروڈکٹس۔ سب کیٹیگری تب فائدہ دیتی ہے جب parent category کو مزید تفصیل چاہیے۔",
            "اس سے اپ لوڈ صاف رہتے ہیں کیونکہ فوٹوگرافر تصویر شامل کرتے وقت صحیح کیٹیگری یا سب کیٹیگری منتخب کر سکتا ہے۔"
          ]
        }
      },
      {
        heading: {
          en: "Galleries are curated experiences",
          ur: "گیلریز منتخب تجربات ہوتی ہیں"
        },
        body: {
          en: [
            "A gallery can mix photos from one or more categories to tell a complete visual story. A wedding album, a travel series, or a client campaign can all be galleries.",
            "Separating both concepts makes the public site easier to browse and the dashboard easier to manage."
          ],
          ur: [
            "گیلری ایک مکمل visual story کے لیے ایک یا کئی categories سے تصاویر ملا سکتی ہے۔ ویڈنگ البم، ٹریول سیریز، یا کلائنٹ کمپین سب گیلریز ہو سکتی ہیں۔",
            "دونوں concepts کو الگ رکھنے سے public site browse کرنا آسان اور dashboard manage کرنا صاف ہو جاتا ہے۔"
          ]
        }
      }
    ]
  },
  {
    slug: "seo-for-photographers",
    title: {
      en: "SEO basics every photographer website should handle",
      ur: "ہر فوٹوگرافر ویب سائٹ کے لیے بنیادی SEO"
    },
    excerpt: {
      en: "Titles, descriptions, image context, structured data, and fast pages matter before advanced SEO tactics.",
      ur: "ٹائٹلز، descriptions، image context، structured data، اور fast pages advanced SEO سے پہلے اہم ہیں۔"
    },
    coverImage: DEFAULT_OG_IMAGE,
    publishedAt: "2026-06-22",
    readTime: "6 min read",
    keywords: ["photographer SEO", "portfolio SEO", "image SEO", "structured data"],
    sections: [
      {
        heading: {
          en: "Make every public page understandable",
          ur: "ہر public page کو واضح بنائیں"
        },
        body: {
          en: [
            "A search engine should understand the page purpose from the title, description, URL, headings, and image context. A visitor should understand it even faster.",
            "Portfolio sites need canonical URLs, Open Graph previews, image alt text, and stable page structure for gallery, category, blog, and about pages."
          ],
          ur: [
            "Search engine کو title، description، URL، headings، اور image context سے page کا مقصد سمجھ آنا چاہیے۔ وزیٹر کو یہ اس سے بھی جلدی سمجھ آنا چاہیے۔",
            "Portfolio sites کو canonical URLs، Open Graph previews، image alt text، اور gallery، category، blog، about pages کا stable structure چاہیے۔"
          ]
        }
      },
      {
        heading: {
          en: "Speed is also SEO",
          ur: "Speed بھی SEO ہے"
        },
        body: {
          en: [
            "Large photos are the main performance risk in photography websites. Upload limits, image optimization, responsive sizes, and caching are not optional details.",
            "A fast portfolio feels more premium and gives visitors less friction before they reach the contact section."
          ],
          ur: [
            "Photography websites میں بڑی تصاویر performance کا سب سے بڑا risk ہیں۔ Upload limits، image optimization، responsive sizes، اور caching optional چیزیں نہیں ہیں۔",
            "Fast portfolio زیادہ premium محسوس ہوتا ہے اور visitor کو contact section تک پہنچنے میں کم friction دیتا ہے۔"
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
