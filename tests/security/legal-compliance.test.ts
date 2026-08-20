import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { legalLinks } from "../../src/config/legal";
import { locales } from "../../src/i18n/locales";

const read = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");

test("all required legal documents are published for every routed locale", () => {
  assert.deepEqual(legalLinks.map((link) => link.slug), ["privacy", "terms", "refund", "cookies", "acceptable-use", "copyright", "dpa", "subprocessors"]);
  const page = read("src/app/[locale]/legal/[slug]/page.tsx");
  for (const slug of legalLinks.map((link) => link.slug)) assert.ok(page.includes(slug === "acceptable-use" ? '"acceptable-use": {' : `${slug}: {`), slug);
  assert.match(page, /locales\.flatMap\(\(locale\) => legalLinks\.map/);
  assert.ok(locales.length >= 2);
});

test("legal documents cover the actual SaaS, photography, payment, privacy, and vendor risks", () => {
  const page = read("src/app/[locale]/legal/[slug]/page.tsx").toLowerCase();
  for (const phrase of ["legal bases", "international transfers", "retention", "children", "paddle", "merchant of record", "seven-day", "fourteen days", "model releases", "limited, worldwide, non-exclusive licence", "counter-notice", "repeat infringers", "personal-data breach", "vercel", "supabase", "cloudinary", "resend"]) assert.ok(page.includes(phrase), phrase);
});

test("signup is blocked without current unbundled acceptance and records an audit row", () => {
  const panel = read("src/components/auth/auth-panel.tsx");
  const route = read("src/app/api/auth/[...all]/route.ts");
  const schema = read("prisma/schema.prisma");
  assert.match(panel, /name="legalAccepted" type="checkbox" required/);
  assert.match(panel, /Terms<\/Link> and acknowledge the .*Privacy Policy/);
  assert.match(route, /legalAccepted !== true/);
  assert.match(route, /versions\?\.terms !== currentLegalVersions\.terms/);
  assert.match(route, /prisma\.legalAcceptance\.upsert/);
  assert.match(schema, /@@unique\(\[userId, termsVersion, privacyVersion\]\)/);
});

test("material-version changes gate existing dashboards until renewed acceptance", () => {
  const layout = read("src/app/site/[slug]/dashboard/layout.tsx");
  const action = read("src/actions/legal-request-actions.ts");
  assert.match(layout, /currentLegalVersions\.terms/);
  assert.match(layout, /redirect\(`\/legal-accept/);
  assert.match(action, /acceptCurrentLegalTerms/);
  assert.match(action, /formData\.get\("accepted"\) !== "on"/);
});

test("cookie preference control defaults optional tracking off and supports withdrawal", () => {
  const consent = read("src/components/legal/cookie-consent.tsx");
  const layout = read("src/app/layout.tsx");
  assert.match(consent, /optional analytics remain off unless you accept/i);
  assert.match(consent, /choose\(false\)/);
  assert.match(consent, /localStorage\.setItem/);
  assert.match(layout, /<CookieConsent/);
});

test("verified privacy export, deletion requests, and copyright notices are server recorded", () => {
  const actions = read("src/actions/legal-request-actions.ts");
  const exportRoute = read("src/app/api/account/export/route.ts");
  assert.match(actions, /auth\.api\.getSession/);
  assert.match(actions, /z\.enum\(privacyTypes\)/);
  assert.match(actions, /type: "COPYRIGHT"/);
  assert.match(actions, /declaration: true/);
  assert.match(read("src/components/admin/admin-auth-gate.tsx"), /\/admin\/legal/);
  assert.match(read("src/app/admin/legal/page.tsx"), /prisma\.legalRequest\.findMany/);
  assert.match(exportRoute, /session\?\.user\?\.id/);
  assert.match(exportRoute, /where: \{ id: session\.user\.id \}/);
  assert.match(exportRoute, /Content-Disposition/);
});

test("public and tenant footers expose legal links and paid users receive a cancellation route", () => {
  for (const file of ["src/components/marketing/landing-page-client.tsx", "src/components/customer/customer-public-page.tsx", "src/components/customer/customer-site-experience.tsx"]) assert.match(read(file), /legal\/privacy|legalLinks/, file);
  assert.match(read("src/app/site/[slug]/dashboard/package/page.tsx"), /https:\/\/paddle\.net/);
});
