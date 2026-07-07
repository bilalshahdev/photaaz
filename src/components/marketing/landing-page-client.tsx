"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Facebook, Instagram, Linkedin, Mail, MessageCircle, MessageSquareText, Phone, UserRound, Youtube } from "lucide-react";
import { createSupportRequest } from "@/actions/support-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { MarketingContainer } from "@/components/layout/marketing-container";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";
import { JsonLd } from "@/components/seo/json-ld";
import { benefitFeatures } from "@/data/marketing";
import { getThemeIcon } from "@/components/themes/theme-icon";
import { legalLinks, legalPath } from "@/config/legal";
import { onboardingPath, themeDemoPath, themePath, themesPath } from "@/config/routes";
import { getTextDirection, localizePath, resolveLocalizedString, type AppLocale, type MarketingMessages } from "@/i18n/locales";
import { faqJsonLd, softwareApplicationJsonLd } from "@/lib/seo";
import type { PlatformAppConfig } from "@/services/admin/admin-data";
import type { PlatformAnnouncementView, PlatformLandingSettings, PlatformPricingPlanView, PlatformThemeView } from "@/services/platform/platform-data";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=90",
    alt: "Photographer capturing a wide scenic landscape at golden hour"
  },
  {
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2600&q=90",
    alt: "Professional camera held during an outdoor photography session"
  },
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2600&q=90",
    alt: "Photographer working with a camera in a cinematic outdoor setting"
  }
];

type LandingPageClientProps = {
  locale: AppLocale;
  messages: MarketingMessages;
  settings: PlatformLandingSettings;
  themes: PlatformThemeView[];
  pricingPlans: PlatformPricingPlanView[];
  announcements: PlatformAnnouncementView[];
  enabledLocales: AppLocale[];
  appConfig: PlatformAppConfig;
};

export function LandingPageClient({ locale, messages, settings, themes, pricingPlans, announcements, enabledLocales, appConfig }: LandingPageClientProps) {
  const copy = messages.home;
  const isRtl = getTextDirection(locale) === "rtl";
  const [contactStatus, setContactStatus] = useState<"idle" | "success" | "error">("idle");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [isThemeCarouselPaused, setIsThemeCarouselPaused] = useState(false);
  const themeCarouselRef = useRef<HTMLDivElement>(null);
  const themeScrollSyncTimeoutRef = useRef<number | null>(null);
  const programmaticThemeScrollRef = useRef(false);
  const hero = {
    eyebrow: resolveLocalizedString(settings.hero.eyebrow, locale),
    headline: resolveLocalizedString(settings.hero.headline, locale),
    subheadline: resolveLocalizedString(settings.hero.subheadline, locale),
    primaryCta: resolveLocalizedString(settings.hero.primaryCta, locale),
    secondaryCta: resolveLocalizedString(settings.hero.secondaryCta, locale)
  };
  const contact = {
    eyebrow: resolveLocalizedString(settings.contact.eyebrow, locale),
    title: resolveLocalizedString(settings.contact.title, locale),
    body: resolveLocalizedString(settings.contact.body, locale),
    submitLabel: resolveLocalizedString(settings.contact.submitLabel, locale)
  };
  const activeFaqs = settings.faqs
    .filter((faq) => faq.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((faq) => ({
      question: resolveLocalizedString(faq.question, locale),
      answer: resolveLocalizedString(faq.answer, locale)
    }));
  const activeAnnouncement = announcements[0];
  const isSectionVisible = (key: keyof typeof settings.sections) => settings.sections[key]?.enabled;
  const sectionOrder = (key: keyof typeof settings.sections) => settings.sections[key]?.displayOrder ?? 99;
  const PreviousThemeIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextThemeIcon = isRtl ? ChevronLeft : ChevronRight;
  const ownershipPlan = pricingPlans.find((plan) => plan.key === "ownership");
  const subscriptionPlans = pricingPlans.filter((plan) => plan.key !== "ownership");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % heroImages.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (themes.length <= 1 || isThemeCarouselPaused) return;

    const timer = window.setInterval(() => {
      const nextIndex = (activeThemeIndex + 1) % themes.length;
      scrollThemeCarouselTo(nextIndex);
    }, 4600);

    return () => window.clearInterval(timer);
  }, [activeThemeIndex, isThemeCarouselPaused, themes.length]);

  useEffect(() => {
    return () => {
      if (themeScrollSyncTimeoutRef.current) {
        window.clearTimeout(themeScrollSyncTimeoutRef.current);
      }
    };
  }, []);

  function scrollThemeCarousel(direction: "previous" | "next") {
    if (!themes.length) return;

    const nextIndex = direction === "next" ? (activeThemeIndex + 1) % themes.length : (activeThemeIndex - 1 + themes.length) % themes.length;
    scrollThemeCarouselTo(nextIndex);
  }

  function scrollThemeCarouselTo(index: number) {
    const carousel = themeCarouselRef.current;
    if (!carousel) return;

    const target = carousel.children[index] as HTMLElement | undefined;

    if (!target) return;

    const targetLeft = target.offsetLeft - carousel.offsetLeft;

    setActiveThemeIndex(index);
    programmaticThemeScrollRef.current = true;
    carousel.scrollTo({ left: targetLeft, behavior: "smooth" });

    if (themeScrollSyncTimeoutRef.current) {
      window.clearTimeout(themeScrollSyncTimeoutRef.current);
    }

    themeScrollSyncTimeoutRef.current = window.setTimeout(() => {
      programmaticThemeScrollRef.current = false;
    }, 720);
  }

  function syncThemeCarouselIndex() {
    const carousel = themeCarouselRef.current;
    if (!carousel) return;
    if (programmaticThemeScrollRef.current) return;

    if (themeScrollSyncTimeoutRef.current) {
      window.clearTimeout(themeScrollSyncTimeoutRef.current);
    }

    themeScrollSyncTimeoutRef.current = window.setTimeout(() => {
      const currentCarousel = themeCarouselRef.current;
      if (!currentCarousel) return;

      const items = Array.from(currentCarousel.children) as HTMLElement[];
      const viewportCenter = currentCarousel.scrollLeft + currentCarousel.clientWidth / 2;
      const closestIndex = items.reduce(
        (best, item, index) => {
          const itemCenter = item.offsetLeft + item.clientWidth / 2;
          const distance = Math.abs(itemCenter - viewportCenter);
          return distance < best.distance ? { index, distance } : best;
        },
        { index: 0, distance: Number.POSITIVE_INFINITY }
      ).index;

      setActiveThemeIndex(closestIndex);
    }, 120);
  }

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="flex flex-col bg-[#f7f8f6] text-[#101418]">
      <JsonLd data={[softwareApplicationJsonLd(appConfig, pricingPlans), ...(activeFaqs.length ? [faqJsonLd(activeFaqs)] : [])]} />
      <MarketingHeaderStack announcement={activeAnnouncement} locale={locale} messages={messages} enabledLocales={enabledLocales} />
      <ScrollToTop />

      {isSectionVisible("hero") ? (
      <section className="relative min-h-screen overflow-hidden bg-[#101418] text-white" style={{ order: sectionOrder("hero") }}>
        {heroImages.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            unoptimized
            className={`object-cover transition-opacity duration-1000 ${index === heroImageIndex ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.82)_0%,rgba(8,8,7,0.54)_42%,rgba(8,8,7,0.16)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 pb-8">
          <MarketingContainer className="flex justify-start gap-2">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setHeroImageIndex(index)}
              className={`h-1.5 w-10 transition ${index === heroImageIndex ? "bg-teal-300" : "bg-white/28"}`}
              aria-label={`Show hero image ${index + 1}`}
            />
          ))}
          </MarketingContainer>
        </div>
        <MarketingContainer className="relative flex min-h-screen items-center pb-14 pt-40 sm:pt-44 lg:pt-48">
          <section className={`w-full max-w-4xl ${isRtl ? "text-right" : ""}`}>
            <p className="inline-flex rounded-full border border-white/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/76">
              {hero.eyebrow}
            </p>
            <h1 className="pf-fluid-title-page mt-7 max-w-4xl font-display font-light leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-8xl">
              {hero.headline}
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-white/82">
              {hero.subheadline}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-none bg-white px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-[#101418] hover:bg-white/90">
                <Link href={localizePath(locale, onboardingPath())}>
                  {hero.primaryCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-none border border-white/24 bg-black/24 px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-black/38">
                <Link href="#themes">{hero.secondaryCta}</Link>
              </Button>
            </div>
            <div className="mt-12 grid w-full gap-4 border-y border-white/18 py-5 sm:grid-cols-3">
              {copy.steps.map((item) => (
                <div key={item}>
                  <CheckCircle2 className="size-4 text-teal-300" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold">{item}</p>
                  <p className="mt-1 text-xs text-white/52">{copy.stepNote}</p>
                </div>
              ))}
            </div>
          </section>
        </MarketingContainer>
      </section>
      ) : null}

      {isSectionVisible("themes") ? (
      <section id="themes" className="py-20" style={{ order: sectionOrder("themes") }}>
        <MarketingContainer>
          <div className="border-b border-[#d7dedb] pb-5 lg:pb-8">
            <div className="max-w-4xl">
              <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">{copy.themesEyebrow}</p>
              <h2 className="pf-fluid-title-page mt-3 font-display font-light leading-none tracking-[-0.05em]">
                {copy.themesTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#59636b]">
                {copy.themesBody}
              </p>
            </div>
          </div>
        </MarketingContainer>

        <div className="border-b border-[#d7dedb] bg-[#f7f8f6]">
          <MarketingContainer className="flex items-center gap-2 py-3 lg:justify-end">
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" onClick={() => scrollThemeCarousel("previous")} className="size-11 rounded-none border-[#101418] bg-transparent p-0">
                <PreviousThemeIcon className="size-4" aria-hidden="true" />
                <span className="sr-only">Previous themes</span>
              </Button>
              <Button type="button" variant="outline" onClick={() => scrollThemeCarousel("next")} className="size-11 rounded-none border-[#101418] bg-transparent p-0">
                <NextThemeIcon className="size-4" aria-hidden="true" />
                <span className="sr-only">Next themes</span>
              </Button>
            </div>
            <Button asChild variant="outline" className="h-11 min-w-0 flex-1 rounded-none border-[#101418] bg-transparent px-3 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.18em] lg:max-w-xs lg:flex-none lg:px-4 lg:tracking-[0.22em]">
              <Link href={localizePath(locale, themesPath())}>
                <span className="truncate">{copy.viewAllThemes}</span>
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </MarketingContainer>
          </div>

        <MarketingContainer>
          <div className="relative mt-10 overflow-hidden">
            <div
              ref={themeCarouselRef}
              onScroll={syncThemeCarouselIndex}
              onMouseEnter={() => setIsThemeCarouselPaused(true)}
              onMouseLeave={() => setIsThemeCarouselPaused(false)}
              onFocus={() => setIsThemeCarouselPaused(true)}
              onBlur={() => setIsThemeCarouselPaused(false)}
              className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-1 snap-x snap-mandatory"
            >
              {themes.map(({ name, slug, image, description, features, iconKey }) => {
                const Icon = getThemeIcon(iconKey);
                const themeName = resolveLocalizedString(name, locale);
                const themeDescription = resolveLocalizedString(description, locale);
                const themeFeatures = features.map((feature) => resolveLocalizedString(feature, locale));

                return (
                <article key={slug} className="group relative grid min-w-[88vw] snap-start overflow-hidden border border-[#d7dedb]/80 bg-white shadow-[0_18px_55px_rgba(16,20,24,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_80px_rgba(16,20,24,0.14)] sm:min-w-[620px] xl:min-w-[760px] md:grid-cols-[1.12fr_0.88fr]">
                  <div className="relative m-3 min-h-[280px] overflow-hidden bg-[#101418] md:mr-0 md:min-h-[360px]">
                    <Image src={image} alt={`${themeName} theme preview`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
                  </div>
                  <div className="flex min-h-[360px] flex-col p-7">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex size-10 items-center justify-center border border-[#d7dedb] bg-[#f7f8f6] text-teal-700">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#7a858c]">
                        UI theme
                      </p>
                    </div>
                    <h3 className="mt-8 font-display text-5xl font-light leading-none tracking-[-0.055em] break-words">{themeName}</h3>
                    <p className="text-sm leading-6 text-[#59636b]">{themeDescription}</p>
                    <ul className="mt-5 space-y-2 text-sm text-[#101418]">
                      {themeFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 shrink-0 text-teal-700" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto grid gap-2 pt-7">
                      <Link href={localizePath(locale, themePath(slug))} className="inline-flex h-11 items-center justify-center border border-[#d7dedb] bg-[#ffffff] font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#101418] transition hover:border-[#101418]">
                        {copy.themeDetails}
                      </Link>
                      <Link href={localizePath(locale, themeDemoPath(slug))} className="inline-flex h-11 items-center justify-center gap-2 bg-[#101418] font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-teal-800">
                        {copy.liveDemo}
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </div>

          {themes.length > 1 ? (
            <div className="mt-6 flex justify-center" aria-label="Theme carousel position">
              <div className="relative flex items-center gap-2">
                <span
                  className="pointer-events-none absolute left-0 top-1/2 z-10 h-1.5 w-6 rounded-full bg-[#101418] transition-transform duration-500 ease-out"
                  style={{ transform: `translate(${activeThemeIndex * 2}rem, -50%)` }}
                  aria-hidden="true"
                />
              {themes.map((theme, index) => (
                <button
                  key={theme.slug}
                  type="button"
                  onClick={() => scrollThemeCarouselTo(index)}
                    className="relative z-20 flex h-4 w-6 items-center justify-center"
                  aria-label={`Show ${resolveLocalizedString(theme.name, locale)} theme`}
                  aria-current={index === activeThemeIndex ? "true" : undefined}
                >
                    <span className="h-1.5 w-4 rounded-full bg-[#cbd5d1] transition-colors duration-300 hover:bg-teal-700" aria-hidden="true" />
                </button>
              ))}
              </div>
            </div>
          ) : null}
        </MarketingContainer>
      </section>
      ) : null}

      {isSectionVisible("features") ? (
      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8" style={{ order: sectionOrder("features") }}>
        <div className="mx-auto max-w-7xl">
          <div className={`border-b border-[#d7dedb] pb-8 ${isRtl ? "text-right" : ""}`}>
            <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">{copy.featuresEyebrow}</p>
            <h2 className="pf-fluid-title-page mt-3 max-w-4xl font-display font-light leading-none tracking-[-0.05em]">
              {copy.featuresTitle}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settings.features
              .filter((feature) => feature.enabled)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map(({ title, body }, index) => {
                const Icon = benefitFeatures[index % benefitFeatures.length]?.icon ?? CheckCircle2;
                const featureTitle = resolveLocalizedString(title, locale);
                const featureBody = resolveLocalizedString(body, locale);

                return (
                  <article key={`${featureTitle}-${index}`} className="border border-[#d7dedb] bg-[#f7f8f6] p-5">
                    <Icon className="size-6 text-teal-700" aria-hidden="true" />
                    <h3 className="mt-8 text-lg font-semibold">{featureTitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#59636b]">{featureBody}</p>
                  </article>
                );
              })}
          </div>
        </div>
      </section>
      ) : null}

      {isSectionVisible("pricing") ? (
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8" style={{ order: sectionOrder("pricing") }}>
        <div className="mx-auto max-w-7xl">
          <div className={`border-b border-[#d7dedb] pb-8 ${isRtl ? "text-right" : ""}`}>
            <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">{copy.pricingEyebrow}</p>
            <h2 className="pf-fluid-title-page mt-3 max-w-4xl font-display font-light leading-none tracking-[-0.05em]">
              {copy.pricingTitle}
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const planName = resolveLocalizedString(plan.name, locale);
              const planDescription = resolveLocalizedString(plan.description, locale);
              const planFeatures = plan.features.map((feature) => resolveLocalizedString(feature, locale));

              return (
              <article key={plan.key} className={plan.featured ? "border-2 border-[#101418] bg-[#101418] p-6 text-white" : "border border-[#d7dedb] bg-white p-6"}>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-500">{planName}</p>
                <MarketingPrice
                  monthlyPrice={plan.monthlyPrice}
                  annualPrice={plan.annualPrice}
                  lifetimePrice={plan.lifetimePrice}
                  featured={plan.featured}
                />
                <p className={plan.featured ? "mt-4 text-sm leading-6 text-white/68" : "mt-4 text-sm leading-6 text-[#59636b]"}>{planDescription}</p>
                <ul className="mt-6 space-y-3">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-500" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
              );
            })}
            {ownershipPlan ? (
              <OwnershipPricingCard plan={ownershipPlan} locale={locale} />
            ) : null}
          </div>
        </div>
      </section>
      ) : null}

      {isSectionVisible("faq") && activeFaqs.length > 0 ? (
      <section id="faq" className="bg-[#f7f8f6] px-4 py-20 sm:px-6 lg:px-8" style={{ order: sectionOrder("faq") }}>
        <div className="mx-auto max-w-7xl">
          <div className={`border-b border-[#d7dedb] pb-8 ${isRtl ? "text-right" : ""}`}>
            <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">{copy.faqEyebrow}</p>
            <h2 className="pf-fluid-title-page mt-3 max-w-4xl font-display font-light leading-none tracking-[-0.05em]">
              {copy.faqTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#59636b]">
              {copy.faqBody}
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {activeFaqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {isSectionVisible("contact") ? (
      <section id="contact" className="bg-white px-4 py-20 sm:px-6 lg:px-8" style={{ order: sectionOrder("contact") }}>
        <div className="mx-auto max-w-7xl">
          <div className={`border-b border-[#d7dedb] pb-8 ${isRtl ? "text-right" : ""}`}>
            <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">{contact.eyebrow}</p>
            <h2 className="pf-fluid-title-page mt-3 max-w-4xl font-display font-light leading-none tracking-[-0.05em]">
              {contact.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#59636b]">
              {contact.body}
            </p>
          </div>

          <form
            className="mt-8 border border-[#d7dedb] bg-[#f7f8f6] p-5 shadow-[0_18px_55px_rgba(16,20,24,0.08)] md:p-7"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);

              setContactStatus("idle");

              createSupportRequest({
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? ""),
                topic: "Homepage question",
                message: String(formData.get("message") ?? "")
              })
                .then(() => {
                  setContactStatus("success");
                  form.reset();
                })
                .catch(() => setContactStatus("error"));
            }}
          >
            {contactStatus !== "idle" ? (
              <div className={contactStatus === "success" ? "mb-5 border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900" : "mb-5 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"}>
                {contactStatus === "success"
                  ? copy.contactSuccess
                  : copy.contactError}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Label className="block">
                <span className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{copy.nameLabel}</span>
                <span className="mt-2 flex h-14 items-center border border-[#d7dedb] bg-[#ffffff] px-4">
                  <UserRound className="mr-3 size-5 shrink-0 text-teal-700" aria-hidden="true" />
                  <Input required name="name" className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder={copy.namePlaceholder} />
                </span>
              </Label>

              <Label className="block">
                <span className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{copy.emailLabel}</span>
                <span className="mt-2 flex h-14 items-center border border-[#d7dedb] bg-[#ffffff] px-4">
                  <Mail className="mr-3 size-5 shrink-0 text-teal-700" aria-hidden="true" />
                  <Input required name="email" type="email" className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder={copy.emailPlaceholder} />
                </span>
              </Label>
            </div>

            <Label className="mt-4 block">
              <span className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">{copy.messageLabel}</span>
              <span className="mt-2 flex min-h-40 items-start border border-[#d7dedb] bg-[#ffffff] px-4 py-4">
                <MessageSquareText className="mr-3 mt-1 size-5 shrink-0 text-teal-700" aria-hidden="true" />
                <Textarea
                  required
                  name="message"
                  className="min-h-32 min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  placeholder={copy.messagePlaceholder}
                />
              </span>
            </Label>

            <Button type="submit" className="mt-5 h-11 rounded-none bg-[#101418] px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-teal-800">
              {contact.submitLabel}
            </Button>
          </form>
        </div>
      </section>
      ) : null}

      {isSectionVisible("finalCta") ? (
      <section className="bg-[#101418] px-4 py-14 text-white sm:px-6 lg:px-8" style={{ order: sectionOrder("finalCta") }}>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-300">{copy.launchEyebrow}</p>
            <h2 className="pf-fluid-title-page mt-3 max-w-4xl font-display font-light leading-none tracking-[-0.05em]">
              {copy.launchTitle}
            </h2>
          </div>
          <Button asChild size="lg" className="rounded-none bg-white px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-[#101418] hover:bg-white/90">
            <Link href={localizePath(locale, onboardingPath())}>
              {hero.primaryCta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
      ) : null}

      <MarketingFooter locale={locale} config={appConfig} />
    </main>
  );
}

function MarketingHeaderStack({
  announcement,
  locale,
  messages,
  enabledLocales
}: {
  announcement?: PlatformAnnouncementView;
  locale: AppLocale;
  messages: MarketingMessages;
  enabledLocales: AppLocale[];
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const announcementHeight = announcement ? 40 : 0;

    function handleScroll() {
      setOffset(-Math.min(announcementHeight, window.scrollY));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [announcement]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 will-change-transform" style={{ transform: `translateY(${offset}px)` }}>
      {announcement ? <AnnouncementBar announcement={announcement} locale={locale} /> : null}
      <MarketingHeader locale={locale} messages={messages} enabledLocales={enabledLocales} hasAnnouncement={Boolean(announcement)} stacked />
    </div>
  );
}

function MarketingFooter({ locale, config }: { locale: AppLocale; config: PlatformAppConfig }) {
  const socialLinks = [
    { key: "instagram", icon: Instagram, ...config.socialLinks.instagram },
    { key: "facebook", icon: Facebook, ...config.socialLinks.facebook },
    { key: "youtube", icon: Youtube, ...config.socialLinks.youtube },
    { key: "linkedin", icon: Linkedin, ...config.socialLinks.linkedin },
    { key: "snapchat", icon: MessageCircle, ...config.socialLinks.snapchat }
  ].filter((link) => link.enabled && isHttpUrl(link.href));
  const showSupportEmail = Boolean(config.supportEmail);
  const showSalesEmail = Boolean(config.salesEmail && config.salesEmail !== config.supportEmail);
  const showPhone = config.phone.enabled && Boolean(config.phone.value);
  const showCreator = config.creatorLink.enabled && isHttpUrl(config.creatorLink.href);
  const creatorLabel = config.creatorLink.label.replace(/^(built|made)\s+by\s+/i, "").trim();
  const copyrightText = config.copyrightText.replace(/\{year\}/g, String(new Date().getFullYear()));

  return (
    <footer className="border-t border-[#20272b] bg-[#101418] text-white" style={{ order: 1000 }}>

      <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(180px,0.45fr)_minmax(230px,0.65fr)] lg:items-start">
          <div className="max-w-xl">
            <Link href={localizePath(locale, "/")} className="font-brand text-5xl font-semibold tracking-[-0.05em] text-white">
              Photaaz
            </Link>
            {config.footerText ? <p className="mt-3 max-w-xl truncate text-xs leading-6 text-white/62">{config.footerText}</p> : null}
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/75">
              {showSupportEmail ? (
                <a href={`mailto:${config.supportEmail}`} className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-teal-300/60 hover:text-teal-300">
                  <Mail className="size-4" aria-hidden="true" />
                  <span>{config.supportEmail}</span>
                </a>
              ) : null}
              {config.companyAddress ? <span className="inline-flex items-center border border-white/10 bg-white/[0.03] px-3 py-2">{config.companyAddress}</span> : null}
            </div>
          </div>

          <div>
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">{locale === "ur" ? "\u0642\u0627\u0646\u0648\u0646\u06cc" : "Legal"}</p>
            <nav className="mt-4 grid gap-2.5 text-sm text-white/72">
              {legalLinks.map((link) => (
                <Link key={link.slug} href={localizePath(locale, legalPath(link.slug))} className="w-fit transition hover:translate-x-1 hover:text-teal-300">
                  {resolveLocalizedString(link.label, locale)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">{locale === "ur" ? "\u0633\u0648\u0634\u0644" : "Social"}</p>
            {socialLinks.length ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ key, icon: Icon, href, label }) => (
                  <Tooltip key={key} content={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="inline-flex size-11 items-center justify-center border border-white/14 bg-white/[0.04] text-white transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-300 hover:text-[#101418]"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </Tooltip>
                ))}
              </div>
            ) : null}
            <div className="flex flex-col gap-3 text-sm text-white/72">
              {showPhone ? (
                <a href={`tel:${config.phone.value.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 transition hover:text-teal-300">
                  <Phone className="size-4" aria-hidden="true" />
                  <span>
                    {config.phone.label}: {config.phone.value}
                  </span>
                </a>
              ) : null}
            </div>
            {showSalesEmail ? (
              <a href={`mailto:${config.salesEmail}`} className="inline-flex items-center gap-2 text-sm text-white/72 transition hover:text-teal-300">
                <Mail className="size-4" aria-hidden="true" />
                <span>{config.salesEmail}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-9 grid gap-4 border-t border-white/10 pt-5 text-center text-xs font-medium uppercase tracking-[0.16em] text-white/48 sm:grid-cols-3 sm:items-center">
          <span aria-hidden="true" className="hidden sm:block" />
          <p>{copyrightText}</p>
          {showCreator && creatorLabel ? (
            <a href={config.creatorLink.href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-teal-300 transition hover:text-white sm:justify-self-end">
              Made by {creatorLabel}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>
      </div>
    </footer>
  );
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function OwnershipPricingCard({ plan, locale }: { plan: PlatformPricingPlanView; locale: AppLocale }) {
  const planName = resolveLocalizedString(plan.name, locale);
  const planDescription = resolveLocalizedString(plan.description, locale);
  const planFeatures = plan.features.map((feature) => resolveLocalizedString(feature, locale));

  return (
    <article className="border border-teal-800/30 bg-[#f3f7f3] p-6 text-[#101418] shadow-[0_24px_70px_rgba(16,20,24,0.10)] lg:col-span-3">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div>
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">Permanent ownership</p>
          <h3 className="mt-4 font-display text-5xl font-light leading-none tracking-[-0.06em]">{planName}</h3>
          <MarketingPrice
            monthlyPrice={plan.monthlyPrice}
            annualPrice={plan.annualPrice}
            lifetimePrice={plan.lifetimePrice}
            featured={false}
          />
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#59636b]">{planDescription}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {planFeatures.slice(0, 8).map((feature) => (
            <div key={feature} className="flex gap-3 border border-teal-900/15 bg-white/75 p-4 text-sm text-[#334155]">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-700" aria-hidden="true" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function MarketingPrice({
  monthlyPrice,
  annualPrice,
  lifetimePrice,
  featured
}: {
  monthlyPrice: number | null;
  annualPrice: number | null;
  lifetimePrice: number | null;
  featured: boolean;
}) {
  const price = getMarketingPrice({ monthlyPrice, annualPrice, lifetimePrice });

  return (
    <div className="mt-6 flex items-end gap-2">
      <span className={featured ? "pb-2 text-sm font-semibold text-white/48" : "pb-2 text-sm font-semibold text-[#59636b]"}>
        Rs
      </span>
      <span className="font-display text-6xl font-light leading-none tracking-[-0.06em]">{price.amount}</span>
      <span className={featured ? "pb-2 text-sm text-white/58" : "pb-2 text-sm text-[#59636b]"}>
        {price.suffix}
      </span>
    </div>
  );
}

function getMarketingPrice(plan: { monthlyPrice: number | null; annualPrice: number | null; lifetimePrice: number | null }) {
  if (plan.monthlyPrice && plan.monthlyPrice > 0) {
    return {
      amount: Math.round(plan.monthlyPrice).toLocaleString("en-PK"),
      suffix: "/ month"
    };
  }

  if (plan.annualPrice && plan.annualPrice > 0) {
    return {
      amount: Math.round(plan.annualPrice).toLocaleString("en-PK"),
      suffix: "/ year"
    };
  }

  if (plan.lifetimePrice && plan.lifetimePrice > 0) {
    return {
      amount: Math.round(plan.lifetimePrice).toLocaleString("en-PK"),
      suffix: "one time"
    };
  }

  return {
    amount: "0",
    suffix: "/ month"
  };
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className="border border-[#d7dedb] bg-white p-5 shadow-[0_18px_55px_rgba(16,20,24,0.06)]">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-5 text-left text-lg font-semibold text-[#101418]"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown className={`mt-1 size-5 shrink-0 text-teal-700 transition duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="pt-4 text-sm leading-7 text-[#59636b]">{answer}</p>
        </div>
      </div>
    </article>
  );
}

