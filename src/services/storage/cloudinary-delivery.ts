import { env } from "@/lib/env";
import type { EffectiveImageWatermark, ImageWatermarkPosition, ImageWatermarkSize } from "@/services/platform/media-policy";

type CloudinaryWatermarkResult = {
  url: string;
  applied: boolean;
};

export function getCloudinaryEnvironmentFolder() {
  return env.CLOUDINARY_ENVIRONMENT_FOLDER || (env.NODE_ENV === "production" ? "production" : "development");
}

export function getCloudinaryRootFolder() {
  return `${env.CLOUDINARY_ROOT_FOLDER || "photaaz"}/${getCloudinaryEnvironmentFolder()}`;
}

export function applyCloudinaryImageWatermark(url: string, watermark: EffectiveImageWatermark | null | undefined): CloudinaryWatermarkResult {
  if (!watermark?.enabled || !watermark.text || !isCloudinaryImageUrl(url)) {
    return {
      url,
      applied: false
    };
  }

  const uploadMarker = "/image/upload/";
  const markerIndex = url.indexOf(uploadMarker);
  const beforeUpload = url.slice(0, markerIndex + uploadMarker.length);
  const afterUpload = url.slice(markerIndex + uploadMarker.length);
  const transformation = [
    "f_auto",
    "q_auto",
    buildTextOverlay(watermark),
    `fl_layer_apply,${getGravity(watermark.position)},x_16,y_16`
  ].join("/");

  return {
    url: `${beforeUpload}${transformation}/${afterUpload}`,
    applied: true
  };
}

function isCloudinaryImageUrl(url: string) {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && url.includes(`res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`));
}

function buildTextOverlay(watermark: EffectiveImageWatermark) {
  const fontSize = getFontSize(watermark.size);
  const text = encodeCloudinaryText(watermark.text);
  const textColor = stripHash(watermark.textColor);
  const backgroundColor = stripHash(watermark.backgroundColor);
  const backgroundOpacity = Math.round(watermark.backgroundOpacity * 100);
  const textOpacity = Math.round(watermark.opacity * 100);

  return [
    `l_text:Arial_${fontSize}_bold:${text}`,
    `co_rgb:${textColor}`,
    `o_${textOpacity}`,
    `b_rgb:${backgroundColor}`,
    `bo_4px_solid_rgb:${backgroundColor}`,
    `e_opacity:${backgroundOpacity}`
  ].join(",");
}

function getFontSize(size: ImageWatermarkSize) {
  if (size === "large") return 22;
  if (size === "medium") return 18;
  return 14;
}

function getGravity(position: ImageWatermarkPosition) {
  if (position === "bottom-left") return "g_south_west";
  if (position === "bottom-center") return "g_south";
  if (position === "center") return "g_center";
  return "g_south_east";
}

function stripHash(color: string) {
  return color.replace(/^#/, "");
}

function encodeCloudinaryText(value: string) {
  return encodeURIComponent(value.trim()).replace(/%20/g, "%20").replace(/,/g, "%2C").replace(/\//g, "%2F");
}
