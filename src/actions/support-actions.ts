"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const supportSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  topic: z.string().min(2),
  message: z.string().min(10)
});

export async function createSupportRequest(input: z.infer<typeof supportSchema>) {
  const data = supportSchema.parse(input);

  await prisma.platformSupportRequest.create({
    data
  });

  revalidatePath("/admin/support");
  revalidatePath("/admin");
}
