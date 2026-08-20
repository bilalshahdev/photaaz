import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";
import { deleteCloudinaryAsset, validateUploadedCloudinaryAsset } from "@/services/storage/direct-cloudinary-upload";

const assetSchema = z.object({ grant: z.string(), publicId: z.string(), secureUrl: z.string().url(), bytes: z.number(), width: z.number(), height: z.number(), format: z.string(), version: z.number().int().positive(), signature: z.string().regex(/^[a-f0-9]{40}$/i) });
const schema = z.object({ tenantSlug: z.string().min(1), assets: z.array(assetSchema).max(20) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    await requireTenantOwner(input.tenantSlug);
    for (const asset of input.assets) {
      const verified = validateUploadedCloudinaryAsset(asset, input.tenantSlug);
      await deleteCloudinaryAsset(verified.storageId);
    }
    return NextResponse.json({ cleaned: true });
  } catch {
    return NextResponse.json({ cleaned: false }, { status: 400 });
  }
}
