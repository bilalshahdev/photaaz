import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperAdmin } from "@/services/auth/admin-authorization";
import { createDirectUploadAuthorization } from "@/services/storage/direct-cloudinary-upload";
import { enforceRateLimit, getRequestIdentity, RateLimitError } from "@/services/security/rate-limit";
const schema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1),
});
export async function POST(request: Request) {
  try {
    await enforceRateLimit({ scope: "admin-upload-sign", identity: getRequestIdentity(request.headers), limit: 30, windowSeconds: 60 });
    await requireSuperAdmin();
    const file = schema.parse(await request.json());
    return NextResponse.json(
      await createDirectUploadAuthorization({
        tenantSlug: "platform",
        area: "others",
        folder: "landing-hero",
        fileLabel: "hero",
        ...file,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload authorization failed.",
      },
      { status: error instanceof RateLimitError ? 429 : 401 },
    );
  }
}
