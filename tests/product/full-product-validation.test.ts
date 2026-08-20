import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { getTextDirection, locales, messages } from "../../src/i18n/locales";
import { hasMatchingImageSignature } from "../../src/services/storage/local-upload";

const source = (path: string) => readFileSync(path, "utf8");

test("all nine supported locales have complete message key parity and correct RTL direction", () => {
  assert.deepEqual(locales, ["en", "ur", "es", "ar", "tr", "hi", "pt", "de", "fr"]);
  const englishKeys = Object.keys(messages.en).sort();
  for (const locale of locales) assert.deepEqual(Object.keys(messages[locale]).sort(), englishKeys, `${locale} message keys differ from English`);
  assert.equal(getTextDirection("ur"), "rtl");
  assert.equal(getTextDirection("ar"), "rtl");
  for (const locale of locales.filter((item) => !["ur", "ar"].includes(item))) assert.equal(getTextDirection(locale), "ltr");
  const rootLayout = source("src/app/layout.tsx");
  assert.match(rootLayout, /getLocale\(\)/);
  assert.match(rootLayout, /lang=\{locale\}/);
  assert.match(rootLayout, /dir=\{getTextDirection\(locale\)\}/);
});

test("SEO discovery endpoints and localized metadata are implemented", () => {
  for (const path of ["src/app/robots.ts", "src/app/sitemap.ts", "src/app/feed.xml/route.ts", "src/app/manifest.ts"]) assert.doesNotThrow(() => source(path));
  const seo = source("src/lib/seo.ts");
  assert.match(seo, /alternates:/);
  assert.match(seo, /canonical/);
  assert.match(seo, /openGraph:/);
  assert.match(seo, /twitter:/);
  assert.match(seo, /languages:/);
  assert.match(source("src/app/[locale]/blog/page.tsx"), /application\/ld\+json/);
});

test("main-site blogs are managed by Super Admin with translation and lifecycle controls", () => {
  const manager = source("src/components/admin/platform-blog-manager.tsx");
  const actions = source("src/actions/platform-blog-actions.ts");
  assert.match(manager, /LocalizedInput/);
  assert.match(manager, /LocalizedTextarea/);
  assert.match(manager, /Publish|published/i);
  assert.match(manager, /Publish date/);
  assert.match(manager, /Delete|remove/i);
  assert.match(actions, /requireSuperAdmin/);
  assert.match(actions, /revalidatePath\("\/feed\.xml"\)/);
  assert.match(actions, /revalidatePath\("\/sitemap\.xml"\)/);
});

test("public tenant queries expose only active, approved and published records", () => {
  const siteData = source("src/services/tenant/customer-site-data.ts");
  assert.match(siteData, /tenant\.status !== "ACTIVE"/);
  assert.match(siteData, /moderationStatus: "APPROVED"/);
  assert.match(siteData, /published: true/);
  assert.match(siteData, /publishedAt:\s*\{\s*not: null/);
});

test("upload validation covers supported signatures, spoofing, limits, Unicode names and extreme dimensions", () => {
  assert.equal(hasMatchingImageSignature(Uint8Array.from([0xff, 0xd8, 0xff]), "image/jpeg"), true);
  assert.equal(hasMatchingImageSignature(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png"), true);
  assert.equal(hasMatchingImageSignature(Buffer.from("RIFFxxxxWEBP"), "image/webp"), true);
  assert.equal(hasMatchingImageSignature(Buffer.from("not an image"), "image/jpeg"), false);
  const direct = source("src/services/storage/direct-cloudinary-upload.ts");
  assert.match(direct, /fileSize > maxBytes/);
  assert.match(direct, /verifyCloudinaryResponseSignature/);
  assert.match(direct, /format does not match the authorized MIME type/);
  assert.match(direct, /maxImageDimension = 20_000/);
  assert.match(direct, /maxImagePixels = 100_000_000/);
  assert.match(direct, /replace\(\/\[\^a-z0-9-\]\+\/g, "-"\)/);
});

test("production uploads fail closed instead of writing to ephemeral disk", () => {
  const local = source("src/services/storage/local-upload.ts");
  assert.match(local, /env\.NODE_ENV === "production"/);
  assert.match(local, /Cloudinary must be configured for production image uploads/);
  const config = source("src/services/storage/cloudinary-delivery.ts");
  assert.match(config, /CLOUDINARY_ENVIRONMENT_FOLDER/);
});

test("critical shells include loading, error, empty, keyboard and accessible dialog behavior", () => {
  assert.doesNotThrow(() => source("src/app/[locale]/site/[slug]/loading.tsx"));
  assert.doesNotThrow(() => source("src/app/[locale]/themes/[theme]/demo/loading.tsx"));
  const viewer = source("src/components/customer/shared-photo-viewer.tsx");
  assert.match(viewer, /Escape/);
  assert.match(viewer, /ArrowLeft/);
  assert.match(viewer, /ArrowRight/);
  assert.match(viewer, /role="dialog"/);
  assert.match(viewer, /aria-modal="true"/);
  assert.match(source("src/components/customer/new-theme-loading-state.tsx"), /animate-pulse/);
  assert.match(source("src/components/customer/customer-gallery-manager.tsx"), /CustomerEmptyState/);
});
