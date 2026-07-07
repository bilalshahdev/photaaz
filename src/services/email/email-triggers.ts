import "server-only";

import { prisma } from "@/lib/db/prisma";

export async function isEmailTriggerEnabled(key: string, fallback = true) {
  const setting = await prisma.emailSetting.findUnique({
    where: { key },
    select: { enabled: true }
  });

  return setting?.enabled ?? fallback;
}
