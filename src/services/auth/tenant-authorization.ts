import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db/prisma";

export async function requireTenantOwner(tenantSlug: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("You must be signed in to manage this website.");
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      slug: tenantSlug,
      ownerUserId: session.user.id,
      status: "ACTIVE"
    },
    select: {
      id: true,
      slug: true,
      ownerUserId: true
    }
  });

  if (!tenant) {
    throw new Error("You are not authorized to manage this website.");
  }

  return tenant;
}
