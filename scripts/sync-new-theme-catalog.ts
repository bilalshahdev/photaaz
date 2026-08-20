import { prisma } from "../src/lib/db/prisma";
import { themeShowcases } from "../src/data/marketing";
import { newThemeKeys } from "../src/lib/new-themes";

const locales = ["en", "ur", "es", "ar", "hi", "tr", "pt", "de", "fr"];
const localized = (value: string) =>
  Object.fromEntries(locales.map((locale) => [locale, value]));
const localizedList = (value: string[]) =>
  Object.fromEntries(locales.map((locale) => [locale, value]));

async function main() {
  const newThemes = themeShowcases.filter((theme) =>
    newThemeKeys.includes(theme.slug as (typeof newThemeKeys)[number]),
  );
  const existingCount = await prisma.platformTheme.count();
  for (const [index, theme] of newThemes.entries()) {
    const data = {
      name: theme.name,
      nameI18n: localized(theme.name),
      description: theme.description,
      descriptionI18n: localized(theme.description),
      image: theme.image,
      features: theme.features,
      featuresI18n: localizedList(theme.features),
      iconKey: theme.slug,
      enabled: true,
      premium: theme.tier === "premium",
      demoPath: `/themes/${theme.slug}/demo`,
      displayOrder: existingCount + index + 1,
      seoTitle: `${theme.name} Photography Website Theme - Photaaz`,
      seoTitleI18n: localized(
        `${theme.name} Photography Website Theme - Photaaz`,
      ),
      seoDescription: theme.description,
      seoDescriptionI18n: localized(theme.description),
    };
    await prisma.platformTheme.upsert({
      where: { slug: theme.slug },
      update: data,
      create: { slug: theme.slug, customization: {}, ...data },
    });
  }
  console.log(`Synchronized ${newThemes.length} brand-new themes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
