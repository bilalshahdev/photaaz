import { Settings } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { savePlatformAppConfig } from "@/app/admin/actions";
import { getPlatformAppConfig } from "@/services/admin/admin-data";

export default async function AdminSettingsPage() {
  const config = await getPlatformAppConfig();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="App Config" title="Manage platform details." body="Control global support contacts, footer copy, company address, and dashboard notices." />
        <AdminPanel title="Platform Configuration" icon={Settings}>
          <form
            action={async (formData) => {
              "use server";
              await savePlatformAppConfig({
                supportEmail: String(formData.get("supportEmail")),
                salesEmail: String(formData.get("salesEmail")),
                footerText: String(formData.get("footerText")),
                copyrightText: String(formData.get("copyrightText")),
                companyAddress: String(formData.get("companyAddress")),
                dashboardNotice: String(formData.get("dashboardNotice") ?? ""),
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
            <label className="text-sm font-medium text-slate-700">
              Support email
              <input name="supportEmail" type="email" defaultValue={config.supportEmail} className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Sales email
              <input name="salesEmail" type="email" defaultValue={config.salesEmail} className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
            </label>
            <label className="text-sm font-medium text-slate-700 lg:col-span-2">
              Footer text
              <textarea name="footerText" defaultValue={config.footerText} className="mt-2 min-h-24 w-full resize-y border border-slate-200 px-3 py-2 outline-none focus:border-teal-700" />
            </label>
            <label className="text-sm font-medium text-slate-700 lg:col-span-2">
              Copyright line
              <input name="copyrightText" defaultValue={config.copyrightText} placeholder="Copyright (c) {year} PhotoFolio. All rights reserved." className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
              <span className="mt-1 block text-xs font-normal text-slate-500">Use {"{year}"} where the current year should appear.</span>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Company address
              <input name="companyAddress" defaultValue={config.companyAddress} className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Dashboard notice
              <input name="dashboardNotice" defaultValue={config.dashboardNotice} className="mt-2 h-11 w-full border border-slate-200 px-3 outline-none focus:border-teal-700" />
            </label>
            <div className="grid gap-4 border border-slate-200 p-4 lg:col-span-2 lg:grid-cols-[0.35fr_0.65fr]">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input name="phoneEnabled" type="checkbox" defaultChecked={config.phone.enabled} />
                Enable phone
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="phoneLabel" defaultValue={config.phone.label} placeholder="Phone label" className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
                <input name="phoneValue" defaultValue={config.phone.value} placeholder="+92..." className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
              </div>
            </div>
            <div className="grid gap-4 border border-slate-200 p-4 lg:col-span-2 lg:grid-cols-[0.35fr_0.65fr]">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input name="creatorEnabled" type="checkbox" defaultChecked={config.creatorLink.enabled} />
                Enable creator link
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="creatorLabel" defaultValue={config.creatorLink.label} placeholder="Built by..." className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
                <input name="creatorHref" type="url" defaultValue={config.creatorLink.href} placeholder="https://..." className="h-11 border border-slate-200 px-3 outline-none focus:border-teal-700" />
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
            <button type="submit" className="h-11 bg-slate-950 px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white lg:col-span-2">Save config</button>
          </form>
        </AdminPanel>
      </div>
    </main>
  );
}

function SocialFields({ name, label, link }: { name: string; label: string; link: { label: string; href: string; enabled: boolean } }) {
  return (
    <div className="grid gap-3 border border-slate-100 bg-slate-50 p-3 md:grid-cols-[0.22fr_0.28fr_0.5fr]">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input name={`${name}Enabled`} type="checkbox" defaultChecked={link.enabled} />
        {label}
      </label>
      <input name={`${name}Label`} defaultValue={link.label} placeholder={`${label} label`} className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-700" />
      <input name={`${name}Href`} type="url" defaultValue={link.href} placeholder="https://..." className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-700" />
    </div>
  );
}
