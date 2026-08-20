import {
  Aperture,
  Camera,
  Feather,
  Gem,
  Globe2,
  Grid3X3,
  Images,
  Layers3,
  Mountain,
  PenLine,
  Search,
  Trees,
  Wand2,
} from "lucide-react";

export const themeShowcases = [
  {
    name: "Lumen",
    slug: "minimal",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=84",
    icon: Feather,
    features: [
      "Soft image-first hero",
      "Clean gallery index",
      "Quiet inquiry path",
    ],
    description:
      "A refined light portfolio for wedding, portrait, and lifestyle photographers who want calm presentation.",
  },
  {
    name: "Archive",
    slug: "editorial",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=84",
    icon: Layers3,
    features: [
      "Magazine-style rhythm",
      "Story-led sections",
      "Journal-ready typography",
    ],
    description:
      "A confident editorial layout for photographers who publish campaigns, stories, and visual essays.",
  },
  {
    name: "Noir",
    slug: "cinematic",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=84",
    icon: Camera,
    features: [
      "Dark full-bleed canvas",
      "Film-like gallery pacing",
      "High-contrast project pages",
    ],
    description:
      "An immersive dark theme for travel, street, and cinematic photographers with mood-heavy work.",
  },
  {
    name: "Contact Sheet",
    slug: "masonry",
    image:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1000&q=84",
    icon: Grid3X3,
    features: [
      "Dense visual browsing",
      "Mixed-aspect masonry",
      "Fast collection scanning",
    ],
    description:
      "A gallery-heavy theme for photographers with many categories, sets, and image-led archives.",
  },
  {
    name: "Atelier",
    slug: "luxury",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=84",
    icon: Gem,
    features: [
      "Boutique studio polish",
      "Elegant spacing",
      "Premium booking flow",
    ],
    description:
      "A high-end theme for wedding, fashion, and studio brands that need a more polished first impression.",
  },
  {
    name: "Monogram",
    slug: "monochrome",
    tier: "premium",
    image:
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1000&q=84",
    icon: Aperture,
    features: [
      "Fine-art monochrome layout",
      "Gallery-grade image viewer",
      "Collector-style categories",
    ],
    description:
      "A special premium theme for fine-art, portrait, and black-and-white photographers.",
  },
  {
    name: "Horizon",
    slug: "panorama",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=84",
    icon: Mountain,
    features: [
      "Wide panoramic stories",
      "Landscape-first gallery flow",
      "Route-based browsing",
    ],
    description:
      "A cinematic premium theme for landscape, travel, and outdoor photography portfolios.",
  },
  {
    name: "Velvet",
    slug: "velvet",
    tier: "premium",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=84",
    icon: Gem,
    features: [
      "Cinematic burgundy canvas",
      "Dramatic overlapping stories",
      "Luxury conversion path",
    ],
    description:
      "A dramatic premium portfolio for fashion, nightlife, and luxury portraiture.",
  },
  {
    name: "Relay",
    slug: "relay",
    tier: "basic",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=84",
    icon: Layers3,
    features: [
      "Numbered photographic relay",
      "Horizontal project lanes",
      "Dispatch-style pages",
    ],
    description:
      "A sequence-led portfolio that moves through projects like a visual relay rather than a conventional grid.",
  },
  {
    name: "Fieldbook",
    slug: "fieldbook",
    tier: "basic",
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1000&q=84",
    icon: PenLine,
    features: [
      "Annotated diptychs",
      "Field-note indexes",
      "Documentary dossier pages",
    ],
    description:
      "A tactile documentary notebook built around observations, captions, metadata, and image evidence.",
  },
  {
    name: "Kaleido",
    slug: "kaleido",
    tier: "basic",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=84",
    icon: Wand2,
    features: [
      "Central image aperture",
      "Color portal categories",
      "Shape-aware mosaic",
    ],
    description:
      "A playful graphic portfolio where images, colors, and category portals form a changing visual aperture.",
  },
  {
    name: "Proscenium",
    slug: "proscenium",
    tier: "premium",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=84",
    icon: Camera,
    features: [
      "Act-based storytelling",
      "Fixed photographic stage",
      "Program-note articles",
    ],
    description:
      "A premium theatrical experience that presents projects as acts, scenes, and curated stage moments.",
  },
  {
    name: "Cartograph",
    slug: "cartograph",
    tier: "premium",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=84",
    icon: Globe2,
    features: [
      "Route-based galleries",
      "Coordinate navigation",
      "Spatial story pacing",
    ],
    description:
      "A premium visual atlas that turns galleries into destinations and browsing into a mapped journey.",
  },
  {
    name: "Vitrine",
    slug: "vitrine",
    tier: "premium",
    image:
      "https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=1000&q=84",
    icon: Aperture,
    features: [
      "Room-based navigation",
      "Salon-wall galleries",
      "Exhibition catalogue pages",
    ],
    description:
      "A premium curatorial website organized as an exhibition of rooms, framed works, and catalogue essays.",
  },
];

export const benefitFeatures = [
  {
    title: "Showcase your work beautifully",
    body: "Create a portfolio that feels intentional, premium, and built around your photography.",
    icon: Images,
  },
  {
    title: "Present pages clearly",
    body: "Publish clean, structured pages and stories that make your work easy to browse and share.",
    icon: Search,
  },
  {
    title: "Connect your own domain",
    body: "Use a free subdomain first, then connect your professional domain when ready.",
    icon: Globe2,
  },
  {
    title: "Publish blogs and stories",
    body: "Share shoots, travel journals, behind-the-scenes notes, and updates from one place.",
    icon: PenLine,
  },
  {
    title: "Manage your portfolio content",
    body: "Keep galleries, pages, themes, contact details, and publishing settings together.",
    icon: Wand2,
  },
  {
    title: "Unlock more presentation options",
    body: "Start free and upgrade when you need more room, a custom domain, or premium themes.",
    icon: Trees,
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    monthlyPrice: 0,
    annualPrice: 0,
    lifetimePrice: null,
    description: "For starting a simple public portfolio.",
    features: [
      "Total photos (50)",
      "Photos per category (20)",
      "Categories (3)",
      "Subcategories per category (3)",
      "Galleries (3)",
      "Photos per gallery (20)",
      "3 blogs",
      "Basic themes",
      "Admin dashboard",
      "Responsive design",
    ],
  },
  {
    name: "Plus",
    price: "$19",
    monthlyPrice: 1900,
    annualPrice: 19000,
    lifetimePrice: null,
    description:
      "For photographers who need a custom domain, more content, and richer presentation controls.",
    features: [
      "Total photos (300)",
      "Photos per category (50)",
      "Categories (10)",
      "Subcategories per category (5)",
      "Galleries (10)",
      "Photos per gallery (50)",
      "10 blogs",
      "2 premium themes",
      "Custom domain",
      "Custom theme components",
    ],
    featured: true,
  },
  {
    name: "Pro",
    price: "$49",
    monthlyPrice: 4900,
    annualPrice: 49000,
    lifetimePrice: null,
    description:
      "For professional photographers who need large libraries, premium themes, and advanced portfolio capacity.",
    features: [
      "Total photos (5,000)",
      "Photos per category (500)",
      "Categories (20)",
      "Subcategories per category (10)",
      "Galleries (50)",
      "Photos per gallery (500)",
      "50 blogs",
      "5 premium themes",
      "Custom domain",
      "Custom theme components",
    ],
  },
  {
    name: "Ownership",
    price: "$1,490",
    monthlyPrice: null,
    annualPrice: null,
    lifetimePrice: 149000,
    description:
      "For customers who want to own their portfolio app permanently with larger freedom and setup support.",
    features: [
      "Unlimited photos",
      "Unlimited categories and subcategories",
      "Unlimited galleries",
      "Unlimited blogs",
      "Own the app permanently",
      "More customization",
      "Any language localization",
      "2 months free maintenance",
    ],
  },
];
