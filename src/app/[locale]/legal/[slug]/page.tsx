import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { legalLinks, legalPath, type LegalSlug } from "@/config/legal";
import { getTextDirection, isLocale, locales, localizePath, resolveLocalizedString, type AppLocale } from "@/i18n/locales";

type LegalPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type LegalPageCopy = {
  title: string;
  description: string;
  updated: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
};

const legalPages: Record<LegalSlug, LegalPageCopy> = {
  privacy: {
    title: "Privacy Policy",
    description: "How Photaaz collects, uses, and protects account, portfolio, inquiry, and platform data.",
    updated: "June 24, 2026",
    sections: [
      {
        title: "Information we collect",
        body: [
          "We collect account details, business contact details, portfolio content, uploaded media metadata, support messages, and basic technical data needed to run the service.",
          "If payments are enabled, billing details are handled by the selected payment provider. Photaaz stores subscription status and plan records, not full payment card data."
        ]
      },
      {
        title: "How we use it",
        body: [
          "We use data to provide portfolio websites, manage subscriptions, process support requests, protect the platform, improve performance, and send important account or service notices.",
          "Contact form submissions are shared with the relevant portfolio owner and may also be reviewed by platform administrators for support and abuse prevention."
        ]
      },
      {
        title: "Data control",
        body: [
          "Portfolio owners can update or remove their visible profile, gallery, category, and contact information from their dashboard where available.",
          "Requests about access, correction, or deletion can be sent through the published support contact."
        ]
      }
    ]
  },
  terms: {
    title: "Terms and Conditions",
    description: "The main rules for using Photaaz as a photographer, visitor, or platform administrator.",
    updated: "June 24, 2026",
    sections: [
      {
        title: "Service use",
        body: [
          "Photaaz provides hosted portfolio tools for photographers to publish public websites, organize galleries, receive inquiries, and manage presentation settings.",
          "Users are responsible for keeping account access secure and for ensuring the content they publish is accurate, lawful, and owned or licensed by them."
        ]
      },
      {
        title: "Subscriptions and availability",
        body: [
          "Plans, limits, custom domain access, storage, translations, premium themes, and other paid features may vary by package and can be changed or extended by platform administrators.",
          "We aim to keep the service reliable, but maintenance, third-party provider outages, or abuse-prevention actions may affect access."
        ]
      },
      {
        title: "Content responsibility",
        body: [
          "Photographers retain responsibility for uploaded photos, text, logos, links, and contact information.",
          "Photaaz may remove, hide, reject, or restrict content that violates law, copyright, privacy, safety, or acceptable-use rules."
        ]
      }
    ]
  },
  refund: {
    title: "Refund Policy",
    description: "How refunds, package extensions, and account compensation can be handled for Photaaz subscriptions.",
    updated: "June 24, 2026",
    sections: [
      {
        title: "General policy",
        body: [
          "Refund eligibility depends on the selected package, service usage, payment provider rules, and the specific issue reported.",
          "Because portfolio setup, custom domain setup, custom work, translations, and premium configuration can involve immediate platform work, refunds are reviewed case by case."
        ]
      },
      {
        title: "Extensions and compensation",
        body: [
          "Where a refund is not the best fix, administrators may extend a customer package, apply credit, or adjust access as compensation.",
          "Package extensions are visible in the subscription records managed from the admin dashboard."
        ]
      },
      {
        title: "How to request",
        body: [
          "A refund or compensation request should include the account email, package name, payment date, and reason for the request.",
          "Approved refunds are processed through the original payment route where possible."
        ]
      }
    ]
  },
  cookies: {
    title: "Cookie Policy",
    description: "How cookies and similar browser storage may be used across Photaaz and customer portfolio websites.",
    updated: "June 24, 2026",
    sections: [
      {
        title: "Essential cookies",
        body: [
          "Photaaz may use essential cookies or browser storage for login sessions, locale preferences, dashboard security, and normal site operation.",
          "These are required for protected dashboards and account features to work correctly."
        ]
      },
      {
        title: "Optional analytics",
        body: [
          "If analytics or marketing tools are enabled later, they should be disclosed clearly and controlled according to the region where the site is offered.",
          "Visitors can also manage or block cookies from their browser settings."
        ]
      },
      {
        title: "Customer sites",
        body: [
          "Customer portfolio sites may use cookies for forms, spam protection, embedded services, analytics, or media providers if those features are enabled.",
          "Portfolio owners should avoid adding third-party tools without understanding their privacy impact."
        ]
      }
    ]
  },
  "acceptable-use": {
    title: "Acceptable Use Policy",
    description: "Content and behavior rules that protect photographers, visitors, and the Photaaz platform.",
    updated: "June 24, 2026",
    sections: [
      {
        title: "Disallowed content",
        body: [
          "Users must not upload illegal, exploitative, stolen, hateful, abusive, threatening, deceptive, or privacy-violating content.",
          "Users must not upload photos they do not own or have permission to publish, including copyrighted work taken from other photographers or platforms."
        ]
      },
      {
        title: "Platform abuse",
        body: [
          "The service must not be used for spam, phishing, malware, impersonation, scraping, harassment, fraud, or attempts to bypass package limits and security controls.",
          "The custom domain, contact forms, galleries, and public pages must not be used to mislead visitors about identity, pricing, affiliation, or ownership."
        ]
      },
      {
        title: "Review and enforcement",
        body: [
          "Uploads can be placed in review before appearing publicly. Administrators may approve, reject, flag, remove, suspend, or disable access when content or account behavior creates risk.",
          "Repeated violations can lead to permanent account restrictions without restoring removed content."
        ]
      }
    ]
  }
};

const localizedLegalPages: Partial<Record<AppLocale, Partial<Record<LegalSlug, LegalPageCopy>>>> = {
  ur: {
    privacy: {
      title: "رازداری پالیسی",
      description: "Photaaz اکاؤنٹ، پورٹ فولیو، انکوائری اور پلیٹ فارم ڈیٹا کو کیسے جمع، استعمال اور محفوظ کرتا ہے۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "ہم کون سی معلومات لیتے ہیں",
          body: [
            "ہم اکاؤنٹ تفصیلات، کاروباری رابطہ معلومات، پورٹ فولیو مواد، اپلوڈ شدہ میڈیا کی بنیادی معلومات، سپورٹ پیغامات، اور سروس چلانے کے لیے ضروری تکنیکی ڈیٹا جمع کرتے ہیں۔",
            "اگر ادائیگی فعال ہو تو بلنگ معلومات منتخب پیمنٹ پرووائیڈر سنبھالتا ہے۔ Photaaz مکمل کارڈ ڈیٹا نہیں رکھتا، صرف سبسکرپشن اسٹیٹس اور پلان ریکارڈ محفوظ کرتا ہے۔"
          ]
        },
        {
          title: "ہم اسے کیسے استعمال کرتے ہیں",
          body: [
            "ہم ڈیٹا کو پورٹ فولیو ویب سائٹس فراہم کرنے، سبسکرپشنز سنبھالنے، سپورٹ درخواستوں پر کام کرنے، پلیٹ فارم کو محفوظ رکھنے، کارکردگی بہتر بنانے، اور ضروری اکاؤنٹ یا سروس نوٹس بھیجنے کے لیے استعمال کرتے ہیں۔",
            "کانٹیکٹ فارم سے آنے والی درخواست متعلقہ پورٹ فولیو مالک کو دی جاتی ہے اور سپورٹ یا غلط استعمال روکنے کے لیے پلیٹ فارم ایڈمن بھی اسے دیکھ سکتا ہے۔"
          ]
        },
        {
          title: "ڈیٹا کنٹرول",
          body: [
            "پورٹ فولیو مالکان اپنے ڈیش بورڈ سے اپنی ظاہری پروفائل، گیلری، کیٹیگری، اور رابطہ معلومات اپڈیٹ یا حذف کر سکتے ہیں جہاں یہ فیچر موجود ہو۔",
            "ڈیٹا تک رسائی، درستگی، یا حذف کرنے کی درخواست شائع شدہ سپورٹ رابطے پر بھیجی جا سکتی ہے۔"
          ]
        }
      ]
    },
    terms: {
      title: "شرائط و ضوابط",
      description: "Photaaz کو فوٹوگرافر، وزٹر، یا پلیٹ فارم ایڈمن کے طور پر استعمال کرنے کے بنیادی اصول۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "سروس کا استعمال",
          body: [
            "Photaaz فوٹوگرافرز کو عوامی پورٹ فولیو ویب سائٹس شائع کرنے، گیلریز منظم کرنے، انکوائریز وصول کرنے، اور پریزنٹیشن سیٹنگز سنبھالنے کے لیے ہوسٹڈ ٹولز فراہم کرتا ہے۔",
            "صارفین اپنے اکاؤنٹ تک رسائی محفوظ رکھنے اور یہ یقینی بنانے کے ذمہ دار ہیں کہ شائع کیا گیا مواد درست، قانونی، اور ان کی ملکیت یا اجازت کے تحت ہو۔"
          ]
        },
        {
          title: "سبسکرپشن اور دستیابی",
          body: [
            "پلانز، حدود، ڈومینز، اسٹوریج، ترجمے، پریمیم تھیمز، اور دیگر ادا شدہ فیچرز پیکیج کے حساب سے مختلف ہو سکتے ہیں اور پلیٹ فارم ایڈمن انہیں تبدیل یا بڑھا سکتے ہیں۔",
            "ہم سروس کو قابل اعتماد رکھنے کی کوشش کرتے ہیں، مگر مینٹیننس، تھرڈ پارٹی پرووائیڈر کے مسائل، یا غلط استعمال روکنے کے اقدامات رسائی کو متاثر کر سکتے ہیں۔"
          ]
        },
        {
          title: "مواد کی ذمہ داری",
          body: [
            "فوٹوگرافرز اپنی اپلوڈ کردہ تصاویر، متن، لوگو، لنکس، اور رابطہ معلومات کے خود ذمہ دار ہیں۔",
            "Photaaz ایسے مواد کو ہٹا، چھپا، رد، یا محدود کر سکتا ہے جو قانون، کاپی رائٹ، پرائیویسی، سیفٹی، یا قابل قبول استعمال کے اصولوں کے خلاف ہو۔"
          ]
        }
      ]
    },
    refund: {
      title: "ریفنڈ پالیسی",
      description: "Photaaz سبسکرپشنز کے لیے ریفنڈ، پیکیج ایکسٹینشن، اور اکاؤنٹ کمپنسیشن کیسے ہینڈل کی جا سکتی ہے۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "عام پالیسی",
          body: [
            "ریفنڈ کی اہلیت منتخب پیکیج، سروس کے استعمال، پیمنٹ پرووائیڈر کے قواعد، اور رپورٹ کیے گئے مسئلے پر منحصر ہے۔",
            "چونکہ پورٹ فولیو سیٹ اپ، ڈومینز، کسٹم کام، ترجمے، اور پریمیم کنفیگریشن میں فوری پلیٹ فارم ورک شامل ہو سکتا ہے، اس لیے ریفنڈ ہر کیس کے حساب سے دیکھا جاتا ہے۔"
          ]
        },
        {
          title: "ایکسٹینشن اور کمپنسیشن",
          body: [
            "جہاں ریفنڈ بہترین حل نہ ہو، ایڈمن کسٹمر پیکیج بڑھا سکتے ہیں، کریڈٹ دے سکتے ہیں، یا رسائی ایڈجسٹ کر سکتے ہیں۔",
            "پیکیج ایکسٹینشن سبسکرپشن ریکارڈز میں نظر آتی ہے جو ایڈمن ڈیش بورڈ سے مینیج ہوتے ہیں۔"
          ]
        },
        {
          title: "درخواست کیسے بھیجیں",
          body: [
            "ریفنڈ یا کمپنسیشن درخواست میں اکاؤنٹ ای میل، پیکیج نام، ادائیگی کی تاریخ، اور درخواست کی وجہ شامل ہونی چاہیے۔",
            "منظور شدہ ریفنڈز جہاں ممکن ہو اسی ادائیگی کے ذریعے پروسیس کیے جاتے ہیں۔"
          ]
        }
      ]
    },
    cookies: {
      title: "کوکی پالیسی",
      description: "Photaaz اور کسٹمر پورٹ فولیو ویب سائٹس پر کوکیز اور براؤزر اسٹوریج کیسے استعمال ہو سکتے ہیں۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "ضروری کوکیز",
          body: [
            "Photaaz لاگ ان سیشنز، زبان کی ترجیح، ڈیش بورڈ سیکیورٹی، اور نارمل سائٹ آپریشن کے لیے ضروری کوکیز یا براؤزر اسٹوریج استعمال کر سکتا ہے۔",
            "یہ محفوظ ڈیش بورڈز اور اکاؤنٹ فیچرز کو درست چلانے کے لیے ضروری ہیں۔"
          ]
        },
        {
          title: "اختیاری اینالیٹکس",
          body: [
            "اگر بعد میں اینالیٹکس یا مارکیٹنگ ٹولز فعال کیے جائیں تو انہیں واضح طور پر بتایا جانا چاہیے اور متعلقہ ریجن کے مطابق کنٹرول کیا جانا چاہیے۔",
            "وزٹرز اپنے براؤزر سیٹنگز سے بھی کوکیز کو مینیج یا بلاک کر سکتے ہیں۔"
          ]
        },
        {
          title: "کسٹمر سائٹس",
          body: [
            "کسٹمر پورٹ فولیو سائٹس فارم، اسپام پروٹیکشن، ایمبیڈڈ سروسز، اینالیٹکس، یا میڈیا پرووائیڈرز کے لیے کوکیز استعمال کر سکتی ہیں اگر یہ فیچرز فعال ہوں۔",
            "پورٹ فولیو مالکان کو تھرڈ پارٹی ٹولز شامل کرنے سے پہلے ان کے پرائیویسی اثرات سمجھنے چاہئیں۔"
          ]
        }
      ]
    },
    "acceptable-use": {
      title: "قابل قبول استعمال پالیسی",
      description: "وہ مواد اور رویے کے اصول جو فوٹوگرافرز، وزٹرز، اور Photaaz پلیٹ فارم کو محفوظ رکھتے ہیں۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "ممنوع مواد",
          body: [
            "صارفین غیر قانونی، استحصالی، چوری شدہ، نفرت انگیز، بدسلوکی، دھمکی آمیز، گمراہ کن، یا پرائیویسی کی خلاف ورزی کرنے والا مواد اپلوڈ نہیں کر سکتے۔",
            "صارفین ایسی تصاویر اپلوڈ نہیں کر سکتے جن کی ملکیت یا شائع کرنے کی اجازت ان کے پاس نہ ہو، بشمول دوسرے فوٹوگرافرز یا پلیٹ فارمز سے لی گئی کاپی رائٹڈ تصاویر۔"
          ]
        },
        {
          title: "پلیٹ فارم کا غلط استعمال",
          body: [
            "سروس کو اسپام، فشنگ، میل ویئر، impersonation، scraping، harassment، fraud، یا پیکیج لمٹس اور سیکیورٹی کنٹرولز بائی پاس کرنے کے لیے استعمال نہیں کیا جا سکتا۔",
            "ڈومینز، کانٹیکٹ فارمز، گیلریز، اور عوامی صفحات وزٹرز کو شناخت، قیمت، وابستگی، یا ملکیت کے بارے میں گمراہ کرنے کے لیے استعمال نہیں ہونے چاہئیں۔"
          ]
        },
        {
          title: "ریویو اور عمل درآمد",
          body: [
            "اپلوڈز کو پبلک ہونے سے پہلے ریویو میں رکھا جا سکتا ہے۔ ایڈمن مواد یا اکاؤنٹ رویے میں خطرہ ہونے پر approve، reject، flag، remove، suspend، یا disable کر سکتے ہیں۔",
            "بار بار خلاف ورزی مستقل اکاؤنٹ پابندی کا باعث بن سکتی ہے، اور ہٹایا گیا مواد واپس بحال نہیں کیا جائے گا۔"
          ]
        }
      ]
    }
  }
};

export function generateStaticParams() {
  return locales.flatMap((locale) => legalLinks.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "en";
  const page = getLegalPage(slug, locale);

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | Photaaz`,
    description: page.description
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "en";
  const page = getLegalPage(slug, locale);
  const direction = getTextDirection(locale);

  if (!page) {
    notFound();
  }

  return (
    <main dir={direction} className="min-h-screen bg-[#f5f3ee] text-[#101418]">
      <section className="border-b border-[#d9d6ce] bg-white/70 px-5 py-8 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href={localizePath(locale, "/")} className="font-brand text-3xl font-semibold tracking-[-0.04em]">
            Photaaz
          </Link>
          <Link href={localizePath(locale, "/")} className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-teal-700 transition hover:text-[#101418]">
            {locale === "ur" ? "ہوم" : "Home"}
          </Link>
        </div>
      </section>

      <article className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12">
        <p className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">{locale === "ur" ? "قانونی" : "Legal"}</p>
        <h1 className="pf-fluid-title-page mt-4 max-w-3xl font-display font-light leading-none tracking-[-0.055em] sm:text-7xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
        <p className="mt-4 text-sm text-slate-500">{locale === "ur" ? "آخری اپڈیٹ" : "Last updated"}: {page.updated}</p>

        <div className="mt-12 grid gap-6">
          {page.sections.map((section) => (
            <section key={section.title} className="border border-[#d9d6ce] bg-white p-6 shadow-[0_18px_50px_rgba(16,20,24,0.05)]">
              <h2 className="font-display text-3xl font-light tracking-[-0.04em]">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                {section.body.map((body) => (
                  <p key={body}>{body}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav className="mt-12 flex flex-wrap gap-3 border-t border-[#d9d6ce] pt-6">
          {legalLinks.map((link) => (
            <Link key={link.slug} href={localizePath(locale, legalPath(link.slug))} className="border border-[#d9d6ce] bg-white px-4 py-2 font-nav text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-teal-700 hover:text-teal-700">
              {resolveLocalizedString(link.label, locale)}
            </Link>
          ))}
        </nav>
      </article>
    </main>
  );
}

function getLegalPage(slug: string, locale: AppLocale) {
  const legalSlug = slug as LegalSlug;

  return localizedLegalPages[locale]?.[legalSlug] ?? legalPages[legalSlug];
}
