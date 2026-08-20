import { NextResponse, type NextRequest } from "next/server";
import { customerDemos } from "@/data/customer-demos";
import { prisma } from "@/lib/db/prisma";

export async function HEAD(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (Object.prototype.hasOwnProperty.call(customerDemos, slug)) {
    return new NextResponse(null, { status: 204 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { status: true },
  });

  return new NextResponse(null, {
    status: tenant?.status === "ACTIVE" ? 204 : 404,
  });
}
