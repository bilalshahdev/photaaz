"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { sendEmail } from "@/services/email/email-service";
import { isEmailTriggerEnabled } from "@/services/email/email-triggers";
import { enforceServerActionRateLimit } from "@/services/security/rate-limit";

const supportSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  topic: z.string().min(2),
  message: z.string().min(10)
});

export async function createSupportRequest(input: z.infer<typeof supportSchema>) {
  await enforceServerActionRateLimit("public-support", 5, 10 * 60);
  const data = supportSchema.parse(input);

  await prisma.platformSupportRequest.create({
    data
  });

  const [config, shouldSendEmail] = await Promise.all([
    getPlatformAppConfig(),
    isEmailTriggerEnabled("support.inquiry")
  ]);

  if (shouldSendEmail) {
    await sendEmail({
      to: config.supportEmail,
      replyTo: data.email,
      subject: `New Photaaz support inquiry: ${data.topic}`,
      text: `${data.name} (${data.email}) wrote:\n\n${data.message}`,
      html: `
        <p><strong>${escapeHtml(data.name)}</strong> (${escapeHtml(data.email)}) sent a support inquiry.</p>
        <p><strong>Topic:</strong> ${escapeHtml(data.topic)}</p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
      `
    }).catch((error) => {
      console.error("Support inquiry email failed", error);
    });
  }

  revalidatePath("/admin/support");
  revalidatePath("/admin");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
