import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function source(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function exportedAsyncFunctionBody(file: string, functionName: string) {
  const contents = source(file);
  const start = contents.indexOf(`export async function ${functionName}(`);
  assert.notEqual(start, -1, `${functionName} must exist in ${file}`);
  const nextExport = contents.indexOf("\nexport async function ", start + 1);
  return contents.slice(
    start,
    nextExport === -1 ? contents.length : nextExport,
  );
}

test("every Super Admin mutation requires a signed admin session", () => {
  for (const file of [
    "src/app/admin/actions.ts",
    "src/actions/platform-blog-actions.ts",
  ]) {
    const contents = source(file);
    const names = [...contents.matchAll(/export async function\s+(\w+)/g)].map(
      (match) => match[1],
    );

    assert.ok(names.length > 0, `${file} must contain admin mutations`);
    for (const name of names) {
      assert.match(
        exportedAsyncFunctionBody(file, name),
        /await requireSuperAdmin\(\)/,
        `${name} must call requireSuperAdmin()`,
      );
    }
  }
});

test("high-risk customer mutations require tenant ownership", () => {
  const guardedFunctions: Array<[string, string]> = [
    ["src/actions/customer-category-actions.ts", "linkCustomerCategory"],
    ["src/actions/customer-category-actions.ts", "unlinkCustomerCategory"],
    ["src/actions/customer-gallery-actions.ts", "createCustomerGallery"],
    ["src/actions/customer-gallery-actions.ts", "updateCustomerGallery"],
    ["src/actions/customer-gallery-actions.ts", "deleteCustomerGallery"],
    ["src/actions/customer-settings-actions.ts", "applyCustomerTheme"],
    ["src/actions/customer-settings-actions.ts", "updateCustomerSiteSettings"],
    ["src/actions/customer-settings-actions.ts", "updateCustomerProfile"],
    ["src/actions/customer-billing-actions.ts", "startPlanCheckout"],
    ["src/actions/tenant-inquiry-actions.ts", "updateTenantInquiryStatus"],
    ["src/actions/communication-actions.ts", "startClientConversation"],
    ["src/actions/communication-actions.ts", "replyAsClient"],
  ];

  for (const [file, name] of guardedFunctions) {
    const body = exportedAsyncFunctionBody(file, name);
    const delegatesToProtectedHelper =
      body.includes("getTenant(parsed.tenantSlug)") &&
      source(file).includes("requireTenantOwner(slug)");
    assert.ok(
      body.includes("requireTenantOwner(") || delegatesToProtectedHelper,
      `${name} must verify tenant ownership`,
    );
  }
});

test("onboarding binds tenant creation to the authenticated account", () => {
  const contents = source("src/actions/onboarding-actions.ts");
  assert.match(contents, /auth\.api\.getSession/);
  assert.match(contents, /ownerUserId:\s*owner\.id/);
  assert.doesNotMatch(contents, /prisma\.user\.upsert/);
  assert.match(contents, /session\.user\.email/);
});

test("checkout cannot select a tenant by browser-supplied slug alone", () => {
  const body = exportedAsyncFunctionBody(
    "src/actions/customer-billing-actions.ts",
    "startPlanCheckout",
  );
  assert.match(body, /requireTenantOwner\(parsed\.tenantSlug\)/);
  assert.match(body, /id:\s*authorizedTenant\.id/);
});

test("every dashboard data read verifies tenant ownership", () => {
  const file = "src/services/tenant/customer-dashboard-data.ts";
  const contents = source(file);
  const names = [...contents.matchAll(/export async function\s+(\w+)/g)].map(
    (match) => match[1],
  );

  assert.ok(names.length > 0, "dashboard data service must export reads");
  for (const name of names) {
    assert.match(
      exportedAsyncFunctionBody(file, name),
      /await requireTenantOwner\(slug\)/,
      `${name} must verify tenant ownership`,
    );
  }
});

test("dashboard requests without an auth session redirect before rendering", () => {
  const contents = source("src/proxy.ts");
  assert.match(contents, /better-auth\.session_token/);
  assert.match(contents, /url\.pathname = "\/sign-in"/);
});

test("unknown tenant homepages return a real not-found response", () => {
  const contents = source("src/app/[locale]/site/[slug]/page.tsx");
  const proxy = source("src/proxy.ts");
  assert.match(contents, /if \(!demo\)\s*\{\s*notFound\(\)/);
  assert.doesNotMatch(contents, /customerDemos\.demo/);
  assert.match(proxy, /async function publicTenantExists/);
  assert.match(proxy, /NextResponse\.rewrite\(url, \{ status: 404 \}\)/);
});

test("production uploads cannot fall back to local server disk", () => {
  const contents = source("src/services/storage/local-upload.ts");
  assert.match(
    contents,
    /if \(env\.NODE_ENV === "production"\)\s*\{\s*throw new Error\("Cloudinary must be configured/,
  );
});
