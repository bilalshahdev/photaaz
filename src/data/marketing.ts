import { Camera, Feather, Gem, Globe2, Grid3X3, Images, Layers3, PenLine, Search, Trees, Wand2 } from "lucide-react";

export const themeShowcases = [
  {
    name: "Minimal",
    slug: "minimal",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=84",
    icon: Feather,
    features: ["Top navigation", "Large quiet hero", "Clean portfolio grid"],
    description: "A calm, image-first layout for photographers who want their work to breathe."
  },
  {
    name: "Editorial",
    slug: "editorial",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1000&q=84",
    icon: Layers3,
    features: ["Magazine rhythm", "Asymmetric sections", "Large typography"],
    description: "A magazine-inspired portfolio with stronger storytelling and visual pacing."
  },
  {
    name: "Cinematic",
    slug: "cinematic",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=84",
    icon: Camera,
    features: ["Dark immersive canvas", "Full-screen visuals", "Slow editorial pacing"],
    description: "A dramatic full-screen experience for moody, immersive photography."
  },
  {
    name: "Masonry",
    slug: "masonry",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=84",
    icon: Grid3X3,
    features: ["Pinterest-style gallery", "Image-first browsing", "Flexible collections"],
    description: "A dense gallery-led theme for photographers with many collections to explore."
  },
  {
    name: "Luxury",
    slug: "luxury",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=84",
    icon: Gem,
    features: ["Elegant spacing", "Premium typography", "Wedding and fashion friendly"],
    description: "An elegant premium theme for studios that need a high-end first impression."
  }
];

export const benefitFeatures = [
  {
    title: "Showcase your work beautifully",
    body: "Create a portfolio that feels intentional, premium, and built around your photography.",
    icon: Images
  },
  {
    title: "Present pages clearly",
    body: "Publish clean, structured pages and stories that make your work easy to browse and share.",
    icon: Search
  },
  {
    title: "Connect your own domain",
    body: "Use a free subdomain first, then connect your professional domain when ready.",
    icon: Globe2
  },
  {
    title: "Publish blogs and stories",
    body: "Share shoots, travel journals, behind-the-scenes notes, and updates from one place.",
    icon: PenLine
  },
  {
    title: "Manage your portfolio content",
    body: "Keep galleries, pages, themes, contact details, and publishing settings together.",
    icon: Wand2
  },
  {
    title: "Unlock more presentation options",
    body: "Start free and upgrade when you need more room, custom domains, or premium themes.",
    icon: Trees
  }
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "For starting a simple public portfolio.",
    features: ["Free subdomain", "Basic theme", "Limited galleries", "Limited photos", "Limited blogs"]
  },
  {
    name: "Pro",
    price: "$19",
    description: "For photographers who want more control over their public portfolio.",
    features: ["Custom domain", "More galleries", "Premium themes", "Page metadata controls", "Priority publishing tools"],
    featured: true
  },
  {
    name: "Studio",
    price: "$49",
    description: "For larger portfolios with more galleries, pages, and presentation needs.",
    features: ["Higher media limits", "Advanced themes", "Flexible publishing tools", "Portfolio-ready workflows", "Priority support"]
  }
];
