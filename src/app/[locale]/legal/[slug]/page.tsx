import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { legalLinks, legalPath, type LegalSlug } from "@/config/legal";
import { getTextDirection, isLocale, locales, localizePath, resolveLocalizedString, type AppLocale } from "@/i18n/locales";
import { CopyrightNoticeForm, PrivacyRequestForm } from "@/components/legal/legal-request-forms";

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
    updated: "August 17, 2026",
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
      },
      { title: "Legal bases and sharing", body: [
        "Depending on location and context, processing may be necessary to perform a contract, comply with law, protect legitimate interests such as security and fraud prevention, or rely on consent for optional marketing and non-essential cookies.",
        "Data may be shared with the relevant portfolio owner, authorized staff, and listed hosting, database, media, payment, email, analytics, and monitoring providers. We do not sell personal information."
      ]},
      { title: "International transfers, retention, and security", body: [
        "Providers may process data outside the user's country. Where required, contractual safeguards or other recognized transfer mechanisms should be used and documented.",
        "Account and active portfolio data is kept while the account is active. Following a verified deletion request, public access is disabled promptly and primary account and media deletion is targeted within 30 days. Encrypted backups may retain residual copies for up to a further 30 days, and CDN caches expire under provider cache schedules.",
        "Visitor inquiries and support tickets are normally retained for 24 months, security and access logs for up to 12 months, and payment, tax, refund, and fraud records for up to seven years or the longer period required by applicable law. Open disputes, legal holds, abuse cases, and unresolved requests may be retained until resolution.",
        "We use tenant authorization, access controls, encryption in transit, restricted secrets, validated uploads, rate limits, backups, and monitoring. No online service can guarantee absolute security."
      ]},
      { title: "Your rights, children, and contact", body: [
        "Subject to applicable law, individuals may request access, export, correction, deletion, restriction, objection, or withdrawal of consent, and may complain to a relevant regulator. Identity verification may be required before disclosure or deletion.",
        "Photaaz is intended for business users and is not directed to children. Users must not knowingly submit a child's personal data without appropriate authority and lawful consent.",
        "Privacy requests can be submitted through the verified workflow below. Material changes will be dated and notified where required.",
        "Account deletion is irreversible after processing. It does not itself cancel or refund an active Paddle purchase: the subscription should be canceled first through the buyer route. Deletion removes dashboard access and schedules portfolio records and Cloudinary media for deletion, while legally required billing records and temporary backups remain under the retention schedule above."
      ]}
    ]
  },
  terms: {
    title: "Terms and Conditions",
    description: "The main rules for using Photaaz as a photographer, visitor, or platform administrator.",
    updated: "August 17, 2026",
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
      },
      { title: "Eligibility, accounts, and plans", body: [
        "Users must be legally able to enter a contract and provide accurate account information. Accounts may not be transferred, shared insecurely, or used to impersonate another person or business.",
        "Published package descriptions, numeric limits, theme access, grace periods, and billing intervals form part of the selected offer. Excess content may remain stored but become locked or hidden after downgrade; it is not promised to remain publicly visible."
      ]},
      { title: "Billing, renewal, cancellation, and suspension", body: [
        "Paid monthly and annual subscriptions renew until canceled. Paddle acts as merchant of record for enabled checkout transactions and provides buyer payment terms, receipts, taxes, cancellation routes, and refund handling.",
        "Cancellation normally prevents the next renewal while access continues through the paid term. Failed payment, chargeback abuse, security risk, unlawful activity, or material breach may result in warning, restriction, suspension, or termination subject to mandatory law."
      ]},
      { title: "Intellectual property and licence", body: [
        "Photaaz and its software, brand, and platform design remain owned by their respective owners. Photographers retain their content rights and grant the limited operational licence described in the Copyright Policy.",
        "Users warrant that they have all image, model, property, music, trademark, privacy, and publicity permissions necessary for their content."
      ]},
      { title: "Disclaimers, liability, and disputes", body: [
        "To the maximum extent permitted by law, the service is provided without guarantees of uninterrupted availability, particular commercial results, search ranking, domain availability, or prevention of copying. Mandatory consumer rights are not excluded.",
        "Any liability cap, indemnity, governing law, venue, arbitration, and notice provisions must be finalized by qualified counsel for the Photaaz operating entity and target markets before public launch."
      ]}
    ]
  },
  refund: {
    title: "Refund Policy",
    description: "How refunds, package extensions, and account compensation can be handled for Photaaz subscriptions.",
    updated: "August 17, 2026",
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
      },
      { title: "Renewals, cancellations, and access", body: [
        "Monthly and annual subscriptions may be canceled before the next renewal through the available Paddle buyer route. Cancellation normally takes effect at the end of the current paid period; it does not automatically refund prior charges.",
        "Plus receives a seven-day configured payment grace period and Pro receives fourteen days. After grace or expiry, effective access falls back to Free while excess records remain retained but may be locked or hidden. Ownership is a one-time lifetime entitlement and does not acquire intellectual property in Photaaz platform code unless a separate written agreement says so."
      ]},
      { title: "Paddle and mandatory rights", body: [
        "Paddle is the merchant of record for Paddle transactions. Refunds must be processed through Paddle and are subject to Paddle's buyer terms and refund policy, including applicable statutory withdrawal and consumer rights.",
        "Nothing in this policy limits non-waivable rights. Chargebacks may trigger investigation or temporary restriction, but users should contact support or Paddle buyer support first where practical."
      ]}
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
    updated: "August 17, 2026",
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
  },
  copyright: {
    title: "Copyright and Takedown Policy",
    description: "How image ownership, platform licensing, infringement notices, counter-notices, and repeat infringement are handled.",
    updated: "August 17, 2026",
    sections: [
      { title: "Ownership and permission", body: [
        "Photographers retain ownership of their images and other portfolio content. They must own or hold sufficient rights, permissions, model releases, property releases, and trademark permissions for every publication.",
        "Photaaz receives only a limited, worldwide, non-exclusive licence to host, copy, resize, transform, cache, back up, watermark, and publicly display content as needed to operate the selected service. This licence ends after deletion subject to reasonable backup and CDN expiry periods."
      ]},
      { title: "Copyright notices", body: [
        "A notice should identify the protected work, identify each allegedly infringing URL, provide the reporter's name and contact details, explain the reporter's authority, and include good-faith and accuracy declarations.",
        "Photaaz may temporarily restrict content while investigating, notify the affected account, request more information, restore content after a valid counter-notice where lawful, and terminate repeat infringers. Fraudulent notices may create legal liability."
      ]},
      { title: "Copying and public visibility", body: [
        "Public portfolio images can be indexed, linked, cached, downloaded, screenshotted, or copied by third parties. Custom domains and watermarks do not technically prevent copying.",
        "Submit notices through the copyright workflow below. Do not include sensitive identity documents unless specifically requested through a secure channel."
      ]}
    ]
  },
  dpa: {
    title: "Data Processing Addendum",
    description: "Baseline processor commitments when Photaaz handles personal data for a photographer's portfolio business.",
    updated: "August 17, 2026",
    sections: [
      { title: "Roles and instructions", body: [
        "For account administration and its own platform security, billing, and compliance purposes, Photaaz may act as an independent controller. For visitor inquiries and portfolio content processed only for a business customer, the customer generally determines the purpose and Photaaz acts as processor, subject to applicable law.",
        "Photaaz processes customer personal data only to provide, secure, support, and improve the contracted service, follow documented customer instructions, or comply with law."
      ]},
      { title: "Security, people, and incidents", body: [
        "Photaaz applies access controls, tenant authorization, encryption in transit, restricted secrets, backups, logging, upload validation, and incident response appropriate to the service risk. Personnel and contractors with access must be bound by confidentiality obligations.",
        "Photaaz will notify affected business customers without undue delay after confirming a personal-data breach affecting their data and will provide reasonably available information needed for lawful notices."
      ]},
      { title: "Subprocessors, transfers, and assistance", body: [
        "Photaaz may use the published subprocessors to provide hosting, database, media, payment, email, and monitoring services. Equivalent data-protection obligations are required where applicable.",
        "Photaaz will reasonably assist with data-subject requests, security assessments, deletion or return at termination, and transfer safeguards. Customers remain responsible for their notices, lawful basis, and instructions."
      ]}
    ]
  },
  subprocessors: {
    title: "Subprocessor List",
    description: "Core vendors that may process platform, customer, or visitor data when their related service is enabled.",
    updated: "August 17, 2026",
    sections: [
      { title: "Infrastructure and media", body: [
        "Vercel — application hosting, edge delivery, request logs, and deployment infrastructure. Processing location depends on configured regions and Vercel's infrastructure.",
        "Supabase — managed PostgreSQL database and related infrastructure. Project region must be selected and documented by Photaaz.",
        "Cloudinary — uploaded image storage, transformation, CDN delivery, metadata, and deletion workflows."
      ]},
      { title: "Payments and communications", body: [
        "Paddle — merchant of record for enabled purchases, checkout, tax, fraud screening, buyer support, subscriptions, refunds, and payment identifiers. Paddle acts under its own buyer terms and privacy notice for checkout data.",
        "Resend or configured SMTP provider — operational and support email delivery, including addresses, message content, and delivery metadata."
      ]},
      { title: "Changes", body: [
        "This list must be updated before a new vendor begins processing customer personal data. Material changes will be communicated through the platform or account email where required.",
        "Customers with a lawful objection should contact support promptly. Photaaz will review reasonable concerns and available alternatives."
      ]}
    ]
  }
};

const localizedLegalPages: Partial<Record<AppLocale, Partial<Record<LegalSlug, LegalPageCopy>>>> = {
  ur: {
    privacy: {
      title: "رازداری پالیسی",
      description: "Photaaz اکاؤنٹ، پورٹ فولیو، انکوائری، اور پلیٹ فارم ڈیٹا کیسے جمع، استعمال، اور محفوظ کرتا ہے۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "ہم کون سی معلومات جمع کرتے ہیں",
          body: [
            "ہم اکاؤنٹ تفصیلات، بزنس رابطہ معلومات، پورٹ فولیو مواد، اپ لوڈڈ میڈیا میٹا ڈیٹا، سپورٹ پیغامات، اور سروس چلانے کے لیے ضروری بنیادی ٹیکنیکل ڈیٹا جمع کرتے ہیں۔",
            "اگر payments enabled ہوں تو billing details منتخب payment provider handle کرتا ہے۔ Photaaz subscription status اور plan records رکھتا ہے، مکمل payment card data نہیں۔"
          ]
        },
        {
          title: "ہم اسے کیسے استعمال کرتے ہیں",
          body: [
            "ہم ڈیٹا کو portfolio websites provide کرنے، subscriptions manage کرنے، support requests process کرنے، platform protect کرنے، performance improve کرنے، اور اہم account یا service notices بھیجنے کے لیے استعمال کرتے ہیں۔",
            "Contact form submissions متعلقہ portfolio owner کے ساتھ share کی جاتی ہیں اور support یا abuse prevention کے لیے platform administrators بھی review کر سکتے ہیں۔"
          ]
        },
        {
          title: "ڈیٹا کنٹرول",
          body: [
            "Portfolio owners اپنے dashboard سے جہاں دستیاب ہو visible profile، gallery، category، اور contact information update یا remove کر سکتے ہیں۔",
            "Access، correction، یا deletion سے متعلق requests published support contact کے ذریعے بھیجی جا سکتی ہیں۔"
          ]
        }
      ]
    },
    terms: {
      title: "شرائط و ضوابط",
      description: "Photaaz کو photographer، visitor، یا platform administrator کے طور پر استعمال کرنے کے بنیادی اصول۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "سروس کا استعمال",
          body: [
            "Photaaz photographers کو public websites publish کرنے، galleries organize کرنے، inquiries receive کرنے، اور presentation settings manage کرنے کے لیے hosted portfolio tools فراہم کرتا ہے۔",
            "Users account access محفوظ رکھنے اور publish کیے گئے content کے accurate، lawful، اور owned یا licensed ہونے کے ذمہ دار ہیں۔"
          ]
        },
        {
          title: "Subscriptions اور availability",
          body: [
            "Plans، limits، custom domain access، storage، translations، premium themes، اور دیگر paid features package کے لحاظ سے مختلف ہو سکتے ہیں اور platform administrators انہیں change یا extend کر سکتے ہیں۔",
            "ہم service reliable رکھنے کی کوشش کرتے ہیں، لیکن maintenance، third-party provider outages، یا abuse-prevention actions access کو متاثر کر سکتے ہیں۔"
          ]
        },
        {
          title: "Content responsibility",
          body: [
            "Photographers uploaded photos، text، logos، links، اور contact information کے ذمہ دار رہتے ہیں۔",
            "Photaaz law، copyright، privacy، safety، یا acceptable-use rules کی خلاف ورزی کرنے والا content remove، hide، reject، یا restrict کر سکتا ہے۔"
          ]
        }
      ]
    },
    refund: {
      title: "ریفنڈ پالیسی",
      description: "Photaaz subscriptions کے لیے refunds، package extensions، اور account compensation کیسے handle ہو سکتی ہے۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "عمومی پالیسی",
          body: [
            "Refund eligibility selected package، service usage، payment provider rules، اور reported issue پر depend کرتی ہے۔",
            "Portfolio setup، custom domain setup، custom work، translations، اور premium configuration میں فوری platform work شامل ہو سکتا ہے، اس لیے refunds case by case review ہوتے ہیں۔"
          ]
        },
        {
          title: "Extensions اور compensation",
          body: [
            "جہاں refund بہترین حل نہ ہو، administrators customer package extend، credit apply، یا access adjust کر سکتے ہیں۔",
            "Package extensions admin dashboard میں managed subscription records میں visible ہوتی ہیں۔"
          ]
        },
        {
          title: "Request کیسے کریں",
          body: [
            "Refund یا compensation request میں account email، package name، payment date، اور request کی وجہ شامل ہونی چاہیے۔",
            "Approved refunds جہاں ممکن ہو original payment route سے process کیے جاتے ہیں۔"
          ]
        }
      ]
    },
    cookies: {
      title: "کوکی پالیسی",
      description: "Photaaz اور customer portfolio websites پر cookies اور similar browser storage کیسے استعمال ہو سکتی ہیں۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "Essential cookies",
          body: [
            "Photaaz login sessions، locale preferences، dashboard security، اور normal site operation کے لیے essential cookies یا browser storage استعمال کر سکتا ہے۔",
            "یہ protected dashboards اور account features کے درست کام کرنے کے لیے ضروری ہیں۔"
          ]
        },
        {
          title: "Optional analytics",
          body: [
            "اگر analytics یا marketing tools بعد میں enabled ہوں تو انہیں clearly disclose کیا جانا چاہیے اور site کے offered region کے مطابق control ہونا چاہیے۔",
            "Visitors اپنے browser settings سے cookies manage یا block بھی کر سکتے ہیں۔"
          ]
        },
        {
          title: "Customer sites",
          body: [
            "Customer portfolio sites forms، spam protection، embedded services، analytics، یا media providers کے لیے cookies استعمال کر سکتی ہیں اگر وہ features enabled ہوں۔",
            "Portfolio owners کو third-party tools add کرنے سے پہلے ان کے privacy impact کو سمجھنا چاہیے۔"
          ]
        }
      ]
    },
    "acceptable-use": {
      title: "قابل قبول استعمال پالیسی",
      description: "Content اور behavior rules جو photographers، visitors، اور Photaaz platform کو protect کرتے ہیں۔",
      updated: "24 جون 2026",
      sections: [
        {
          title: "Disallowed content",
          body: [
            "Users illegal، exploitative، stolen، hateful، abusive، threatening، deceptive، یا privacy-violating content upload نہیں کر سکتے۔",
            "Users ایسی photos upload نہیں کر سکتے جو ان کی owned نہ ہوں یا publish کرنے کی permission نہ ہو، بشمول دوسرے photographers یا platforms سے لیا گیا copyrighted work۔"
          ]
        },
        {
          title: "Platform abuse",
          body: [
            "Service کو spam، phishing، malware، impersonation، scraping، harassment، fraud، یا package limits اور security controls bypass کرنے کے لیے استعمال نہیں کیا جا سکتا۔",
            "Custom domain، contact forms، galleries، اور public pages کو identity، pricing، affiliation، یا ownership کے بارے میں visitors کو mislead کرنے کے لیے استعمال نہیں کیا جا سکتا۔"
          ]
        },
        {
          title: "Review اور enforcement",
          body: [
            "Uploads publicly appear ہونے سے پہلے review میں رکھے جا سکتے ہیں۔ Administrators content یا account behavior میں risk ہو تو approve، reject، flag، remove، suspend، یا access disable کر سکتے ہیں۔",
            "Repeated violations مستقل account restrictions کا سبب بن سکتی ہیں، removed content restore کیے بغیر۔"
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
          <Link href={localizePath(locale, "/")} className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary transition hover:text-[#101418]">
            Home
          </Link>
        </div>

      </section>

      <article className="mx-auto max-w-5xl px-5 py-14 sm:px-8 lg:px-12">
        <p className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-primary">Legal</p>
        <h1 className="pf-fluid-title-page mt-4 max-w-3xl font-display font-light leading-none tracking-[-0.055em] sm:text-7xl">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{page.description}</p>
        <p className="mt-4 text-sm text-slate-500">Last updated: {page.updated}</p>

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

        {slug === "privacy" ? <PrivacyRequestForm locale={locale} /> : null}
        {slug === "copyright" ? <CopyrightNoticeForm locale={locale} /> : null}

        <nav className="mt-12 flex flex-wrap gap-3 border-t border-[#d9d6ce] pt-6">
          {legalLinks.map((link) => (
            <Link key={link.slug} href={localizePath(locale, legalPath(link.slug))} className="border border-[#d9d6ce] bg-white px-4 py-2 font-nav text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-primary hover:text-primary">
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
