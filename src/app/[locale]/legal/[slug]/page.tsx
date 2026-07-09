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
