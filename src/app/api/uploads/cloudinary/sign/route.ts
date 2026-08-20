import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";
import { createDirectUploadAuthorization } from "@/services/storage/direct-cloudinary-upload";
import { enforceRateLimit, getRequestIdentity, RateLimitError } from "@/services/security/rate-limit";

const schema = z.object({
  tenantSlug: z.string().min(1), area: z.enum(["photos", "categories", "blogs", "others"]), folder: z.string().max(80).optional(),
  fileLabel: z.string().max(160).optional(), fileName: z.string().min(1).max(255), fileSize: z.number().int().positive(), mimeType: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    await enforceRateLimit({ scope: "tenant-upload-sign", identity: getRequestIdentity(request.headers), limit: 30, windowSeconds: 60 });
    const input = schema.parse(await request.json());
    await requireTenantOwner(input.tenantSlug);
    return NextResponse.json(await createDirectUploadAuthorization(input));
  } catch (error) {
    const status = error instanceof RateLimitError ? 429 : 400;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload authorization failed." }, { status });
  }
}
