import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { getPlatformMediaPolicy } from "@/services/platform/media-policy";
import { getCloudinaryRootFolder } from "@/services/storage/cloudinary-delivery";

const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const formatsByMimeType: Record<string, ReadonlySet<string>> = {
  "image/jpeg": new Set(["jpg", "jpeg"]),
  "image/png": new Set(["png"]),
  "image/webp": new Set(["webp"]),
  "image/gif": new Set(["gif"]),
};
const grantLifetimeSeconds = 10 * 60;
export const maxImageDimension = 20_000;
export const maxImagePixels = 100_000_000;

export type DirectUploadArea = "photos" | "categories" | "blogs" | "others";

type UploadGrant = {
  tenantSlug: string;
  publicId: string;
  folder: string;
  mimeType: string;
  maxBytes: number;
  expiresAt: number;
};

export type UploadedCloudinaryAsset = {
  grant: string;
  publicId: string;
  secureUrl: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  version: number;
  signature: string;
};

export async function createDirectUploadAuthorization(input: {
  tenantSlug: string;
  area: DirectUploadArea;
  folder?: string;
  fileLabel?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}) {
  requireCloudinary();
  const policy = await getPlatformMediaPolicy();
  const maxBytes = policy.maxImageUploadMb * 1024 * 1024;
  if (!input.fileSize || input.fileSize > maxBytes) throw new Error(`Image is too large. Upload an image under ${policy.maxImageUploadMb}MB.`);
  if (!supportedTypes.has(input.mimeType)) throw new Error("Only JPG, PNG, WebP, and GIF images are supported.");

  const safeTenant = slugify(input.tenantSlug);
  const safeFolder = input.folder ? `/${slugify(input.folder)}` : "";
  const folder = `${getCloudinaryRootFolder()}/tenants/${safeTenant}/${input.area}${safeFolder}`;
  const publicId = `${slugify(input.fileLabel || input.fileName.replace(/\.[^.]+$/, "") || "image")}-${Date.now()}-${crypto.randomUUID()}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, public_id: publicId, timestamp: String(timestamp) };
  const grantPayload: UploadGrant = { tenantSlug: input.tenantSlug, publicId: `${folder}/${publicId}`, folder, mimeType: input.mimeType, maxBytes, expiresAt: timestamp + grantLifetimeSeconds };

  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME!,
    apiKey: env.CLOUDINARY_API_KEY!,
    folder,
    publicId,
    timestamp,
    signature: signCloudinaryParams(params),
    grant: signGrant(grantPayload)
  };
}

export function readUploadedCloudinaryAsset(formData: FormData, fieldName: string, tenantSlug: string) {
  const raw = formData.get(`__cloudinary_${fieldName}`);
  if (typeof raw !== "string" || !raw) return null;
  const parsed = JSON.parse(raw) as UploadedCloudinaryAsset | UploadedCloudinaryAsset[];
  const asset = Array.isArray(parsed) ? parsed[0] : parsed;
  return validateUploadedCloudinaryAsset(asset, tenantSlug);
}

export function readUploadedCloudinaryAssets(formData: FormData, fieldName: string, tenantSlug: string) {
  const raw = formData.get(`__cloudinary_${fieldName}`);
  if (typeof raw !== "string" || !raw) return [];
  const parsed = JSON.parse(raw) as UploadedCloudinaryAsset | UploadedCloudinaryAsset[];
  return (Array.isArray(parsed) ? parsed : [parsed]).map((asset) => validateUploadedCloudinaryAsset(asset, tenantSlug));
}

export function validateUploadedCloudinaryAsset(asset: UploadedCloudinaryAsset, tenantSlug: string) {
  const grant = verifyGrant(asset.grant);
  if (grant.tenantSlug !== tenantSlug || grant.publicId !== asset.publicId) throw new Error("Invalid image upload authorization.");
  if (!verifyCloudinaryResponseSignature(asset)) throw new Error("Cloudinary upload response verification failed.");
  if (asset.bytes <= 0 || asset.bytes > grant.maxBytes) throw new Error("Uploaded image exceeds the configured size limit.");
  if (!Number.isSafeInteger(asset.width) || !Number.isSafeInteger(asset.height) || asset.width <= 0 || asset.height <= 0) throw new Error("Uploaded image has invalid dimensions.");
  if (asset.width > maxImageDimension || asset.height > maxImageDimension || asset.width * asset.height > maxImagePixels) throw new Error("Uploaded image dimensions are too large.");
  if (!formatsByMimeType[grant.mimeType]?.has(asset.format.toLowerCase())) throw new Error("Uploaded image format does not match the authorized MIME type.");
  if (!asset.secureUrl.startsWith(`https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`)) throw new Error("Invalid uploaded image URL.");
  if (!asset.publicId.startsWith(`${grant.folder}/`)) throw new Error("Uploaded image is outside the authorized folder.");
  return { publicPath: asset.secureUrl, storageId: `cloudinary/${asset.publicId}` };
}

export function verifyCloudinaryResponseSignature(asset: Pick<UploadedCloudinaryAsset, "publicId" | "version" | "signature">) {
  if (!asset.publicId || !Number.isSafeInteger(asset.version) || asset.version <= 0 || !/^[a-f0-9]{40}$/i.test(asset.signature)) return false;
  const expected = createHash("sha1")
    .update(`public_id=${asset.publicId}&version=${asset.version}${env.CLOUDINARY_API_SECRET ?? ""}`)
    .digest();
  const received = Buffer.from(asset.signature, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function deleteCloudinaryAsset(storageId: string | null | undefined) {
  if (!storageId?.startsWith("cloudinary/")) return;
  requireCloudinary();
  const publicId = storageId.slice("cloudinary/".length);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryParams({ public_id: publicId, timestamp: String(timestamp) });
  const body = new FormData();
  body.append("public_id", publicId); body.append("timestamp", String(timestamp)); body.append("api_key", env.CLOUDINARY_API_KEY!); body.append("signature", signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`, { method: "POST", body });
  if (!response.ok) throw new Error("Cloudinary image deletion failed.");
}

function signCloudinaryParams(params: Record<string, string>) {
  const payload = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
  return createHash("sha1").update(`${payload}${env.CLOUDINARY_API_SECRET}`).digest("hex");
}
function signGrant(payload: UploadGrant) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", env.CLOUDINARY_API_SECRET!).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}
function verifyGrant(value: string) {
  const [encoded, supplied] = value.split(".");
  if (!encoded || !supplied) throw new Error("Invalid image upload authorization.");
  const expected = createHmac("sha256", env.CLOUDINARY_API_SECRET!).update(encoded).digest();
  const received = Buffer.from(supplied, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) throw new Error("Invalid image upload authorization.");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as UploadGrant;
  if (payload.expiresAt < Math.floor(Date.now() / 1000)) throw new Error("Image upload authorization expired.");
  return payload;
}
function requireCloudinary() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) throw new Error("Cloudinary must be configured for image uploads.");
}
function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "image"; }
