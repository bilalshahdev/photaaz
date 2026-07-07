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
  { name: "Wedding", slug: "wedding", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Travel", slug: "travel", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Street", slug: "street", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Nature", slug: "nature", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Wildlife", slug: "wildlife", image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Birds", slug: "wildlife-birds", image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=82", parentSlug: "wildlife", enabled: true, categorySeed: true },
  { name: "Insects", slug: "wildlife-insects", image: "https://images.unsplash.com/photo-1509967733342-437077d8e41a?auto=format&fit=crop&w=900&q=82", parentSlug: "wildlife", enabled: true, categorySeed: true },
  { name: "Mammals", slug: "wildlife-mammals", image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=82", parentSlug: "wildlife", enabled: true, categorySeed: true },
  { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Portrait", slug: "portrait", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=82", enabled: true, categorySeed: true },
  { name: "Events", slug: "events", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=82", enabled: false, categorySeed: true }
];

export const managedThemes = themeShowcases.map((theme, index) => ({
  ...theme,
  enabled: true,
  premium: index > 1,
  demoPath: `/themes/${theme.slug}/demo`
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
  email: "photaaz@admin.com",
  password: "admin@123"
} as const;
