"use server";

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/locales";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/services/email/email-service";
import { isEmailTriggerEnabled } from "@/services/email/email-triggers";

const visitorInquirySchema = z.object({
  tenantSlug: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(140).optional(),
  message: z.string().trim().min(5).max(2500)
});

const inquiryStatusSchema = z.object({
  tenantSlug: z.string().min(1),
  inquiryId: z.string().min(1),
  status: z.enum(["Open", "Replied", "Closed"])
});

export async function createTenantVisitorInquiry(formData: FormData) {
  const parsed = visitorInquirySchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: optionalString(formData.get("phone")),
    subject: optionalString(formData.get("subject")),
    message: String(formData.get("message") ?? "")
  });

  const tenant = await prisma.tenant.findUnique({
    where: { slug: parsed.tenantSlug },
    select: {
      id: true,
      slug: true,
      name: true,
      settings: {
        select: {
          businessDetails: true
        }
      },
      owner: {
        select: {
          email: true
        }
      }
    }
  });

  if (!tenant) {
    throw new Error("Portfolio not found.");
  }

  await prisma.tenantInquiry.create({
    data: {
      tenantId: tenant.id,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      subject: parsed.subject,
      message: parsed.message
    }
  });

  const recipient = getTenantInquiryRecipient(tenant);
  const shouldSendEmail = await isEmailTriggerEnabled("tenant.inquiry");

  if (recipient && shouldSendEmail) {
    await sendEmail({
      to: recipient,
      replyTo: parsed.email,
      subject: `New portfolio inquiry for ${tenant.name}`,
      text: `${parsed.name} (${parsed.email}) wrote:\n\n${parsed.message}`,
      html: `
        <p><strong>${escapeHtml(parsed.name)}</strong> (${escapeHtml(parsed.email)}) sent an inquiry from your portfolio.</p>
        ${parsed.phone ? `<p><strong>Phone:</strong> ${escapeHtml(parsed.phone)}</p>` : ""}
        ${parsed.subject ? `<p><strong>Subject:</strong> ${escapeHtml(parsed.subject)}</p>` : ""}
        <p>${escapeHtml(parsed.message).replace(/\n/g, "<br />")}</p>
      `
    }).catch((error) => {
      console.error("Tenant inquiry email failed", error);
    });
  }

  revalidatePath(`/site/${tenant.slug}/dashboard/support`);
  for (const locale of locales) {
    revalidatePath(`/${locale}/site/${tenant.slug}/dashboard/support`);
  }
}

export async function updateTenantInquiryStatus(formData: FormData) {
  const parsed = inquiryStatusSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    inquiryId: String(formData.get("inquiryId") ?? ""),
    status: String(formData.get("status") ?? "")
  });

  const tenant = await prisma.tenant.findUnique({
    where: { slug: parsed.tenantSlug },
    select: { id: true, slug: true }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  await prisma.tenantInquiry.update({
    where: {
      id: parsed.inquiryId,
      tenantId: tenant.id
    },
    data: {
      status: parsed.status
    }
  });

  revalidatePath(`/site/${tenant.slug}/dashboard/support`);
  for (const locale of locales) {
    revalidatePath(`/${locale}/site/${tenant.slug}/dashboard/support`);
  }
}

function optionalString(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue ? stringValue : undefined;
}

function getTenantInquiryRecipient(tenant: {
  owner: { email: string } | null;
  settings: { businessDetails: unknown } | null;
}) {
  const businessDetails = normalizeRecord(tenant.settings?.businessDetails);
  const profile = normalizeRecord(businessDetails.profile);
  const contact = normalizeRecord(businessDetails.contact);

  return readString(profile.email) ?? readString(contact.email) ?? tenant.owner?.email ?? null;
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
