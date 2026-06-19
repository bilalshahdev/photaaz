import { z } from "zod";
import { isReservedSlug } from "@/config/reserved-slugs";

export const onboardingThemeSlugs = ["minimal", "editorial", "cinematic", "masonry", "luxury"] as const;
export const onboardingPhotographyTypes = ["wedding", "travel", "street", "nature", "fashion", "portrait"] as const;
export const onboardingPhotoModes = ["sample", "upload"] as const;

const themeSchema = z.custom<(typeof onboardingThemeSlugs)[number]>((value) => typeof value === "string" && onboardingThemeSlugs.includes(value as (typeof onboardingThemeSlugs)[number]), "Choose a theme.");
const photographyTypeSchema = z.custom<(typeof onboardingPhotographyTypes)[number]>((value) => typeof value === "string" && onboardingPhotographyTypes.includes(value as (typeof onboardingPhotographyTypes)[number]), "Choose a primary category.");
const photoModeSchema = z.custom<(typeof onboardingPhotoModes)[number]>((value) => typeof value === "string" && onboardingPhotoModes.includes(value as (typeof onboardingPhotoModes)[number]), "Choose how your first photos should start.");

export const onboardingSchema = z
  .object({
    theme: themeSchema,
    primaryType: photographyTypeSchema,
    categories: z
      .array(photographyTypeSchema)
      .min(1, "Choose at least one photography category.")
      .max(6, "Choose up to 6 photography categories."),
    subdomain: z
      .string()
      .min(3, "Subdomain must be at least 3 characters.")
      .max(40, "Subdomain must be 40 characters or less.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.")
      .refine((value) => !isReservedSlug(value), "This subdomain is reserved. Choose another one."),
    photoMode: photoModeSchema,
    studioName: z.string().trim().min(2, "Studio name must be at least 2 characters.").max(80, "Studio name must be 80 characters or less."),
    email: z.string().trim().email("Enter a valid email address.")
  })
  .refine((data) => data.categories.includes(data.primaryType), {
    path: ["primaryType"],
    message: "Primary category must be one of your selected categories."
  });

export type OnboardingDraft = z.infer<typeof onboardingSchema>;

export function validateOnboardingDraft(draft: unknown) {
  return onboardingSchema.safeParse(draft);
}

export function getOnboardingFieldErrors(draft: unknown) {
  const result = validateOnboardingDraft(draft);

  if (result.success) {
    return {};
  }

  return result.error.flatten().fieldErrors;
}

export function getOnboardingStepErrors(step: number, draft: unknown) {
  const fieldErrors = getOnboardingFieldErrors(draft);

  if (step === 0) {
    return fieldErrors.theme ?? [];
  }

  if (step === 1) {
    return [...(fieldErrors.primaryType ?? []), ...(fieldErrors.categories ?? [])];
  }

  if (step === 2) {
    return fieldErrors.subdomain ?? [];
  }

  if (step === 3) {
    return fieldErrors.photoMode ?? [];
  }

  if (step === 4) {
    return [...(fieldErrors.studioName ?? []), ...(fieldErrors.email ?? [])];
  }

  return Object.values(fieldErrors).flat().filter(Boolean);
}
