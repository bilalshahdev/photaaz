import { mkdir, unlink, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { env } from "@/lib/env";
import { getPlatformMediaPolicy } from "@/services/platform/media-policy";
import { getCloudinaryRootFolder } from "@/services/storage/cloudinary-delivery";

const imageMimeExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

export const fallbackMaxLocalUploadBytes = 8 * 1024 * 1024;

export type TenantUploadArea = "photos" | "categories" | "gallery" | "blogs" | "others";

type SaveTenantImageUploadOptions = {
  area?: TenantUploadArea;
  folder?: string;
  fileLabel?: string;
};

export async function saveTenantImageUpload(file: File, tenantSlug: string, options: SaveTenantImageUploadOptions = {}) {
  if (!file.size) {
    throw new Error("Choose an image to upload.");
  }

  const mediaPolicy = await getPlatformMediaPolicy();
  const maxUploadBytes = mediaPolicy.maxImageUploadMb * 1024 * 1024;

  if (file.size > maxUploadBytes) {
    throw new Error(`Image is too large. Upload an image under ${mediaPolicy.maxImageUploadMb}MB.`);
  }

  const extension = imageMimeExtensions[file.type];

  if (!extension) {
    throw new Error("Only JPG, PNG, WebP, and GIF images are supported.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!hasMatchingImageSignature(bytes, file.type)) {
    throw new Error("The uploaded file content does not match its image type.");
  }

  if (hasCloudinaryConfig()) {
    return uploadTenantImageToCloudinary(file, tenantSlug, options);
  }

  if (env.NODE_ENV === "production") {
    throw new Error("Cloudinary must be configured for production image uploads.");
  }

  const uploadPath = buildTenantUploadPath(tenantSlug, options);
  const fileName = buildFileName(extension, options.fileLabel);
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", ...uploadPath.localSegments);
  const absolutePath = path.join(uploadDirectory, fileName);
  const publicPath = `/uploads/${uploadPath.localSegments.join("/")}/${fileName}`;

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(absolutePath, bytes);

  return {
    publicPath,
    storageId: `local/${uploadPath.localSegments.join("/")}/${fileName}`
  };
}

export function hasMatchingImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  if (mimeType === "image/gif") return bytes.length >= 6 && (Buffer.from(bytes.slice(0, 6)).toString("ascii") === "GIF87a" || Buffer.from(bytes.slice(0, 6)).toString("ascii") === "GIF89a");
  if (mimeType === "image/webp") return bytes.length >= 12 && Buffer.from(bytes.slice(0, 4)).toString("ascii") === "RIFF" && Buffer.from(bytes.slice(8, 12)).toString("ascii") === "WEBP";
  return false;
}

async function uploadTenantImageToCloudinary(file: File, tenantSlug: string, options: SaveTenantImageUploadOptions) {
  const uploadPath = buildTenantUploadPath(tenantSlug, options);
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `${getCloudinaryRootFolder()}/${uploadPath.localSegments.join("/")}`;
  const publicId = buildFileName("", options.fileLabel).replace(/\.$/, "");
  const paramsToSign = {
    folder,
    public_id: publicId,
    timestamp: String(timestamp)
  };
  const signature = signCloudinaryParams(paramsToSign);
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", env.CLOUDINARY_API_KEY ?? "");
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary upload failed: ${body || response.statusText}`);
  }

  const result = (await response.json()) as { secure_url?: string; public_id?: string };

  if (!result.secure_url || !result.public_id) {
    throw new Error("Cloudinary did not return an uploaded image URL.");
  }

  return {
    publicPath: result.secure_url,
    storageId: `cloudinary/${result.public_id}`
  };
}

export async function deleteLocalUpload(publicPath: string | null | undefined) {
  if (!publicPath?.startsWith("/uploads/")) {
    return;
  }

  const relativePath = publicPath.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), "public", relativePath);

  try {
    await unlink(absolutePath);
  } catch {
    // The DB record is the source of truth; a missing local file should not block deletion.
  }
}

function slugifyPathSegment(value: string) {
  return (
    value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function buildTenantUploadPath(tenantSlug: string, options: SaveTenantImageUploadOptions) {
  const safeSlug = slugifyPathSegment(tenantSlug);
  const area = options.area ?? "others";
  const nestedFolder = options.folder ? [slugifyPathSegment(options.folder)] : [];

  return {
    localSegments: ["tenants", safeSlug, area, ...nestedFolder]
  };
}

function buildFileName(extension: string, label?: string) {
  const safeLabel = label ? `${slugifyPathSegment(label)}-` : "";
  const suffix = `${Date.now()}-${crypto.randomUUID()}`;

  return `${safeLabel}${suffix}${extension ? `.${extension}` : ""}`;
}

function hasCloudinaryConfig() {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

function signCloudinaryParams(params: Record<string, string>) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${payload}${env.CLOUDINARY_API_SECRET ?? ""}`)
    .digest("hex");
}
