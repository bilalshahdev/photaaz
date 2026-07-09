"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageIcon, Languages, Loader2, Save, Settings, Type, Mail, Globe } from "lucide-react";
import { toast } from "sonner";
import { savePlatformAppConfigWithFeedback, type AdminAppConfigActionState } from "@/app/admin/actions";
import { useAdminLocale } from "@/components/admin/admin-locale-context";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, TextField } from "@/components/forms/form-controls";
import type { AdminLocaleOption } from "@/components/admin/localized-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { brandFontKeys, brandFontLabels, brandFontSizeKeys, brandFontSizeLabels, brandFontVarMap } from "@/lib/brand-fonts";
import type { LocalizedString } from "@/services/platform/platform-data";
import type { PlatformAppConfig } from "@/services/admin/admin-data";

const initialState: AdminAppConfigActionState = { status: "idle", message: "" };

const fontOptions = brandFontKeys.map((k) => ({ value: k, label: brandFontLabels[k] }));

export function AdminAppConfigForm({ config, locales }: { config: PlatformAppConfig; locales: AdminLocaleOption[] }) {
  const [state, formAction] = useActionState(savePlatformAppConfigWithFeedback, initialState);

  const [brandFont, setBrandFont] = useState(config.brandFont ?? "inter");
  const [markFont, setMarkFont] = useState(config.media.platformBranding.font ?? "inter");
  const [signatureColor, setSignatureColor] = useState(config.signatureColor ?? "#0f766e");
  const [brandFontSizeIdx, setBrandFontSizeIdx] = useState(
    Math.max(0, brandFontSizeKeys.indexOf(config.brandFontSize as (typeof brandFontSizeKeys)[number] ?? "md"))
  );
  const adminLocale = useAdminLocale();
  const contentLocale = adminLocale?.activeLocale ?? "en";
  const [footerText, setFooterText] = useState<Record<string, string>>(() => normalizeLocalized(config.footerText, locales));
  const [copyrightText, setCopyrightText] = useState<Record<string, string>>(() => normalizeLocalized(config.copyrightText, locales));
  const [dashboardNotice, setDashboardNotice] = useState<Record<string, string>>(() => normalizeLocalized(config.dashboardNotice, locales));

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  const brandFontSizeKey = brandFontSizeKeys[brandFontSizeIdx];
  const activeDir = locales.find((l) => l.code === contentLocale)?.direction ?? "ltr";

  return (
    <AdminPanel title="Platform Configuration" icon={Settings}>
      <form action={formAction} className="space-y-6">
        {/* Controlled hidden passthrough fields */}
        <input type="hidden" name="brandFont" value={brandFont} />
        <input type="hidden" name="platformBrandingFont" value={markFont} />
        <input type="hidden" name="brandFontSize" value={brandFontSizeKey} />
        <input type="hidden" name="signatureColor" value={signatureColor} />
        <input type="hidden" name="faviconUrl" value={config.faviconUrl} />
        <input type="hidden" name="appleTouchIconUrl" value={config.appleTouchIconUrl} />
        <input type="hidden" name="socialPreviewImageUrl" value={config.socialPreviewImageUrl} />
        <input type="hidden" name="seoKeywords" value={JSON.stringify(config.seoKeywords)} />
        <input type="hidden" name="footerText" value={JSON.stringify(footerText)} />
        <input type="hidden" name="copyrightText" value={JSON.stringify(copyrightText)} />
        <input type="hidden" name="dashboardNotice" value={JSON.stringify(dashboardNotice)} />

        {/* ── Brand Identity ── */}
        <Section icon={Type} title="Brand Identity" description="Platform name, font, and accent color shown across the app and landing pages.">
          <div className="grid gap-5 lg:grid-cols-2">
            <TextField name="brandName" label="Brand name" defaultValue={config.brandName} placeholder="Your brand name" className="h-11" shellClassName="lg:col-span-2" />

            <div className="grid gap-2 lg:col-span-2">
              <Label className="text-sm font-semibold text-foreground">Brand font</Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {fontOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBrandFont(opt.value as typeof brandFont)}
                    className={cn(
                      "flex h-14 flex-col items-start justify-end rounded-md border px-3 pb-2 pt-1 text-left transition-all",
                      brandFont === opt.value
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <span className="truncate text-lg leading-none" style={{ fontFamily: brandFontVarMap[opt.value as typeof brandFont] }}>Aa</span>
                    <span className="mt-1 truncate text-[10px] font-medium text-slate-500">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground">Brand font size</Label>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">{brandFontSizeLabels[brandFontSizeKey]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={brandFontSizeKeys.length - 1}
                value={brandFontSizeIdx}
                onChange={(e) => setBrandFontSizeIdx(Number(e.target.value))}
                className="h-2 w-full cursor-pointer"
                style={{ accentColor: "hsl(var(--primary))" }}
              />
              <div className="flex justify-between">
                {brandFontSizeKeys.map((k) => (
                  <span key={k} className="text-[10px] text-slate-400">{brandFontSizeLabels[k]}</span>
                ))}
              </div>
            </div>

            <ColorField
              name=""
              label="Signature / accent color"
              value={signatureColor}
              onChange={setSignatureColor}
              description="Used on landing pages, admin UI, and the web app manifest."
            />
          </div>
        </Section>

        {/* ── Contact & Support ── */}
        <Section icon={Mail} title="Contact & Support" description="Shown in emails and the public footer.">
          <div className="grid gap-5 lg:grid-cols-2">
            <TextField name="supportEmail" label="Support email" type="email" defaultValue={config.supportEmail} placeholder="support@example.com" className="h-11" />
            <TextField name="salesEmail" label="Sales email" type="email" defaultValue={config.salesEmail} placeholder="sales@example.com" className="h-11" />
            <TextField name="companyAddress" label="Company address" defaultValue={config.companyAddress} placeholder="City, Country" className="h-11" />
            <TextField
              name="themeSwitchCooldownDays"
              label="Theme switch cooldown (days)"
              type="number"
              min={0}
              max={365}
              defaultValue={String(config.themeSwitchCooldownDays)}
              description="Days a client must wait before switching theme. 0 = no limit."
              className="h-11"
            />
          </div>
        </Section>

        {/* ── Translatable Content ── */}
        <Section icon={Languages} title="Translatable Content" description="Footer copy, copyright, and notices. Use the language selector in the top bar to switch.">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-foreground">Dashboard notice</Label>
              <Input
                dir={activeDir}
                value={dashboardNotice[contentLocale] ?? ""}
                placeholder="Optional notice shown on client dashboards"
                onChange={(e) => setDashboardNotice((prev) => ({ ...prev, [contentLocale]: e.target.value }))}
                className="h-11"
              />
              <FieldTranslationHint enValue={dashboardNotice.en ?? ""} locale={contentLocale} currentValue={dashboardNotice[contentLocale] ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-foreground">Copyright line</Label>
              <Input
                dir={activeDir}
                value={copyrightText[contentLocale] ?? ""}
                placeholder="Copyright (c) {year} Photaaz. All rights reserved."
                onChange={(e) => setCopyrightText((prev) => ({ ...prev, [contentLocale]: e.target.value }))}
                className="h-11"
              />
              <FieldTranslationHint enValue={copyrightText.en ?? ""} locale={contentLocale} currentValue={copyrightText[contentLocale] ?? ""} />
              <p className="text-xs leading-5 text-muted-foreground">Use &quot;&#123;year&#125;&quot; where the current year should appear.</p>
            </div>
            <div className="grid gap-2 lg:col-span-2">
              <Label className="text-sm font-semibold text-foreground">Footer text</Label>
              <Textarea
                dir={activeDir}
                value={footerText[contentLocale] ?? ""}
                placeholder="A short description shown in the public footer"
                onChange={(e) => setFooterText((prev) => ({ ...prev, [contentLocale]: e.target.value }))}
                className="min-h-24 resize-y"
              />
              <FieldTranslationHint enValue={footerText.en ?? ""} locale={contentLocale} currentValue={footerText[contentLocale] ?? ""} />
            </div>
          </div>
        </Section>

        {/* ── Image Branding ── */}
        <Section icon={ImageIcon} title="Uploads & Image Branding" description="Controls upload limits and the platform mark shown on Free and Plus portfolio photos.">
          <div className="grid gap-5 lg:grid-cols-4">
            <TextField name="maxImageUploadMb" label="Max upload (MB)" type="number" min={1} max={50} defaultValue={String(config.media.maxImageUploadMb)} description="Fallback is 8 MB." className="h-11" />
            <TextField name="platformBrandingText" label="Mark text" defaultValue={config.media.platformBranding.text} placeholder="Photaaz" className="h-11" />

            <div className="grid gap-2 lg:col-span-2">
              <Label className="text-sm font-semibold text-foreground">Mark font</Label>
              <div className="flex flex-wrap gap-1.5">
                {fontOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMarkFont(opt.value as typeof markFont)}
                    className={cn(
                      "rounded border px-2.5 py-1 text-xs transition-all",
                      markFont === opt.value
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    )}
                    style={{ fontFamily: brandFontVarMap[opt.value as typeof markFont] }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <ShadcnSelect
              name="platformBrandingPosition"
              label="Position"
              defaultValue={config.media.platformBranding.position}
              options={[
                { value: "bottom-left", label: "Bottom left" },
                { value: "bottom-center", label: "Bottom center" },
                { value: "bottom-right", label: "Bottom right" },
                { value: "center", label: "Center" },
              ]}
            />
            <ShadcnSelect
              name="platformBrandingSize"
              label="Mark size"
              defaultValue={config.media.platformBranding.size}
              options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
            />
            <ColorField name="platformBrandingTextColor" label="Text color" defaultValue={config.media.platformBranding.textColor} />
            <ColorField name="platformBrandingBackgroundColor" label="Background color" defaultValue={config.media.platformBranding.backgroundColor} />
            <ColorField name="platformBrandingBorderColor" label="Border color" defaultValue={config.media.platformBranding.borderColor} />
            <SliderField name="platformBrandingOpacity" label="Mark opacity" defaultValue={config.media.platformBranding.opacity} min={0.1} max={1} step={0.05} />
            <SliderField name="platformBrandingBackgroundOpacity" label="Background opacity" defaultValue={config.media.platformBranding.backgroundOpacity} min={0} max={1} step={0.05} />
            <SliderField name="platformBrandingBorderOpacity" label="Border opacity" defaultValue={config.media.platformBranding.borderOpacity} min={0} max={1} step={0.05} />
          </div>
          <CheckboxField name="platformBrandingEnabled" defaultChecked={config.media.platformBranding.enabled} label="Show platform branding on Free and Plus images" wrapperClassName="mt-4 bg-white" controlPosition="right" />
        </Section>

        {/* ── Phone ── */}
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.35fr_0.65fr]">
          <CheckboxField name="phoneEnabled" defaultChecked={config.phone.enabled} label="Enable phone" wrapperClassName="border-0 p-0" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input name="phoneLabel" defaultValue={config.phone.label} placeholder="Phone label" className="h-11" />
            <Input name="phoneValue" defaultValue={config.phone.value} placeholder="+92..." className="h-11" />
          </div>
        </div>

        {/* ── Creator link ── */}
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.35fr_0.65fr]">
          <CheckboxField name="creatorEnabled" defaultChecked={config.creatorLink.enabled} label="Enable creator link" wrapperClassName="border-0 p-0" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input name="creatorLabel" defaultValue={config.creatorLink.label} placeholder="Built by..." className="h-11" />
            <Input name="creatorHref" type="url" defaultValue={config.creatorLink.href} placeholder="https://..." className="h-11" />
          </div>
        </div>

        {/* ── Social links ── */}
        <Section icon={Globe} title="Footer Social Links" description="Only enabled links with URLs will appear on the public footer.">
          <div className="space-y-3">
            <SocialFields name="instagram" label="Instagram" link={config.socialLinks.instagram} />
            <SocialFields name="facebook" label="Facebook" link={config.socialLinks.facebook} />
            <SocialFields name="youtube" label="YouTube" link={config.socialLinks.youtube} />
            <SocialFields name="linkedin" label="LinkedIn" link={config.socialLinks.linkedin} />
            <SocialFields name="snapchat" label="Snapchat" link={config.socialLinks.snapchat} />
          </div>
        </Section>

        {/* ── Floating save button ── */}
        <div className="sticky bottom-4 z-20 flex items-center justify-end">
          <SaveButton />
        </div>
      </form>
    </AdminPanel>
  );
}

/* ─── Helpers ─── */

function FieldTranslationHint({ enValue, locale, currentValue }: { enValue: string; locale: string; currentValue: string }) {
  if (locale === "en" || currentValue.trim() || !enValue.trim()) return null;
  return (
    <div className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <Globe className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
      <span>
        <span className="font-semibold">No {locale.toUpperCase()} translation.</span>{" "}
        English: <span className="italic text-amber-600">&quot;{enValue.length > 80 ? `${enValue.slice(0, 80)}...` : enValue}&quot;</span>
      </span>
    </div>
  );
}

function normalizeLocalized(value: LocalizedString, locales: AdminLocaleOption[]): Record<string, string> {
  if (typeof value === "string") {
    return locales.reduce<Record<string, string>>((r, l) => { r[l.code] = l.code === "en" ? value : ""; return r; }, {});
  }
  return locales.reduce<Record<string, string>>((r, l) => { r[l.code] = value[l.code] ?? ""; return r; }, {});
}

/* ─── Shared sub-components ─── */

function Section({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Saving\u2026" : "Save config"}
    </Button>
  );
}

function ColorField({ name, label, defaultValue, value: controlledValue, onChange, description }: {
  name: string;
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  description?: string;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "#000000");
  const value = controlledValue ?? internalValue;
  const handleChange = (v: string) => { setInternalValue(v); onChange?.(v); };
  const inputId = useId();

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId} className="text-sm font-semibold text-foreground">{label}</Label>
      <div className="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
        <label className="relative shrink-0 cursor-pointer">
          <span className="block size-6 rounded border border-slate-200 shadow-sm transition hover:scale-110" style={{ backgroundColor: value }} />
          <input type="color" className="sr-only" value={value} onChange={(e) => handleChange(e.target.value)} />
        </label>
        <input
          id={inputId}
          type="text"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
          value={value}
          maxLength={7}
          placeholder="#000000"
          onChange={(e) => { const v = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) handleChange(v); }}
        />
      </div>
      {!controlledValue && <input type="hidden" name={name} value={value} />}
      {description && <p className="text-xs leading-5 text-muted-foreground">{description}</p>}
    </div>
  );
}

function SliderField({ name, label, defaultValue, min, max, step }: { name: string; label: string; defaultValue: number; min: number; max: number; step: number }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="h-2 w-full cursor-pointer"
        style={{ accentColor: "hsl(var(--primary))" }}
      />
    </div>
  );
}

function ShadcnSelect({ name, label, defaultValue, options }: { name: string; label: string; defaultValue: string; options: { value: string; label: string }[] }) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger className="h-11">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SocialFields({ name, label, link }: { name: string; label: string; link: { label: string; href: string; enabled: boolean } }) {
  return (
    <div className="grid gap-3 rounded-md border border-slate-100 bg-slate-50/60 p-3 md:grid-cols-[0.22fr_0.28fr_0.5fr]">
      <Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Checkbox name={`${name}Enabled`} defaultChecked={link.enabled} />
        {label}
      </Label>
      <Input name={`${name}Label`} defaultValue={link.label} placeholder={`${label} label`} className="h-10 bg-white text-sm" />
      <Input name={`${name}Href`} type="url" defaultValue={link.href} placeholder="https://..." className="h-10 bg-white text-sm" />
    </div>
  );
}
