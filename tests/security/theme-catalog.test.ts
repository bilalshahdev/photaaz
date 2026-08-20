import assert from "node:assert/strict";
import test from "node:test";
import { getAccessibleThemeKeys, themes } from "../../src/config/themes";
import { customerDemos } from "../../src/data/customer-demos";
import { themeShowcases } from "../../src/data/marketing";

const rejectedThemes = [
  "breeze",
  "folio",
  "terra",
  "prism",
  "museum",
  "kinetic",
  "aurelia",
];

test("Velvet is the only retained theme from the rejected collection", () => {
  assert.equal(themes.find((theme) => theme.key === "velvet")?.tier, "premium");
  assert.equal(
    themeShowcases.find((theme) => theme.slug === "velvet")?.tier,
    "premium",
  );
  for (const slug of rejectedThemes) {
    assert.equal(
      themes.some((theme) => theme.key === slug),
      false,
    );
    assert.equal(
      themeShowcases.some((theme) => theme.slug === slug),
      false,
    );
  }
});

test("only Velvet retains a live demo from the rejected collection", () => {
  assert.equal(customerDemos["velvet-demo"]?.themeKey, "velvet");
  for (const slug of rejectedThemes)
    assert.equal(customerDemos[`${slug}-demo`], undefined);
});

test("the original catalogue remains intact and is not renamed by new themes", () => {
  const expected = {
    minimal: "Lumen",
    editorial: "Archive",
    masonry: "Contact Sheet",
    cinematic: "Noir",
    luxury: "Atelier",
    monochrome: "Monogram",
    panorama: "Horizon",
    velvet: "Velvet",
  } as const;

  for (const [key, name] of Object.entries(expected)) {
    assert.equal(themes.find((theme) => theme.key === key)?.name, name);
    assert.equal(
      themeShowcases.find((theme) => theme.slug === key)?.name,
      name,
    );
  }
});

test("the six brand-new themes have exactly three Basic and three Premium tiers", () => {
  const expected = {
    relay: ["Relay", "basic"],
    fieldbook: ["Fieldbook", "basic"],
    kaleido: ["Kaleido", "basic"],
    proscenium: ["Proscenium", "premium"],
    cartograph: ["Cartograph", "premium"],
    vitrine: ["Vitrine", "premium"],
  } as const;

  for (const [key, [name, tier]] of Object.entries(expected)) {
    const config = themes.find((theme) => theme.key === key);
    const showcase = themeShowcases.find((theme) => theme.slug === key);
    assert.equal(config?.name, name);
    assert.equal(config?.tier, tier);
    assert.equal(showcase?.name, name);
    assert.equal(showcase?.tier, tier);
    assert.equal(customerDemos[`${key}-demo`]?.themeKey, key);
  }
});

test("Free plans receive the three new Basic themes but not the new Premium trio", () => {
  const accessible = getAccessibleThemeKeys("free", 0);
  for (const key of ["relay", "fieldbook", "kaleido"] as const) {
    assert.equal(accessible.includes(key), true);
  }
  for (const key of ["proscenium", "cartograph", "vitrine"] as const) {
    assert.equal(accessible.includes(key), false);
  }
});
