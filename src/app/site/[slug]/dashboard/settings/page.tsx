import { notFound } from "next/navigation";
import {
  Eye,
  ImageIcon,
  Languages,
  LayoutGrid,
  Palette,
  Settings,
  ShieldCheck,
  Share2,
  Stamp,
  ToggleLeft,
  UserRound,
} from "lucide-react";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel,
} from "@/components/customer/customer-dashboard-ui";
import { CustomerFeaturedPhotosSettings } from "@/components/customer/customer-featured-photos-settings";
import { CustomerHomepageSectionsField } from "@/components/customer/customer-homepage-sections-field";
import { CustomerSettingsForm } from "@/components/customer/customer-settings-form";
import {
  CheckboxField,
  ImageDropField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/form-controls";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCustomerSettingsView } from "@/services/tenant/customer-dashboard-data";

type CustomerSettingsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerSettingsPage({
  params,
}: CustomerSettingsPageProps) {
  const { slug } = await params;
  const data = await getCustomerSettingsView(slug);

  if (!data) {
    notFound();
  }

  const footerLocked = ["basic", "free", "plus"].includes(data.planKey);

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Settings"
        title="Site settings."
        body="Core tenant settings for identity, locale, theme, and plan."
      />

      <section className="mt-5 grid gap-3 lg:grid-cols-2">
        <SettingCard icon={UserRound} label="Name" value={data.name} />
        <SettingCard icon={ShieldCheck} label="Status" value={data.status} />
        <SettingCard
          icon={Languages}
          label="Locale"
          value={data.defaultLocale.toUpperCase()}
        />
        <SettingCard icon={Palette} label="Theme" value={data.themeKey} />
      </section>

      <CustomerSettingsForm>
        <input type="hidden" name="tenantSlug" value={slug} />

        <CustomerPanel
          title="Homepage hero"
          icon={ImageIcon}
          className="order-1"
        >
          <p className="text-sm leading-6 text-slate-600">
            Control the first impression on the public portfolio homepage.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <TextField
              label="Hero title"
              name="heroTitle"
              defaultValue={data.site.heroTitle}
              placeholder="Bilal Photography"
            />
            <TextField
              label="Photography specialty"
              name="specialty"
              defaultValue={data.site.specialty}
              placeholder="Wedding, travel, or portrait photography"
            />
            <ImageDropField
              label={
                data.site.heroImageLimit === 1 ? "Hero image" : "Hero images"
              }
              name="heroImageFiles"
              currentImage={data.site.heroImage}
              currentImages={data.site.heroImages}
              currentValueName="currentHeroImage"
              currentImagesValueName="currentHeroImages"
              description={
                data.site.heroImageLimit === null
                  ? "Upload one or more hero images. Ownership plans have no package limit."
                  : `Your package allows ${data.site.heroImageLimit} hero image${data.site.heroImageLimit === 1 ? "" : "s"}.`
              }
              multiple={data.site.heroImageLimit !== 1}
              shellClassName="lg:col-span-2"
              uploadArea="others"
              uploadFolder="hero"
            />
            <TextareaField
              label="Tagline"
              name="tagline"
              defaultValue={data.site.tagline}
              placeholder="A short line that tells visitors what kind of work you create."
              shellClassName="lg:col-span-2"
            />
          </div>
        </CustomerPanel>

        <CustomerPanel
          title="Page header images"
          icon={ImageIcon}
          className="order-4"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm leading-6 text-slate-600">
              Set the cover image shown at the top of each public page.
            </p>
            {!data.site.canUsePageHeaderImages ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Page header images are available on Plus, Pro, and Ownership
                plans.
              </p>
            ) : null}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <PageHeaderImageField
              label="Gallery page"
              name="gallery"
              header={data.site.pageHeaders.gallery}
              disabled={!data.site.canUsePageHeaderImages}
            />
            <PageHeaderImageField
              label="Categories page"
              name="categories"
              header={data.site.pageHeaders.categories}
              disabled={!data.site.canUsePageHeaderImages}
            />
            <PageHeaderImageField
              label="Blog page"
              name="blog"
              header={data.site.pageHeaders.blog}
              disabled={!data.site.canUsePageHeaderImages}
            />
            <PageHeaderImageField
              label="About page"
              name="about"
              header={data.site.pageHeaders.about}
              disabled={!data.site.canUsePageHeaderImages}
            />
          </div>
        </CustomerPanel>

        <CustomerPanel title="Social links" icon={Share2} className="order-5">
          <p className="text-sm leading-6 text-slate-600">
            Add the public social profiles visitors can open from the portfolio
            footer.
          </p>
          <div className="mt-5 grid gap-3">
            <SocialLinkField
              name="instagram"
              label="Instagram"
              href={data.site.socialLinks.instagram.href}
              enabled={data.site.socialLinks.instagram.enabled}
            />
            <SocialLinkField
              name="facebook"
              label="Facebook"
              href={data.site.socialLinks.facebook.href}
              enabled={data.site.socialLinks.facebook.enabled}
            />
            <SocialLinkField
              name="youtube"
              label="YouTube"
              href={data.site.socialLinks.youtube.href}
              enabled={data.site.socialLinks.youtube.enabled}
            />
            <SocialLinkField
              name="linkedin"
              label="LinkedIn"
              href={data.site.socialLinks.linkedin.href}
              enabled={data.site.socialLinks.linkedin.enabled}
            />
            <SocialLinkField
              name="snapchat"
              label="Snapchat"
              href={data.site.socialLinks.snapchat.href}
              enabled={data.site.socialLinks.snapchat.enabled}
            />
            <SocialLinkField
              name="pinterest"
              label="Pinterest"
              href={data.site.socialLinks.pinterest.href}
              enabled={data.site.socialLinks.pinterest.enabled}
            />
            <SocialLinkField
              name="behance"
              label="Behance"
              href={data.site.socialLinks.behance.href}
              enabled={data.site.socialLinks.behance.enabled}
            />
            <SocialLinkField
              name="tiktok"
              label="TikTok"
              href={data.site.socialLinks.tiktok.href}
              enabled={data.site.socialLinks.tiktok.enabled}
            />
          </div>
        </CustomerPanel>

        <CustomerPanel title="Image watermark" icon={Stamp} className="order-6">
          <p className="text-sm leading-6 text-slate-600">
            Pro portfolios can place a small custom watermark over public
            photos. Free and Plus photos use the platform branding controlled by
            Photaaz.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            <CheckboxField
              name="watermarkEnabled"
              label="Enable custom watermark"
              defaultChecked={data.site.watermark.enabled}
              disabled={!data.site.canUseCustomWatermark}
              wrapperClassName="bg-slate-50 lg:col-span-4"
              controlPosition="right"
            />
            <TextField
              label="Watermark text"
              name="watermarkText"
              defaultValue={data.site.watermark.text}
              disabled={!data.site.canUseCustomWatermark}
            />
            <SelectField
              label="Position"
              name="watermarkPosition"
              defaultValue={data.site.watermark.position}
              disabled={!data.site.canUseCustomWatermark}
              options={[
                { value: "bottom-left", label: "Bottom left" },
                { value: "bottom-center", label: "Bottom center" },
                { value: "bottom-right", label: "Bottom right" },
                { value: "center", label: "Center" },
              ]}
            />
            <SelectField
              label="Size"
              name="watermarkSize"
              defaultValue={data.site.watermark.size}
              disabled={!data.site.canUseCustomWatermark}
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
            />
            <TextField
              label="Opacity"
              name="watermarkOpacity"
              type="number"
              min={0.1}
              max={1}
              step={0.05}
              defaultValue={String(data.site.watermark.opacity)}
              disabled={!data.site.canUseCustomWatermark}
            />
            <TextField
              label="Text color"
              name="watermarkTextColor"
              type="color"
              defaultValue={data.site.watermark.textColor}
              disabled={!data.site.canUseCustomWatermark}
            />
            <TextField
              label="Background color"
              name="watermarkBackgroundColor"
              type="color"
              defaultValue={data.site.watermark.backgroundColor}
              disabled={!data.site.canUseCustomWatermark}
            />
            <TextField
              label="Background opacity"
              name="watermarkBackgroundOpacity"
              type="number"
              min={0}
              max={1}
              step={0.05}
              defaultValue={String(data.site.watermark.backgroundOpacity)}
              disabled={!data.site.canUseCustomWatermark}
            />
            <TextField
              label="Border color"
              name="watermarkBorderColor"
              type="color"
              defaultValue={data.site.watermark.borderColor}
              disabled={!data.site.canUseCustomWatermark}
            />
            <TextField
              label="Border opacity"
              name="watermarkBorderOpacity"
              type="number"
              min={0}
              max={1}
              step={0.05}
              defaultValue={String(data.site.watermark.borderOpacity)}
              disabled={!data.site.canUseCustomWatermark}
            />
          </div>
        </CustomerPanel>

        <CustomerPanel
          title="Homepage sections"
          icon={ToggleLeft}
          className="order-2"
        >
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Enable the sections this client wants on their public homepage.
            </p>
            <a
              href={`/site/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
            >
              <Eye className="size-4" aria-hidden="true" />
              Preview
            </a>
          </div>
          <CustomerHomepageSectionsField
            sections={data.site.sectionOrder.map((key) => ({
              key,
              label:
                key === "featuredPhotos"
                  ? "Featured photos"
                  : key === "categories"
                    ? "Category showcase"
                    : key === "galleries"
                      ? "Gallery showcase"
                      : key === "contact"
                        ? "Contact section"
                        : key === "footer"
                          ? "Footer"
                          : "Hero",
              enabled:
                key === "footer" && footerLocked
                  ? true
                  : data.site.sections[key],
              locked: key === "footer" && footerLocked,
              lockedReason:
                key === "footer" && footerLocked
                  ? "Footer stays visible on Basic and Plus plans."
                  : undefined,
            }))}
          />
        </CustomerPanel>

        <CustomerPanel
          title="Homepage section text"
          icon={Settings}
          className="order-3"
        >
          <p className="text-sm leading-6 text-slate-600">
            Edit the headings and supporting copy used by theme homepage
            sections. Themes control presentation; these fields control the
            words.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <TextField
              label="Welcome heading"
              name="homepageWelcomeTitle"
              defaultValue={data.site.homepage.copy.welcomeTitle}
            />
            <TextField
              label="Featured photos heading"
              name="homepageFeaturedTitle"
              defaultValue={data.site.homepage.copy.featuredTitle}
            />
            <TextField
              label="Galleries heading"
              name="homepageGalleriesTitle"
              defaultValue={data.site.homepage.copy.galleriesTitle}
            />
            <TextField
              label="Contact heading"
              name="homepageContactTitle"
              defaultValue={data.site.homepage.copy.contactTitle}
            />
            <TextareaField
              label="Contact text"
              name="homepageContactBody"
              defaultValue={data.site.homepage.copy.contactBody}
            />
          </div>
        </CustomerPanel>

        <CustomerPanel
          title="Featured photos display"
          icon={LayoutGrid}
          className="order-4"
        >
          <CustomerFeaturedPhotosSettings
            settings={data.site.homepage.featuredPhotos}
            photos={data.site.photoOptions}
          />
        </CustomerPanel>
      </CustomerSettingsForm>
    </CustomerDashboardPage>
  );
}

function PageHeaderImageField({
  label,
  name,
  header,
  disabled,
}: {
  label: string;
  name: string;
  header: { image: string; title: string; description: string };
  disabled: boolean;
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <TextareaField
        label={`${label} subtitle`}
        name={`${name}HeaderDescription`}
        defaultValue={header.description}
        placeholder="Short text shown under the page heading."
        disabled={disabled}
        className="min-h-24 resize-y"
      />
      <ImageDropField
        label={`${label} image`}
        name={`${name}HeaderFile`}
        currentImage={header.image}
        currentValueName={`${name}HeaderImage`}
        disabled={disabled}
        uploadArea="others"
        uploadFolder="page-headers"
        uploadLabel={name}
        description={
          disabled
            ? "Upgrade the plan to use a custom page cover image and text."
            : "When no image is set, the page uses a solid theme-colored header."
        }
      />
    </div>
  );
}

function SettingCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Settings;
  label: string;
  value: string;
}) {
  return (
    <article className="flex min-h-24 items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-teal-100 bg-teal-50 text-teal-700">
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-nav text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <p
          className="mt-1 break-words font-display text-xl font-black leading-tight tracking-[-0.035em] text-slate-950"
          title={value}
        >
          {value}
        </p>
      </div>
    </article>
  );
}

function SocialLinkField({
  name,
  label,
  href,
  enabled,
}: {
  name: string;
  label: string;
  href: string;
  enabled: boolean;
}) {
  const inputId = `${name}-href`;
  const enabledId = `${name}-enabled`;

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[170px_minmax(0,1fr)_140px] sm:items-end">
      <div className="grid gap-2">
        <Label htmlFor={inputId} className="font-semibold text-slate-950">
          {label}
        </Label>
        <p className="text-xs text-slate-500">Public profile link</p>
      </div>
      <Input
        id={inputId}
        name={`${name}Href`}
        defaultValue={href}
        placeholder={`https://${name}.com/...`}
      />
      <Label
        htmlFor={enabledId}
        className="flex h-10 cursor-pointer items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-800"
      >
        <span>Enabled</span>
        <Checkbox
          id={enabledId}
          name={`${name}Enabled`}
          defaultChecked={enabled}
        />
      </Label>
    </div>
  );
}
