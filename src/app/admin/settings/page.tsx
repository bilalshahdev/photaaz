import { ImageIcon, Settings } from "lucide-react";
import { AdminPage, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { savePlatformAppConfig } from "@/app/admin/actions";
import { getPlatformAppConfig } from "@/services/admin/admin-data";

export default async function AdminSettingsPage() {
  const config = await getPlatformAppConfig();

  return (
    <AdminPage>
        <AdminPageHeader eyebrow="App Config" title="Manage platform details." body="Control global support contacts, footer copy, company address, and dashboard notices." />
        <AdminPanel title="Platform Configuration" icon={Settings}>
          <form
            action={async (formData) => {
              "use server";
              await savePlatformAppConfig({
                brandName: String(formData.get("brandName")),
                signatureColor: String(formData.get("signatureColor")),
                faviconUrl: String(formData.get("faviconUrl")),
                appleTouchIconUrl: String(formData.get("appleTouchIconUrl")),
                socialPreviewImageUrl: String(formData.get("socialPreviewImageUrl")),
                seoKeywords: config.seoKeywords,
                supportEmail: String(formData.get("supportEmail")),
                salesEmail: String(formData.get("salesEmail")),
                footerText: String(formData.get("footerText")),
                copyrightText: String(formData.get("copyrightText")),
                companyAddress: String(formData.get("companyAddress")),
                dashboardNotice: String(formData.get("dashboardNotice") ?? ""),
                themeSwitchCooldownDays: Number(formData.get("themeSwitchCooldownDays") ?? config.themeSwitchCooldownDays),
                media: {
                  maxImageUploadMb: Number(formData.get("maxImageUploadMb") ?? config.media.maxImageUploadMb),
                  platformBranding: {
                    enabled: formData.get("platformBrandingEnabled") === "on",
                    text: String(formData.get("platformBrandingText") ?? config.media.platformBranding.text),
                    position: parseBrandingPosition(formData.get("platformBrandingPosition"), config.media.platformBranding.position),
                    size: parseBrandingSize(formData.get("platformBrandingSize"), config.media.platformBranding.size),
                    opacity: Number(formData.get("platformBrandingOpacity") ?? config.media.platformBranding.opacity),
                    textColor: String(formData.get("platformBrandingTextColor") ?? config.media.platformBranding.textColor),
                    backgroundColor: String(formData.get("platformBrandingBackgroundColor") ?? config.media.platformBranding.backgroundColor),
                    backgroundOpacity: Number(formData.get("platformBrandingBackgroundOpacity") ?? config.media.platformBranding.backgroundOpacity),
                    borderColor: String(formData.get("platformBrandingBorderColor") ?? config.media.platformBranding.borderColor),
                    borderOpacity: Number(formData.get("platformBrandingBorderOpacity") ?? config.media.platformBranding.borderOpacity)
                  }
                },
                phone: {
                  label: String(formData.get("phoneLabel") ?? "Phone"),
                  value: String(formData.get("phoneValue") ?? ""),
                  enabled: formData.get("phoneEnabled") === "on"
                },
                creatorLink: {
                  label: String(formData.get("creatorLabel") ?? "Creator"),
                  href: String(formData.get("creatorHref") ?? ""),
                  enabled: formData.get("creatorEnabled") === "on"
                },
                socialLinks: {
                  instagram: {
                    label: String(formData.get("instagramLabel") ?? "Instagram"),
                    href: String(formData.get("instagramHref") ?? ""),
                    enabled: formData.get("instagramEnabled") === "on"
                  },
                  facebook: {
                    label: String(formData.get("facebookLabel") ?? "Facebook"),
                    href: String(formData.get("facebookHref") ?? ""),
                    enabled: formData.get("facebookEnabled") === "on"
                  },
                  youtube: {
                    label: String(formData.get("youtubeLabel") ?? "YouTube"),
                    href: String(formData.get("youtubeHref") ?? ""),
                    enabled: formData.get("youtubeEnabled") === "on"
                  },
                  linkedin: {
                    label: String(formData.get("linkedinLabel") ?? "LinkedIn"),
                    href: String(formData.get("linkedinHref") ?? ""),
                    enabled: formData.get("linkedinEnabled") === "on"
                  },
                  snapchat: {
                    label: String(formData.get("snapchatLabel") ?? "Snapchat"),
                    href: String(formData.get("snapchatHref") ?? ""),
                    enabled: formData.get("snapchatEnabled") === "on"
                  }
                }
              });
            }}
            className="grid gap-4 lg:grid-cols-2"
          >
            <input type="hidden" name="signatureColor" value={config.signatureColor} />
            <input type="hidden" name="faviconUrl" value={config.faviconUrl} />
            <input type="hidden" name="appleTouchIconUrl" value={config.appleTouchIconUrl} />
            <input type="hidden" name="socialPreviewImageUrl" value={config.socialPreviewImageUrl} />
            <TextField name="brandName" label="Brand name" defaultValue={config.brandName} className="h-11" shellClassName="lg:col-span-2" />
            <TextField name="supportEmail" label="Support email" type="email" defaultValue={config.supportEmail} className="h-11" />
            <TextField name="salesEmail" label="Sales email" type="email" defaultValue={config.salesEmail} className="h-11" />
            <TextareaField name="footerText" label="Footer text" defaultValue={config.footerText} className="min-h-24 resize-y" shellClassName="lg:col-span-2" />
            <TextField name="copyrightText" label="Copyright line" defaultValue={config.copyrightText} placeholder="Copyright (c) {year} Photaaz. All rights reserved." description={'Use "{year}" where the current year should appear.'} className="h-11" shellClassName="lg:col-span-2" />
            <TextField name="companyAddress" label="Company address" defaultValue={config.companyAddress} className="h-11" />
            <TextField name="dashboardNotice" label="Dashboard notice" defaultValue={config.dashboardNotice} className="h-11" />
            <TextField
              name="themeSwitchCooldownDays"
              label="Theme switch cooldown"
              type="number"
              min={0}
              max={365}
              defaultValue={String(config.themeSwitchCooldownDays)}
              description="Days a client must wait before applying another theme. Use 0 to allow switching anytime."
              className="h-11"
            />
            <div className="space-y-4 border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="size-5 text-teal-700" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-900">Uploads and image branding</p>
                  <p className="mt-1 text-sm text-slate-500">Controls tenant upload size and the small Photaaz mark shown on Free and Plus portfolio photos.</p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-4">
                <TextField name="maxImageUploadMb" label="Max image upload size" type="number" min={1} max={50} defaultValue={String(config.media.maxImageUploadMb)} description="Fallback is 8MB when this is not configured." className="h-11 bg-white" />
                <TextField name="platformBrandingText" label="Platform image mark" defaultValue={config.media.platformBranding.text} className="h-11 bg-white" />
                <SelectField
                  name="platformBrandingPosition"
                  label="Mark position"
                  defaultValue={config.media.platformBranding.position}
                  triggerClassName="h-11 bg-white"
                  options={[
                    { value: "bottom-left", label: "Bottom left" },
                    { value: "bottom-center", label: "Bottom center" },
                    { value: "bottom-right", label: "Bottom right" },
                    { value: "center", label: "Center" }
                  ]}
                />
                <SelectField
                  name="platformBrandingSize"
                  label="Mark size"
                  defaultValue={config.media.platformBranding.size}
                  triggerClassName="h-11 bg-white"
                  options={[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" }
                  ]}
                />
                <TextField name="platformBrandingOpacity" label="Mark opacity" type="number" min={0.1} max={1} step={0.05} defaultValue={String(config.media.platformBranding.opacity)} className="h-11 bg-white" />
                <TextField name="platformBrandingTextColor" label="Text color" type="color" defaultValue={config.media.platformBranding.textColor} className="h-11 bg-white" />
                <TextField name="platformBrandingBackgroundColor" label="Background color" type="color" defaultValue={config.media.platformBranding.backgroundColor} className="h-11 bg-white" />
                <TextField name="platformBrandingBackgroundOpacity" label="Background opacity" type="number" min={0} max={1} step={0.05} defaultValue={String(config.media.platformBranding.backgroundOpacity)} className="h-11 bg-white" />
                <TextField name="platformBrandingBorderColor" label="Border color" type="color" defaultValue={config.media.platformBranding.borderColor} className="h-11 bg-white" />
                <TextField name="platformBrandingBorderOpacity" label="Border opacity" type="number" min={0} max={1} step={0.05} defaultValue={String(config.media.platformBranding.borderOpacity)} className="h-11 bg-white" />
              </div>
              <CheckboxField name="platformBrandingEnabled" defaultChecked={config.media.platformBranding.enabled} label="Show platform branding on Free and Plus images" wrapperClassName="bg-white" controlPosition="right" />
            </div>
            <div className="grid gap-4 border border-slate-200 p-4 lg:col-span-2 lg:grid-cols-[0.35fr_0.65fr]">
              <CheckboxField name="phoneEnabled" defaultChecked={config.phone.enabled} label="Enable phone" wrapperClassName="border-0 p-0" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="phoneLabel" defaultValue={config.phone.label} placeholder="Phone label" className="h-11" />
                <Input name="phoneValue" defaultValue={config.phone.value} placeholder="+92..." className="h-11" />
              </div>
            </div>
            <div className="grid gap-4 border border-slate-200 p-4 lg:col-span-2 lg:grid-cols-[0.35fr_0.65fr]">
              <CheckboxField name="creatorEnabled" defaultChecked={config.creatorLink.enabled} label="Enable creator link" wrapperClassName="border-0 p-0" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="creatorLabel" defaultValue={config.creatorLink.label} placeholder="Built by..." className="h-11" />
                <Input name="creatorHref" type="url" defaultValue={config.creatorLink.href} placeholder="https://..." className="h-11" />
              </div>
            </div>
            <div className="space-y-3 border border-slate-200 p-4 lg:col-span-2">
              <div>
                <p className="font-semibold text-slate-900">Footer social links</p>
                <p className="mt-1 text-sm text-slate-500">Only enabled links with URLs will be shown on the public footer.</p>
              </div>
              <SocialFields name="instagram" label="Instagram" link={config.socialLinks.instagram} />
              <SocialFields name="facebook" label="Facebook" link={config.socialLinks.facebook} />
              <SocialFields name="youtube" label="YouTube" link={config.socialLinks.youtube} />
              <SocialFields name="linkedin" label="LinkedIn" link={config.socialLinks.linkedin} />
              <SocialFields name="snapchat" label="Snapchat" link={config.socialLinks.snapchat} />
            </div>
            <Button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800 lg:col-span-2">Save config</Button>
          </form>
        </AdminPanel>
    </AdminPage>
  );
}

function parseBrandingPosition(value: FormDataEntryValue | null, fallback: "bottom-left" | "bottom-center" | "bottom-right" | "center") {
  const allowed = ["bottom-left", "bottom-center", "bottom-right", "center"] as const;
  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : fallback;
}

function parseBrandingSize(value: FormDataEntryValue | null, fallback: "small" | "medium" | "large") {
  const allowed = ["small", "medium", "large"] as const;
  return allowed.includes(value as (typeof allowed)[number]) ? (value as (typeof allowed)[number]) : fallback;
}

function SocialFields({ name, label, link }: { name: string; label: string; link: { label: string; href: string; enabled: boolean } }) {
  return (
    <div className="grid gap-3 border border-slate-100 bg-slate-50 p-3 md:grid-cols-[0.22fr_0.28fr_0.5fr]">
      <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Checkbox name={`${name}Enabled`} defaultChecked={link.enabled} />
        {label}
      </Label>
      <Input name={`${name}Label`} defaultValue={link.label} placeholder={`${label} label`} className="h-10 bg-white text-sm" />
      <Input name={`${name}Href`} type="url" defaultValue={link.href} placeholder="https://..." className="h-10 bg-white text-sm" />
    </div>
  );
}
