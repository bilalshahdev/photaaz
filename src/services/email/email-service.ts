import "server-only";

import nodemailer from "nodemailer";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";

export const emailDeliverySettingKey = "email.delivery";

export type EmailDeliveryProvider = "disabled" | "resend" | "smtp";
export type EmailEncryption = "none" | "starttls" | "ssl";

export type EmailDeliverySettings = {
  enabled: boolean;
  provider: EmailDeliveryProvider;
  fromName: string;
  fromEmail: string;
  resendApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpEncryption: EmailEncryption;
};

export type PublicEmailDeliverySettings = Omit<EmailDeliverySettings, "resendApiKey" | "smtpPassword"> & {
  hasResendApiKey: boolean;
  hasSmtpPassword: boolean;
};

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export const defaultEmailDeliverySettings: EmailDeliverySettings = {
  enabled: env.EMAIL_PROVIDER !== "disabled",
  provider: env.EMAIL_PROVIDER,
  fromName: env.EMAIL_FROM_NAME || "Photaaz",
  fromEmail: env.EMAIL_FROM_ADDRESS || "hello@example.com",
  resendApiKey: env.RESEND_API_KEY,
  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT || 587,
  smtpUsername: env.SMTP_USERNAME,
  smtpPassword: env.SMTP_PASSWORD,
  smtpEncryption: env.SMTP_ENCRYPTION
};

function isSettingsRecord(value: unknown): value is Partial<EmailDeliverySettings> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeProvider(value: unknown): EmailDeliveryProvider {
  return value === "resend" || value === "smtp" || value === "disabled" ? value : defaultEmailDeliverySettings.provider;
}

function normalizeEncryption(value: unknown): EmailEncryption {
  return value === "none" || value === "starttls" || value === "ssl" ? value : defaultEmailDeliverySettings.smtpEncryption;
}

export async function getEmailDeliverySettings(): Promise<EmailDeliverySettings> {
  const setting = await prisma.platformSetting.findUnique({
    where: { key: emailDeliverySettingKey }
  });
  const saved = isSettingsRecord(setting?.value) ? setting.value : {};

  return {
    ...defaultEmailDeliverySettings,
    ...saved,
    enabled: typeof saved.enabled === "boolean" ? saved.enabled : defaultEmailDeliverySettings.enabled,
    provider: normalizeProvider(saved.provider),
    fromName: saved.fromName?.trim() || defaultEmailDeliverySettings.fromName,
    fromEmail: saved.fromEmail?.trim() || defaultEmailDeliverySettings.fromEmail,
    resendApiKey: saved.resendApiKey?.trim() || defaultEmailDeliverySettings.resendApiKey,
    smtpHost: saved.smtpHost?.trim() || defaultEmailDeliverySettings.smtpHost,
    smtpPort: typeof saved.smtpPort === "number" ? saved.smtpPort : defaultEmailDeliverySettings.smtpPort,
    smtpUsername: saved.smtpUsername?.trim() || defaultEmailDeliverySettings.smtpUsername,
    smtpPassword: saved.smtpPassword?.trim() || defaultEmailDeliverySettings.smtpPassword,
    smtpEncryption: normalizeEncryption(saved.smtpEncryption)
  };
}

export async function getPublicEmailDeliverySettings(): Promise<PublicEmailDeliverySettings> {
  const settings = await getEmailDeliverySettings();

  return {
    enabled: settings.enabled,
    provider: settings.provider,
    fromName: settings.fromName,
    fromEmail: settings.fromEmail,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpUsername: settings.smtpUsername,
    smtpEncryption: settings.smtpEncryption,
    hasResendApiKey: Boolean(settings.resendApiKey),
    hasSmtpPassword: Boolean(settings.smtpPassword)
  };
}

export async function sendEmail(input: SendEmailInput) {
  const settings = await getEmailDeliverySettings();

  if (!settings.enabled || settings.provider === "disabled") {
    return { ok: false, skipped: true, reason: "Email delivery is disabled." };
  }

  if (settings.provider === "resend") {
    return sendWithResend(settings, input);
  }

  return sendWithSmtp(settings, input);
}

async function sendWithResend(settings: EmailDeliverySettings, input: SendEmailInput) {
  if (!settings.resendApiKey) {
    throw new Error("Resend API key is missing.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: formatSender(settings),
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed: ${body || response.statusText}`);
  }

  return { ok: true, provider: "resend" as const };
}

async function sendWithSmtp(settings: EmailDeliverySettings, input: SendEmailInput) {
  if (!settings.smtpHost || !settings.smtpUsername || !settings.smtpPassword) {
    throw new Error("SMTP host, username, and password are required.");
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort || 587,
    secure: settings.smtpEncryption === "ssl",
    requireTLS: settings.smtpEncryption === "starttls",
    auth: {
      user: settings.smtpUsername,
      pass: settings.smtpPassword
    }
  });

  await transporter.sendMail({
    from: formatSender(settings),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo
  });

  return { ok: true, provider: "smtp" as const };
}

function formatSender(settings: Pick<EmailDeliverySettings, "fromName" | "fromEmail">) {
  return settings.fromName ? `${settings.fromName} <${settings.fromEmail}>` : settings.fromEmail;
}
