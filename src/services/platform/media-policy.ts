import { prisma } from "@/lib/db/prisma";

export type ImageWatermarkPosition = "bottom-left" | "bottom-center" | "bottom-right" | "center";
export type ImageWatermarkSize = "small" | "medium" | "large";

export type PlatformMediaPolicy = {
  maxImageUploadMb: number;
  platformBranding: {
    enabled: boolean;
    text: string;
    position: ImageWatermarkPosition;
    size: ImageWatermarkSize;
    opacity: number;
    backgroundColor: string;
    backgroundOpacity: number;
    textColor: string;
    borderColor: string;
    borderOpacity: number;
  };
};

export type TenantWatermarkSettings = {
  enabled: boolean;
  text: string;
  position: ImageWatermarkPosition;
  size: ImageWatermarkSize;
  opacity: number;
  backgroundColor: string;
  backgroundOpacity: number;
  textColor: string;
  borderColor: string;
  borderOpacity: number;
};

export type EffectiveImageWatermark = {
  enabled: boolean;
  text: string;
  position: ImageWatermarkPosition;
  size: ImageWatermarkSize;
  opacity: number;
  backgroundColor: string;
  backgroundOpacity: number;
  textColor: string;
  borderColor: string;
  borderOpacity: number;
  source: "platform" | "tenant";
};

export const defaultPlatformMediaPolicy: PlatformMediaPolicy = {
  maxImageUploadMb: 8,
  platformBranding: {
    enabled: true,
    text: "Photaaz",
    position: "bottom-right",
    size: "small",
    opacity: 0.9,
    backgroundColor: "#000000",
    backgroundOpacity: 0.35,
    textColor: "#ffffff",
    borderColor: "#ffffff",
    borderOpacity: 0.18
  }
};

export const defaultTenantWatermarkSettings: TenantWatermarkSettings = {
  enabled: false,
  text: "",
  position: "bottom-right",
  size: "small",
  opacity: 0.9,
  backgroundColor: "#000000",
  backgroundOpacity: 0.35,
  textColor: "#ffffff",
  borderColor: "#ffffff",
  borderOpacity: 0.18
};

export async function getPlatformMediaPolicy(): Promise<PlatformMediaPolicy> {
  const setting = await prisma.platformSetting.findUnique({
    where: { key: "app_config" },
    select: { value: true }
  });
  const savedConfig = normalizeRecord(setting?.value);
  const media = normalizeRecord(savedConfig.media);
  const branding = normalizeRecord(media.platformBranding);

  return {
    maxImageUploadMb: readNumber(media.maxImageUploadMb, defaultPlatformMediaPolicy.maxImageUploadMb, 1, 50),
    platformBranding: {
      enabled: readBoolean(branding.enabled, defaultPlatformMediaPolicy.platformBranding.enabled),
      text: readString(branding.text) ?? defaultPlatformMediaPolicy.platformBranding.text,
      position: readEnum(branding.position, ["bottom-left", "bottom-center", "bottom-right", "center"], defaultPlatformMediaPolicy.platformBranding.position),
      size: readEnum(branding.size, ["small", "medium", "large"], defaultPlatformMediaPolicy.platformBranding.size),
      opacity: readNumber(branding.opacity, defaultPlatformMediaPolicy.platformBranding.opacity, 0.1, 1),
      backgroundColor: readColor(branding.backgroundColor, defaultPlatformMediaPolicy.platformBranding.backgroundColor),
      backgroundOpacity: readNumber(branding.backgroundOpacity, defaultPlatformMediaPolicy.platformBranding.backgroundOpacity, 0, 1),
      textColor: readColor(branding.textColor, defaultPlatformMediaPolicy.platformBranding.textColor),
      borderColor: readColor(branding.borderColor, defaultPlatformMediaPolicy.platformBranding.borderColor),
      borderOpacity: readNumber(branding.borderOpacity, defaultPlatformMediaPolicy.platformBranding.borderOpacity, 0, 1)
    }
  };
}

export async function getMaxImageUploadBytes() {
  const policy = await getPlatformMediaPolicy();

  return policy.maxImageUploadMb * 1024 * 1024;
}

export function resolveEffectiveImageWatermark({
  planKey,
  platformPolicy,
  tenantWatermark
}: {
  planKey: string;
  platformPolicy: PlatformMediaPolicy;
  tenantWatermark: TenantWatermarkSettings;
}): EffectiveImageWatermark | null {
  if ((planKey === "pro" || planKey === "ownership") && tenantWatermark.enabled && tenantWatermark.text.trim()) {
    return {
      ...tenantWatermark,
      text: tenantWatermark.text.trim(),
      source: "tenant"
    };
  }

  if ((planKey === "free" || planKey === "plus") && platformPolicy.platformBranding.enabled && platformPolicy.platformBranding.text.trim()) {
    return {
      enabled: true,
      text: platformPolicy.platformBranding.text.trim(),
      position: platformPolicy.platformBranding.position,
      size: platformPolicy.platformBranding.size,
      opacity: platformPolicy.platformBranding.opacity,
      backgroundColor: platformPolicy.platformBranding.backgroundColor,
      backgroundOpacity: platformPolicy.platformBranding.backgroundOpacity,
      textColor: platformPolicy.platformBranding.textColor,
      borderColor: platformPolicy.platformBranding.borderColor,
      borderOpacity: platformPolicy.platformBranding.borderOpacity,
      source: "platform"
    };
  }

  return null;
}

export function normalizeTenantWatermark(value: unknown): TenantWatermarkSettings {
  const watermark = normalizeRecord(value);

  return {
    enabled: readBoolean(watermark.enabled, defaultTenantWatermarkSettings.enabled),
    text: readString(watermark.text) ?? defaultTenantWatermarkSettings.text,
    position: readEnum(watermark.position, ["bottom-left", "bottom-center", "bottom-right", "center"], defaultTenantWatermarkSettings.position),
    size: readEnum(watermark.size, ["small", "medium", "large"], defaultTenantWatermarkSettings.size),
    opacity: readNumber(watermark.opacity, defaultTenantWatermarkSettings.opacity, 0.1, 1),
    backgroundColor: readColor(watermark.backgroundColor, defaultTenantWatermarkSettings.backgroundColor),
    backgroundOpacity: readNumber(watermark.backgroundOpacity, defaultTenantWatermarkSettings.backgroundOpacity, 0, 1),
    textColor: readColor(watermark.textColor, defaultTenantWatermarkSettings.textColor),
    borderColor: readColor(watermark.borderColor, defaultTenantWatermarkSettings.borderColor),
    borderOpacity: readNumber(watermark.borderOpacity, defaultTenantWatermarkSettings.borderOpacity, 0, 1)
  };
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function readNumber(value: unknown, fallback: number, min: number, max: number) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numeric));
}

function readColor(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;
}

function readEnum<T extends string>(value: unknown, options: readonly T[], fallback: T) {
  return typeof value === "string" && options.includes(value as T) ? (value as T) : fallback;
}
