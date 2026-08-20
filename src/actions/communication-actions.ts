"use server";

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/locales";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { publishConversationEvent } from "@/services/communication/live-events";
import { requireSuperAdmin } from "@/services/auth/admin-authorization";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";

const clientThreadSchema = z.object({
  tenantSlug: z.string().min(1),
  subject: z.string().trim().min(2).max(120),
  body: z.string().trim().min(5).max(2000),
});

const replySchema = z.object({
  threadId: z.string().min(1),
  body: z.string().trim().min(2).max(2000),
});

export async function startClientConversation(formData: FormData) {
  const parsed = clientThreadSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    body: String(formData.get("body") ?? ""),
  });
  const authorizedTenant = await requireTenantOwner(parsed.tenantSlug);

  const tenant = await prisma.tenant.findFirst({
    where: {
      id: authorizedTenant.id,
      slug: parsed.tenantSlug,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const thread = await prisma.conversationThread.create({
    data: {
      tenantId: tenant.id,
      subject: parsed.subject,
      messages: {
        create: {
          senderRole: "CLIENT",
          body: parsed.body,
          readByClientAt: new Date(),
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  publishLatestMessage(tenant.slug, thread, thread.messages[0]);
  revalidateCommunicationPaths(tenant.slug);
}

export async function replyAsClient(formData: FormData) {
  const parsed = replySchema.parse({
    threadId: String(formData.get("threadId") ?? ""),
    body: String(formData.get("body") ?? ""),
  });

  const thread = await prisma.conversationThread.findUnique({
    where: {
      id: parsed.threadId,
    },
    include: {
      tenant: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!thread) {
    throw new Error("Conversation not found.");
  }

  await requireTenantOwner(thread.tenant.slug);

  const [message] = await prisma.$transaction([
    prisma.conversationMessage.create({
      data: {
        threadId: thread.id,
        senderRole: "CLIENT",
        body: parsed.body,
        readByClientAt: new Date(),
      },
    }),
    prisma.conversationThread.update({
      where: {
        id: thread.id,
      },
      data: {
        status: "OPEN",
      },
    }),
  ]);

  publishLatestMessage(thread.tenant.slug, thread, message);
  revalidateCommunicationPaths(thread.tenant.slug);
}

export async function replyAsAdmin(formData: FormData) {
  await requireSuperAdmin();
  const parsed = replySchema.parse({
    threadId: String(formData.get("threadId") ?? ""),
    body: String(formData.get("body") ?? ""),
  });

  const thread = await prisma.conversationThread.findUnique({
    where: {
      id: parsed.threadId,
    },
    include: {
      tenant: {
        select: {
          slug: true,
        },
      },
    },
  });

  if (!thread) {
    throw new Error("Conversation not found.");
  }

  const message = await prisma.conversationMessage.create({
    data: {
      threadId: thread.id,
      senderRole: "ADMIN",
      body: parsed.body,
      readByAdminAt: new Date(),
    },
  });

  publishLatestMessage(thread.tenant.slug, thread, message);
  revalidateCommunicationPaths(thread.tenant.slug);
}

function publishLatestMessage(
  tenantSlug: string,
  thread: {
    id: string;
    subject: string;
    status: string;
    updatedAt: Date;
  },
  message?: {
    id: string;
    senderRole: string;
    body: string;
    createdAt: Date;
  },
) {
  if (!message) {
    return;
  }

  publishConversationEvent({
    type: "conversation:message",
    tenantSlug,
    threadId: thread.id,
    thread: {
      id: thread.id,
      subject: thread.subject,
      status: thread.status,
      updatedAt: thread.updatedAt.toISOString(),
    },
    message: {
      id: message.id,
      senderRole: message.senderRole,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
    },
  });
}

function revalidateCommunicationPaths(slug: string) {
  revalidatePath("/admin/messages");
  revalidatePath(`/site/${slug}/dashboard/messages`);
  for (const locale of locales) {
    revalidatePath(`/${locale}/site/${slug}/dashboard/messages`);
  }
}
