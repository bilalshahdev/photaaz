import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  assertCanCreateWithinLimit,
  assertResultingCountWithinLimit,
  canCreateWithinLimit,
} from "../../src/services/subscription/limit-policy";

const expectedLimits = {
  free: [3, 50, 1, 20, 3, 3, 3, 20, 0, 0],
  plus: [10, 300, 3, 50, 10, 5, 10, 50, 2, 5],
  pro: [50, 5000, 5, 500, 20, 10, 50, 500, 5, 20],
  ownership: [null, null, null, null, null, null, null, null, null, null],
} as const;

test("every finite plan boundary accepts the last slot and rejects one more", () => {
  for (const [plan, limits] of Object.entries(expectedLimits)) {
    for (const limit of limits) {
      if (limit === null) {
        assert.equal(canCreateWithinLimit(100_000, limit), true, plan);
        continue;
      }
      if (limit > 0) {
        assert.doesNotThrow(() => assertCanCreateWithinLimit(limit - 1, limit, "record"), `${plan} must allow L-1`);
      }
      assert.throws(() => assertCanCreateWithinLimit(limit, limit, "record"), /Your plan allows/, `${plan} must reject L`);
    }
  }
});

test("resulting-count boundaries allow exactly L but reject L+1", () => {
  for (const limits of Object.values(expectedLimits)) {
    for (const limit of limits) {
      if (limit === null) {
        assert.doesNotThrow(() => assertResultingCountWithinLimit(100_000, limit, "record"));
      } else {
        assert.doesNotThrow(() => assertResultingCountWithinLimit(limit, limit, "record"));
        assert.throws(() => assertResultingCountWithinLimit(limit + 1, limit, "record"), /Your plan allows/);
      }
    }
  }
});

test("invalid counts fail closed", () => {
  for (const count of [-1, 1.5, Number.NaN]) {
    assert.throws(() => assertCanCreateWithinLimit(count, 5, "record"), /non-negative integers/);
  }
});

test("all server create paths enforce their relevant plan boundary", () => {
  const root = process.cwd();
  const cases = [
    ["src/actions/customer-blog-actions.ts", "assertBlogCreateLimit"],
    ["src/actions/customer-gallery-actions.ts", "assertGalleryCreateLimit"],
    ["src/actions/customer-category-actions.ts", "assertCategoryLinkLimit"],
    ["src/app/site/[slug]/dashboard/galleries/photo-actions.ts", "assertPhotoUploadLimits"],
    ["src/app/site/[slug]/dashboard/galleries/photo-actions.ts", "assertGalleryPhotoLimit"],
    ["src/app/site/[slug]/dashboard/galleries/photo-actions.ts", "assertCategoryRequestLimit"],
    ["src/actions/customer-settings-actions.ts", "heroImageLimit"],
    ["src/actions/customer-settings-actions.ts", "canPlanUseThemeWithLimit"],
  ] as const;
  for (const [file, guard] of cases) {
    assert.match(readFileSync(path.join(root, file), "utf8"), new RegExp(guard), `${file} must enforce ${guard}`);
  }
});

test("photo reassignment enforces category and gallery limits without counting itself", () => {
  const source = readFileSync(path.join(process.cwd(), "src/app/site/[slug]/dashboard/galleries/photo-actions.ts"), "utf8");
  assert.match(source, /assertPhotoCategoryLimit\([\s\S]*parsed\.photoId/);
  assert.match(source, /assertGalleryPhotoLimit\(parsed\.tenantSlug,[\s\S]*parsed\.photoId/);
});

test("downgrade-safe hero saves do not trim retained image references", () => {
  const source = readFileSync(path.join(process.cwd(), "src/actions/customer-settings-actions.ts"), "utf8");
  assert.doesNotMatch(source, /trimToLimit\(/);
  assert.match(source, /heroImageFiles\.length \+ directHeroImages\.length > 0/);
});
