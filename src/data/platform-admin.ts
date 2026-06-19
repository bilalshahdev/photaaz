import { pricingPlans, themeShowcases } from "@/data/marketing";

export type ManagedPhotographyType = {
  name: string;
  slug: string;
  parentSlug?: string | null;
  enabled: boolean;
  categorySeed: boolean;
};

export const managedPhotographyTypes: ManagedPhotographyType[] = [
  { name: "Wedding", slug: "wedding", enabled: true, categorySeed: true },
  { name: "Travel", slug: "travel", enabled: true, categorySeed: true },
  { name: "Street", slug: "street", enabled: true, categorySeed: true },
  { name: "Nature", slug: "nature", enabled: true, categorySeed: true },
  { name: "Wildlife", slug: "wildlife", enabled: true, categorySeed: true },
  { name: "Birds", slug: "wildlife-birds", parentSlug: "wildlife", enabled: true, categorySeed: true },
  { name: "Insects", slug: "wildlife-insects", parentSlug: "wildlife", enabled: true, categorySeed: true },
  { name: "Mammals", slug: "wildlife-mammals", parentSlug: "wildlife", enabled: true, categorySeed: true },
  { name: "Fashion", slug: "fashion", enabled: true, categorySeed: true },
  { name: "Portrait", slug: "portrait", enabled: true, categorySeed: true },
  { name: "Events", slug: "events", enabled: false, categorySeed: true }
];

export const managedThemes = themeShowcases.map((theme, index) => ({
  ...theme,
  enabled: true,
  premium: index > 1,
  demoPath: `/themes/${theme.slug}/demo`
}));

export const managedPricingPlans = pricingPlans.map((plan) => ({
  ...plan,
  enabled: true
}));

export const supportRequests = [
  {
    id: "SUP-1001",
    name: "Ayesha Studio",
    email: "hello@ayeshastudio.com",
    topic: "Domain setup",
    status: "Open",
    message: "Need help connecting my custom domain before publishing."
  },
  {
    id: "SUP-1002",
    name: "Bilal Photography",
    email: "bilal@example.com",
    topic: "Theme question",
    status: "Pending",
    message: "Can I start with Cinematic but use a light gallery page?"
  }
];

export const adminCredentials = {
  email: "photofolio@admin.com",
  password: "admin@123"
} as const;
