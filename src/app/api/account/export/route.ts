import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db/prisma";
import { enforceServerActionRateLimit } from "@/services/security/rate-limit";

export async function GET() {
  await enforceServerActionRateLimit("account-export", 3, 60 * 60);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return Response.json({ error: "Authentication required." }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      legalAcceptances: true, legalRequests: true,
      tenants: { include: { settings: true, domains: true, subscription: { include: { plan: true } }, categories: true, albums: true, blogs: true, visitorInquiries: true } },
    },
  });
  if (!user) return Response.json({ error: "Account not found." }, { status: 404 });
  return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), user }, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="photaaz-account-export.json"`, "Cache-Control": "no-store" },
  });
}
