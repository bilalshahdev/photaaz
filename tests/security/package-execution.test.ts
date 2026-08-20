import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { defaultPlanFeatures } from "../../src/config/features";
import { getAccessibleThemeKeys, themes } from "../../src/config/themes";
import {
  assertCanCreateWithinLimit,
  assertResultingCountWithinLimit,
} from "../../src/services/subscription/limit-policy";

const limits = {
  free: { blogs: 3, photos: 50, heroes: 1, perCategory: 20, parents: 3, children: 3, galleries: 3, perGallery: 20, premium: 0, requests: 0 },
  plus: { blogs: 10, photos: 300, heroes: 3, perCategory: 50, parents: 10, children: 5, galleries: 10, perGallery: 50, premium: 2, requests: 5 },
  pro: { blogs: 50, photos: 5000, heroes: 5, perCategory: 500, parents: 20, children: 10, galleries: 50, perGallery: 500, premium: 5, requests: 20 },
  ownership: { blogs: null, photos: null, heroes: null, perCategory: null, parents: null, children: null, galleries: null, perGallery: null, premium: null, requests: null },
} as const;

test("seeded package catalogue matches the production runbook", () => {
  const seed = readFileSync(path.join(process.cwd(), "prisma/seed.ts"), "utf8");
  for (const [plan, values] of Object.entries(limits)) {
    const start = seed.indexOf(`key: "${plan}"`);
    const end = seed.indexOf("\n  {", start + 1);
    const block = seed.slice(start, end < 0 ? undefined : end);
    const expected = [
      ["blogs", values.blogs], ["photos.total", values.photos], ["heroImages.total", values.heroes],
      ["photos.perCategory", values.perCategory], ["categories.total", values.parents],
      ["subcategories.perCategory", values.children], ["galleries.total", values.galleries],
      ["photos.perGallery", values.perGallery], ["premiumThemes.limit", values.premium],
      ["categoryRequests.total", values.requests],
    ] as const;
    for (const [feature, limit] of expected) {
      const escaped = feature.replaceAll(".", "\\.");
      const pattern = limit === null
        ? new RegExp(`(?:"${escaped}"|${escaped}): \\{ enabled: true \\}`)
        : new RegExp(`(?:"${escaped}"|${escaped}): \\{ enabled: ${limit === 0 ? "false" : "true"}, limit: ${limit} \\}`);
      assert.match(block, pattern, `${plan}.${feature}`);
    }
  }
  assert.match(seed, /key: "plus"[\s\S]*?gracePeriodDays: 7,/);
  assert.match(seed, /key: "pro"[\s\S]*?gracePeriodDays: 14,/);
  assert.match(seed, /key: "ownership"[\s\S]*?lifetimePrice: 149000,/);
  assert.match(seed, /key: "ownership"[\s\S]*?"freeMaintenance\.months": \{ enabled: true, limit: 2 \}/);
});

test("every plan passes L-1/L/L+1 creation and resulting-count boundaries", () => {
  for (const values of Object.values(limits)) {
    for (const limit of Object.values(values)) {
      if (limit === null) {
        assert.doesNotThrow(() => assertCanCreateWithinLimit(100_000, limit, "record"));
        continue;
      }
      if (limit > 0) assert.doesNotThrow(() => assertCanCreateWithinLimit(limit - 1, limit, "record"));
      assert.throws(() => assertCanCreateWithinLimit(limit, limit, "record"));
      assert.doesNotThrow(() => assertResultingCountWithinLimit(limit, limit, "record"));
      assert.throws(() => assertResultingCountWithinLimit(limit + 1, limit, "record"));
    }
  }
});

test("package capability switches match Free, Plus, Pro, and Ownership", () => {
  for (const key of ["customDomains", "pageHeaderImages", "themeComponents"] as const) {
    assert.equal(defaultPlanFeatures.free[key], false);
    assert.equal(defaultPlanFeatures.plus[key], true);
    assert.equal(defaultPlanFeatures.pro[key], true);
    assert.equal(defaultPlanFeatures.ownership[key], true);
  }
  assert.equal(defaultPlanFeatures.free.watermarks, false);
  assert.equal(defaultPlanFeatures.plus.watermarks, false);
  assert.equal(defaultPlanFeatures.pro.watermarks, true);
  assert.equal(defaultPlanFeatures.ownership.watermarks, true);
  assert.equal(defaultPlanFeatures.ownership.advancedCustomization, true);
  assert.equal(defaultPlanFeatures.ownership.anyLanguageLocalization, true);
});

test("theme access uses catalogue order and enforces each package tier", () => {
  const basic = themes.filter((theme) => theme.tier === "basic").map((theme) => theme.key);
  const nonBasicForPro = [
    ...themes.filter((theme) => theme.tier === "premium"),
    ...themes.filter((theme) => theme.tier === "special"),
  ].map((theme) => theme.key).slice(0, 5);
  assert.deepEqual(getAccessibleThemeKeys("free", 0), basic);
  assert.deepEqual(getAccessibleThemeKeys("plus", 2), [...basic, ...themes.filter((theme) => theme.tier === "premium").map((theme) => theme.key).slice(0, 2)]);
  assert.deepEqual(getAccessibleThemeKeys("pro", 5), [...basic, ...nonBasicForPro]);
  assert.deepEqual(getAccessibleThemeKeys("ownership", null), [
    ...basic,
    ...themes.filter((theme) => theme.tier === "premium").map((theme) => theme.key),
    ...themes.filter((theme) => theme.tier === "special").map((theme) => theme.key),
  ]);
});
