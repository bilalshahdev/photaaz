import { themeShowcases } from "@/data/marketing";

export type ManagedPhotographyType = {
  name: string;
  slug: string;
  image: string;
  parentSlug?: string | null;
  enabled: boolean;
  categorySeed: boolean;
};

export const managedPhotographyTypes: ManagedPhotographyType[] = [
  // Parent categories
  {
    name: "Events",
    slug: "events",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=82",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Portrait",
    slug: "portrait",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=82",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Nature & Landscape",
    slug: "nature",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=82",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=82",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Commercial",
    slug: "commercial",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=82",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Street",
    slug: "street",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=82",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Food",
    slug: "food",
    image:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=900&q=82",
    enabled: false,
    categorySeed: true,
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=82",
    enabled: false,
    categorySeed: true,
  },
  {
    name: "Sports",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-bd45ba688b3f?auto=format&fit=crop&w=900&q=82",
    enabled: false,
    categorySeed: true,
  },

  // Events subcategories (Wedding is an event type)
  {
    name: "Wedding",
    slug: "events-wedding",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82",
    parentSlug: "events",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Corporate",
    slug: "events-corporate",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=82",
    parentSlug: "events",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Birthday",
    slug: "events-birthday",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=82",
    parentSlug: "events",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Graduation",
    slug: "events-graduation",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=82",
    parentSlug: "events",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Concert",
    slug: "events-concert",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=82",
    parentSlug: "events",
    enabled: true,
    categorySeed: true,
  },

  // Portrait subcategories
  {
    name: "Family",
    slug: "portrait-family",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=82",
    parentSlug: "portrait",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Maternity",
    slug: "portrait-maternity",
    image:
      "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=900&q=82",
    parentSlug: "portrait",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Newborn",
    slug: "portrait-newborn",
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=82",
    parentSlug: "portrait",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Headshots",
    slug: "portrait-headshots",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=82",
    parentSlug: "portrait",
    enabled: true,
    categorySeed: true,
  },

  // Nature & Landscape subcategories
  {
    name: "Landscapes",
    slug: "nature-landscapes",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=82",
    parentSlug: "nature",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Wildlife",
    slug: "nature-wildlife",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=82",
    parentSlug: "nature",
    enabled: true,
    categorySeed: true,
  },
  {
    name: "Macro",
    slug: "nature-macro",
    image:
      "https://images.unsplash.com/photo-1550159930-40066082a4fc?auto=format&fit=crop&w=900&q=82",
    parentSlug: "nature",
    enabled: true,
    categorySeed: true,
  },
];

export const managedThemes = themeShowcases.map((theme) => ({
  ...theme,
  enabled: true,
  premium: theme.tier === "premium",
  demoPath: `/themes/${theme.slug}/demo`,
}));

export const supportRequests = [
  {
    id: "SUP-1001",
    name: "Ayesha Studio",
    email: "hello@ayeshastudio.com",
    topic: "Domain setup",
    status: "Open",
    message: "Need help connecting my custom domain before publishing.",
  },
  {
    id: "SUP-1002",
    name: "Bilal Photography",
    email: "bilal@example.com",
    topic: "Theme question",
    status: "Pending",
    message: "Can I start with Cinematic but use a light gallery page?",
  },
];

export const adminCredentials = {
  email: "photaaz@admin.com",
  password: "admin@123",
} as const;
