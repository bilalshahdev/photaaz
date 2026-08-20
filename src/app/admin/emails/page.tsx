import { Mail, Send } from "lucide-react";
import { AdminPage, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/forms/form-controls";
import { saveEmailDeliverySettings } from "@/app/admin/actions";
import { getAdminEmailDeliverySettings, getAdminEmailSettings, getTranslationLocaleConfig } from "@/services/admin/admin-data";
import type { EmailDeliveryProvider, EmailEncryption } from "@/services/email/email-service";
import { EmailDeliveryButton } from "./email-form-button";
import { EmailSettingsEditor } from "./email-settings-editor";

export default async function AdminEmailsPage() {
  const [settings, delivery, locales] = await Promise.all([
    getAdminEmailSettings(),
    getAdminEmailDeliverySettings(),
    getTranslationLocaleConfig()
  ]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Email Config" title="Manage email delivery." body="Choose the delivery provider once, then keep subscription, account, and manual email categories controlled from one place." />
      <AdminPanel title="Delivery provider" icon={Send}>
        <form
          action={async (formData) => {
            "use server";
            await saveEmailDeliverySettings({
              enabled: formData.get("enabled") === "on",
              provider: getEmailProvider(formData.get("provider")),
              fromName: String(formData.get("fromName")),
              fromEmail: String(formData.get("fromEmail")),
              resendApiKey: String(formData.get("resendApiKey") ?? ""),
              smtpHost: String(formData.get("smtpHost") ?? ""),
              smtpPort: Number(formData.get("smtpPort") || 587),
              smtpUsername: String(formData.get("smtpUsername") ?? ""),
              smtpPassword: String(formData.get("smtpPassword") ?? ""),
              smtpEncryption: getEmailEncryption(formData.get("smtpEncryption"))
            });
          }}
          className="grid gap-5"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
            <CheckboxField
              name="enabled"
              defaultChecked={delivery.enabled}
              label="Enable email delivery"
              description="Keep this off locally until SMTP or Resend is configured."
              controlPosition="right"
            />
            <SelectField
              name="provider"
              label="Provider"
              defaultValue={delivery.provider}
              triggerClassName="h-11"
              options={[
                { label: "Disabled", value: "disabled" },
                { label: "Resend", value: "resend" },
                { label: "SMTP / domain email", value: "smtp" }
              ]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField name="fromName" label="From name" defaultValue={delivery.fromName} placeholder="Photaaz" />
            <TextField name="fromEmail" label="From email" type="email" defaultValue={delivery.fromEmail} placeholder="hello@photaaz.com" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <h3 className="font-semibold text-slate-950">Resend</h3>
                <p className="mt-1 text-sm text-slate-500">Use when you want a hosted transactional email API.</p>
              </div>
              <TextField
                name="resendApiKey"
                label="API key"
                type="password"
                placeholder={delivery.hasResendApiKey ? "Saved API key" : "re_..."}
                description="Leave blank to keep the saved or environment API key."
              />
            </section>

            <section className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <h3 className="font-semibold text-slate-950">SMTP</h3>
                <p className="mt-1 text-sm text-slate-500">Use your hosting or domain mailbox SMTP credentials.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px]">
                <TextField name="smtpHost" label="Host" defaultValue={delivery.smtpHost ?? ""} placeholder="smtp.yourdomain.com" />
                <TextField name="smtpPort" label="Port" type="number" defaultValue={String(delivery.smtpPort ?? 587)} placeholder="587" />
              </div>
              <SelectField
                name="smtpEncryption"
                label="Encryption"
                defaultValue={delivery.smtpEncryption}
                triggerClassName="h-11"
                options={[
                  { label: "STARTTLS", value: "starttls" },
                  { label: "SSL", value: "ssl" },
                  { label: "None", value: "none" }
                ]}
              />
              <TextField name="smtpUsername" label="Username" defaultValue={delivery.smtpUsername ?? ""} placeholder="mailbox@yourdomain.com" />
              <TextField
                name="smtpPassword"
                label="Password"
                type="password"
                placeholder={delivery.hasSmtpPassword ? "Saved password" : "Mailbox password"}
                description="Leave blank to keep the saved or environment password."
              />
            </section>
          </div>

          <div className="sticky bottom-4 z-20 flex justify-end">
            <EmailDeliveryButton />
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Email switches" icon={Mail} className="mt-6">
        <EmailSettingsEditor settings={settings} locales={enabledLocales} />
      </AdminPanel>
    </AdminPage>
  );
}

function getEmailProvider(value: FormDataEntryValue | null): EmailDeliveryProvider {
  return value === "resend" || value === "smtp" || value === "disabled" ? value : "disabled";
}

function getEmailEncryption(value: FormDataEntryValue | null): EmailEncryption {
  return value === "none" || value === "ssl" || value === "starttls" ? value : "starttls";
}
