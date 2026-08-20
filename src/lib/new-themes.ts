export const newThemeKeys = [
  "relay",
  "fieldbook",
  "kaleido",
  "proscenium",
  "cartograph",
  "vitrine",
] as const;

export type NewThemeKey = (typeof newThemeKeys)[number];

export function isNewThemeKey(
  value: string | null | undefined,
): value is NewThemeKey {
  return Boolean(value && newThemeKeys.includes(value as NewThemeKey));
}

export function resolveNewThemeKey(
  themeKey: string | null | undefined,
  slug?: string,
): NewThemeKey | undefined {
  if (isNewThemeKey(themeKey)) return themeKey;
  return newThemeKeys.find((key) => slug === key || slug?.startsWith(`${key}-`));
}
