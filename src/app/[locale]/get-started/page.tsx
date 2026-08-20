"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Globe2,
  ImagePlus,
  LayoutTemplate,
  Mail,
  RadioTower,
  UserRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarketingControls } from "@/components/layout/marketing-controls";
import { publishOnboardingDraft } from "@/actions/onboarding-actions";
import { themeShowcases } from "@/data/marketing";
import { customerDashboardPath, themeDemoPath } from "@/config/routes";
import { getMessages, isLocale, localizePath, type AppLocale } from "@/i18n/locales";
import {
  getOnboardingStepErrors,
  onboardingPhotographyTypes,
  onboardingPhotoModes,
  onboardingThemeSlugs,
  validateOnboardingDraft,
} from "@/lib/onboarding-validation";

const photographyTypes = [
  {
    name: "Wedding",
    slug: "wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=84"
  },
  {
    name: "Travel",
    slug: "travel",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"
  },
  {
    name: "Street",
    slug: "street",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84"
  },
  {
    name: "Nature",
    slug: "nature",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=84"
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84"
  },
  {
    name: "Portrait",
    slug: "portrait",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=84"
  }
] as const;

const steps = [
  { label: "Theme", icon: LayoutTemplate },
  { label: "Categories", icon: Camera },
  { label: "Address", icon: Globe2 },
  { label: "Photos", icon: ImagePlus },
  { label: "Account", icon: UserRound },
  { label: "Publish", icon: RadioTower }
];

function normalizeSubdomain(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function isThemeSlug(value: string): value is (typeof onboardingThemeSlugs)[number] {
  return onboardingThemeSlugs.includes(value as (typeof onboardingThemeSlugs)[number]);
}

function isPhotographyType(value: string): value is (typeof onboardingPhotographyTypes)[number] {
  return onboardingPhotographyTypes.includes(value as (typeof onboardingPhotographyTypes)[number]);
}

export default function GetStartedPage() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const [isPublishing, startPublishing] = useTransition();
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<"" | (typeof onboardingThemeSlugs)[number]>("");
  const [primaryType, setPrimaryType] = useState<"" | (typeof onboardingPhotographyTypes)[number]>("");
  const [selectedTypes, setSelectedTypes] = useState<Array<(typeof onboardingPhotographyTypes)[number]>>([]);
  const [subdomain, setSubdomain] = useState("");
  const [photoMode, setPhotoMode] = useState<"" | (typeof onboardingPhotoModes)[number]>("");
  const [studioName, setStudioName] = useState("");
  const [email, setEmail] = useState("");
  const [publishError, setPublishError] = useState("");

  const theme = themeShowcases.find((item) => item.slug === selectedTheme);
  const type = photographyTypes.find((item) => item.slug === primaryType);
  const categories = selectedTypes
    .map((slug) => photographyTypes.find((item) => item.slug === slug))
    .filter((item): item is (typeof photographyTypes)[number] => Boolean(item));
  const cleanSubdomain = normalizeSubdomain(subdomain);
  const publicUrl = cleanSubdomain ? `${cleanSubdomain}.photaaz.com` : "your-name.photaaz.com";
  const draft = useMemo(
    () => ({
      theme: selectedTheme,
      primaryType,
      categories: selectedTypes,
      subdomain: cleanSubdomain,
      photoMode,
      studioName,
      email
    }),
    [cleanSubdomain, email, photoMode, primaryType, selectedTheme, selectedTypes, studioName]
  );
  const stepErrors = getOnboardingStepErrors(step, draft);
  const canContinue = stepErrors.length === 0;
  const canPublish = validateOnboardingDraft(draft).success;
  const selectedThemeName = theme?.name ?? "Not selected";
  const selectedTypeName = type?.name ?? "Not selected";
  const selectedThemeDemoPath = theme ? themeDemoPath(theme.slug) : "#";
  const routeLocale = params.locale ?? "";
  const locale: AppLocale = isLocale(routeLocale) ? routeLocale : "en";
  const messages = getMessages(locale);
  const highestAccessibleStep = useMemo(() => {
    let highestStep = 0;

    for (let index = 0; index < steps.length - 1; index += 1) {
      if (getOnboardingStepErrors(index, draft).length > 0) {
        break;
      }

      highestStep = index + 1;
    }

    return highestStep;
  }, [draft]);

  const previewImages = useMemo(() => {
    if (photoMode === "sample") {
      return [
        theme?.image ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=84",
        type?.image ?? "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=84",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84"
      ];
    }

    return [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=84",
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84"
    ];
  }, [photoMode, theme?.image, type?.image]);

  function nextStep() {
    if (step < steps.length - 1 && highestAccessibleStep >= step + 1) {
      setStep((current) => current + 1);
    }
  }

  function previousStep() {
    if (step > 0) {
      setStep((current) => current - 1);
    }
  }

  function goToStep(nextStepIndex: number) {
    if (nextStepIndex <= highestAccessibleStep) {
      setStep(nextStepIndex);
    }
  }

  function togglePhotographyType(slug: string) {
    if (!isPhotographyType(slug)) {
      return;
    }

    const isSelected = selectedTypes.includes(slug);

    if (isSelected) {
      const nextTypes = selectedTypes.filter((typeSlug) => typeSlug !== slug);

      setSelectedTypes(nextTypes);

      if (primaryType === slug) {
        setPrimaryType(nextTypes[0] ?? "");
      }

      return;
    }

    setSelectedTypes((current) => [...current, slug]);
  }

  function makePrimaryType(slug: string) {
    if (!isPhotographyType(slug)) {
      return;
    }

    if (!selectedTypes.includes(slug)) {
      setSelectedTypes((current) => [...current, slug]);
    }

    setPrimaryType(slug);
  }

  function publishDraft() {
    if (!canPublish || isPublishing) {
      return;
    }

    setPublishError("");

    startPublishing(async () => {
      const result = await publishOnboardingDraft(draft);

      if (!result.ok) {
        setPublishError(result.error);
        return;
      }

      router.push(customerDashboardPath(result.slug));
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#101418]">
      <header className="sticky top-0 z-40 border-b border-[#d7dedb] bg-[#f7f8f6] shadow-[0_12px_40px_rgba(16,20,24,0.08)] sm:bg-[#f7f8f6]/94 sm:backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          <Link href={localizePath(locale, "/")} className="focus-ring min-w-0 shrink-0 rounded-md text-[#101418]">
            <span className="font-brand text-2xl font-semibold leading-none tracking-[-0.04em] sm:text-3xl md:text-4xl">Photaaz</span>
          </Link>
          <div className="hidden items-center gap-3 text-sm text-[#59636b] sm:flex">
            <span className="font-nav text-xs font-semibold uppercase tracking-[0.18em]">Draft setup</span>
            <span className="h-4 w-px bg-[#d7dedb]" aria-hidden="true" />
            <span>Step {step + 1} of {steps.length}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <MarketingControls locale={locale} messages={messages} variant="solid" />
            <Button asChild variant="outline" size="sm" className="h-10 w-10 rounded-none border-[#101418] bg-transparent px-0 font-nav text-xs font-semibold uppercase tracking-[0.18em] sm:w-auto sm:px-4">
              <Link href={localizePath(locale, "/")} aria-label="Save and exit">
                <span className="hidden sm:inline">Save and exit</span>
                <ArrowRight className="size-4 sm:hidden" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
            <section className="border border-[#d7dedb] bg-white shadow-[0_20px_70px_rgba(16,20,24,0.08)]">
              <div className="border-b border-[#d7dedb] p-6 md:p-8">
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-primary">Get started</p>
                <h1 className="pf-fluid-title-page mt-4 max-w-3xl font-display font-light leading-none tracking-[-0.055em] md:text-7xl">
                  Create your portfolio in six simple steps.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[#59636b]">
                  Pick the look, choose your categories, claim your address, add photos, and publish.
                </p>
              </div>

              <div className="border-b border-[#d7dedb] px-4 py-5 md:px-8">
                <div className="h-1 overflow-hidden bg-[#e4d9ca]">
                  <div className="h-full bg-[#101418] transition-all duration-300" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
                <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto pb-1">
                  {steps.map(({ label, icon: Icon }, index) => {
                    const isActive = index === step;
                    const isDone = index < step;
                    const isAccessible = index <= highestAccessibleStep;

                    return (
                      <button
                        key={label}
                        type="button"
                        disabled={!isAccessible}
                        onClick={() => goToStep(index)}
                        className={`flex min-w-32 items-center gap-3 border px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                          isActive ? "border-[#101418] bg-[#101418] text-white" : isAccessible ? "border-[#d7dedb] bg-[#ffffff] text-[#101418] hover:border-[#101418]" : "border-[#d7dedb] bg-slate-50 text-slate-400"
                        }`}
                      >
                        <span className={`inline-flex size-8 shrink-0 items-center justify-center border ${isActive ? "border-white/18 bg-white/10" : "border-[#d7dedb] bg-white"}`}>
                          {isDone ? <CheckCircle2 className="size-4 text-primary" /> : <Icon className={isActive ? "size-4 text-primary-light" : "size-4 text-primary"} />}
                        </span>
                        <span>
                          <span className="block font-nav text-[0.62rem] font-semibold uppercase tracking-[0.18em]">0{index + 1}</span>
                          <span className="block font-nav text-[0.68rem] font-semibold uppercase tracking-[0.16em]">{label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-[520px] p-6 md:p-8">
                {step === 0 ? (
                  <div>
                    <SectionHeading eyebrow="Step 1" title="Choose a theme." body="This is the layout system your portfolio starts from. You can customize colors and content later." />
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      {themeShowcases.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={() => {
                              if (isThemeSlug(item.slug)) {
                                setSelectedTheme(item.slug);
                              }
                            }}
                            className={`group relative grid overflow-hidden border-2 text-left transition md:grid-cols-[0.85fr_1fr] ${
                              selectedTheme === item.slug ? "border-primary bg-[#101418] text-white shadow-[0_18px_45px_rgba(16,20,24,0.18)]" : "border-[#d7dedb] bg-[#ffffff] hover:border-[#101418]"
                            }`}
                          >
                            {selectedTheme === item.slug ? (
                              <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-2 bg-primary-light px-2.5 py-1 font-nav text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#101418]">
                                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                                Selected
                              </span>
                            ) : null}
                            <div className="relative min-h-44 overflow-hidden">
                              <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                            </div>
                            <div className="p-5">
                              <Icon className={selectedTheme === item.slug ? "size-5 text-primary-light" : "size-5 text-primary"} />
                              <h2 className="mt-5 font-display text-4xl font-light tracking-[-0.05em]">{item.name}</h2>
                              <p className={selectedTheme === item.slug ? "mt-3 text-sm leading-6 text-white/68" : "mt-3 text-sm leading-6 text-[#59636b]"}>{item.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div>
                    <SectionHeading eyebrow="Step 2" title="Choose your photography categories." body="Select the types of work you want to show. Pick one primary category and add every category you shoot." />
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      {photographyTypes.map((item) => {
                        const isSelected = selectedTypes.includes(item.slug);
                        const isPrimary = primaryType === item.slug;

                        return (
                          <article
                            key={item.slug}
                            className={`group overflow-hidden border-2 transition ${
                              isSelected ? "border-primary bg-[#101418] text-white shadow-[0_18px_45px_rgba(16,20,24,0.16)]" : "border-[#d7dedb] bg-[#ffffff] hover:border-[#101418]"
                            }`}
                          >
                            <button type="button" onClick={() => togglePhotographyType(item.slug)} className="block w-full text-left">
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                                {isPrimary ? (
                                  <span className="absolute left-3 top-3 bg-white px-2 py-1 font-nav text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#101418]">
                                    Primary
                                  </span>
                                ) : null}
                              </div>
                              <div className="p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="font-display text-3xl font-light tracking-[-0.05em]">{item.name}</p>
                                  <span className={`inline-flex size-7 items-center justify-center border ${isSelected ? "border-primary-light bg-primary-light text-[#101418]" : "border-[#d7dedb] bg-white"}`}>
                                    {isSelected ? <CheckCircle2 className="size-4" /> : null}
                                  </span>
                                </div>
                                <p className={isSelected ? "mt-2 text-xs text-white/58" : "mt-2 text-xs text-[#59636b]"}>
                                  {isSelected ? "Included as a portfolio category" : "Click to include this category"}
                                </p>
                              </div>
                            </button>
                            <div className="px-4 pb-4">
                              <button
                                type="button"
                                onClick={() => makePrimaryType(item.slug)}
                                className={`h-9 w-full border font-nav text-[0.64rem] font-semibold uppercase tracking-[0.16em] transition ${
                                  isPrimary
                                    ? "border-primary-light bg-primary-light text-[#101418]"
                                    : isSelected
                                      ? "border-white/24 text-white hover:bg-white/10"
                                      : "border-[#d7dedb] bg-white text-[#101418] hover:border-[#101418]"
                                }`}
                              >
                                {isPrimary ? "Primary category" : "Make primary"}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                    <div className="mt-5 border border-[#d7dedb] bg-white p-4 text-sm text-[#59636b]">
                      <span className="font-semibold text-[#101418]">Starter categories:</span>{" "}
                      {categories.map((category) => category.name).join(", ")}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div>
                    <SectionHeading eyebrow="Step 3" title="Claim your free address." body="Start with a Photaaz subdomain. You can connect a custom domain later from the dashboard." />
                    <div className="mt-8 max-w-2xl border border-[#d7dedb] bg-[#ffffff] p-5">
                      <Label className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary" htmlFor="subdomain">
                        Subdomain
                      </Label>
                      <div className="mt-3 flex flex-col border border-[#d7dedb] bg-white sm:flex-row">
                        <Input
                          id="subdomain"
                          value={subdomain}
                          onChange={(event) => setSubdomain(normalizeSubdomain(event.target.value))}
                          className="h-14 flex-1 rounded-none border-0 bg-transparent px-4 text-lg shadow-none focus-visible:ring-0"
                          placeholder="your-name"
                        />
                        <span className="flex h-14 items-center border-t border-[#d7dedb] px-4 text-[#59636b] sm:border-l sm:border-t-0">
                          .photaaz.com
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#59636b]">
                        Your draft site will be available at <strong className="text-[#101418]">{publicUrl}</strong>.
                      </p>
                      <ValidationMessages messages={stepErrors} />
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div>
                    <SectionHeading eyebrow="Step 4" title="Add your first photos." body="Upload can connect to storage later. For now, pick whether this draft starts with sample photos or your own set." />
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      {[
                        { key: "sample" as const, title: "Use sample photos", body: "Fastest way to preview the website before uploading your work." },
                        { key: "upload" as const, title: "I will upload photos", body: "Create the draft with upload placeholders for the first gallery." }
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setPhotoMode(item.key)}
                          className={`relative border-2 p-6 text-left transition ${
                            photoMode === item.key ? "border-primary bg-[#101418] text-white shadow-[0_18px_45px_rgba(16,20,24,0.16)]" : "border-[#d7dedb] bg-[#ffffff] hover:border-[#101418]"
                          }`}
                        >
                          {photoMode === item.key ? (
                            <span className="absolute right-4 top-4 inline-flex items-center gap-2 bg-primary-light px-2.5 py-1 font-nav text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#101418]">
                              <CheckCircle2 className="size-3.5" aria-hidden="true" />
                              Selected
                            </span>
                          ) : null}
                          <ImagePlus className={photoMode === item.key ? "size-6 text-primary-light" : "size-6 text-primary"} />
                          <h2 className="mt-10 font-display text-4xl font-light tracking-[-0.05em]">{item.title}</h2>
                          <p className={photoMode === item.key ? "mt-3 text-sm leading-6 text-white/68" : "mt-3 text-sm leading-6 text-[#59636b]"}>{item.body}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div>
                    <SectionHeading eyebrow="Step 5" title="Create your account." body="This saves the draft and prepares the customer dashboard. Real auth can be wired after the flow is approved." />
                    <div id="account-errors" className="mt-8 grid max-w-2xl gap-4">
                      <Label className="block">
                        <span className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary">Studio name</span>
                        <span className="mt-2 flex h-14 items-center border border-[#d7dedb] bg-white px-4">
                          <UserRound className="mr-3 size-5 text-primary" />
                          <Input value={studioName} onChange={(event) => setStudioName(event.target.value)} className="h-full flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" />
                        </span>
                      </Label>
                      <Label className="block">
                        <span className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary">Email</span>
                        <span className="mt-2 flex h-14 items-center border border-[#d7dedb] bg-white px-4">
                          <Mail className="mr-3 size-5 text-primary" />
                          <Input value={email} onChange={(event) => setEmail(event.target.value)} className="h-full flex-1 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" placeholder="you@example.com" />
                        </span>
                      </Label>
                      <ValidationMessages messages={stepErrors} />
                    </div>
                  </div>
                ) : null}

                {step === 5 ? (
                  <div>
                    <SectionHeading eyebrow="Step 6" title="Ready to publish." body="This is the final confirmation screen. Later this will create the tenant, theme settings, storage records, and domain record in the database." />
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <SummaryCard label="Theme" value={selectedThemeName} />
                      <SummaryCard label="Primary category" value={selectedTypeName} />
                      <SummaryCard label="Categories" value={categories.length ? categories.map((category) => category.name).join(", ") : "Not selected"} />
                      <SummaryCard label="Public address" value={publicUrl} />
                    </div>
                    <ValidationMessages messages={[...stepErrors, ...(publishError ? [publishError] : [])]} />
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button type="button" size="lg" disabled={!canPublish || isPublishing} onClick={publishDraft} className="rounded-none bg-[#101418] px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-primary/90 disabled:opacity-50">
                          {isPublishing ? "Publishing" : "Publish preview"}
                          <RadioTower className="size-4" aria-hidden="true" />
                      </Button>
                      <Button asChild size="lg" variant="outline" className="rounded-none border-[#101418] bg-white px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em]">
                        <Link href={selectedThemeDemoPath} target="_blank" rel="noreferrer">View theme demo</Link>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between border-t border-[#d7dedb] p-6 md:p-8">
                <Button type="button" variant="outline" onClick={previousStep} disabled={step === 0} className="rounded-none border-[#d7dedb] bg-white font-nav text-xs font-semibold uppercase tracking-[0.18em]">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep} disabled={!canContinue} className="rounded-none bg-[#101418] font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-primary/90">
                    Continue
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button type="button" disabled={!canPublish || isPublishing} onClick={publishDraft} className="rounded-none bg-[#101418] font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-primary/90 disabled:opacity-50">
                    {isPublishing ? "Publishing" : "Publish"}
                    <RadioTower className="size-4" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </section>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden border border-[#d7dedb] bg-[#101418] text-white shadow-[0_20px_70px_rgba(16,20,24,0.16)]">
                <div className="grid grid-cols-3 gap-1 p-3">
                  {previewImages.map((image) => (
                    <div key={image} className="relative aspect-[4/5] overflow-hidden bg-white/10">
                      <Image src={image} alt="Portfolio preview" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/12 p-6">
                  <p className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary-light">Draft website</p>
                  <h2 className="mt-4 font-display text-4xl font-light leading-none tracking-[-0.05em]">{studioName || "Your Studio"}</h2>
                  <dl className="mt-6 space-y-4 text-sm">
                    <SummaryRow label="Theme" value={selectedThemeName} />
                    <SummaryRow label="Primary" value={selectedTypeName} />
                    <SummaryRow label="Categories" value={categories.length ? categories.map((category) => category.name).join(", ") : "Not selected"} />
                    <SummaryRow label="Address" value={publicUrl} />
                    <SummaryRow label="Photos" value={photoMode === "sample" ? "Sample starter set" : photoMode === "upload" ? "Upload placeholders" : "Not selected"} />
                  </dl>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="pf-fluid-title-page mt-3 font-display font-light leading-none tracking-[-0.055em]">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#59636b]">{body}</p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="border border-[#d7dedb] bg-[#ffffff] p-5">
      <p className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary">{label}</p>
      <p className="mt-8 text-lg font-semibold">{value}</p>
    </article>
  );
}

function ValidationMessages({ messages }: { messages: string[] }) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border border-[#c46a4a] bg-[#fff7f2] p-4 text-sm leading-6 text-[#8a2f18]">
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
      <dt className="text-white/48">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
