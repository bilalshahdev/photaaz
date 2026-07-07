import type { CustomerSiteThemeVariant } from "@/lib/customer-theme";

export type GalleryTaxonomyItem = {
  name: string;
  subcategories: string[];
};

export const customerGalleryTaxonomy: Record<CustomerSiteThemeVariant, GalleryTaxonomyItem[]> = {
  minimal: [
    { name: "Weddings", subcategories: ["Ceremony", "Couple portraits", "Details"] },
    { name: "Lifestyle", subcategories: ["Home sessions", "Natural light"] },
    { name: "Portraits", subcategories: ["Studio", "Editorial"] },
    { name: "Events", subcategories: [] },
    { name: "Travel", subcategories: ["City walks", "Weekend sets"] }
  ],
  editorial: [
    { name: "Campaigns", subcategories: ["Lookbooks", "Cover stories", "Brand sets"] },
    { name: "Portraits", subcategories: ["Studio notes", "Artist profiles"] },
    { name: "Stories", subcategories: ["Essays", "Field notes"] },
    { name: "Fashion", subcategories: ["Runway", "Editorial"] },
    { name: "Objects", subcategories: [] }
  ],
  cinematic: [
    { name: "Travel", subcategories: ["Mountains", "Road stories", "Coast"] },
    { name: "Street", subcategories: ["Night walks", "City frames"] },
    { name: "Documentary", subcategories: ["Sequences", "People"] },
    { name: "Landscape", subcategories: ["Valleys", "Desert"] },
    { name: "Personal", subcategories: [] }
  ],
  masonry: [
    { name: "Portraits", subcategories: ["Studio", "Model tests", "Personal work"] },
    { name: "Archive", subcategories: ["Recent", "Selected", "Contact sheets"] },
    { name: "Locations", subcategories: ["Outdoor", "Interiors"] },
    { name: "Editorial", subcategories: ["Faces", "Details"] },
    { name: "Experiments", subcategories: [] }
  ],
  luxury: [
    { name: "Weddings", subcategories: ["Ceremony", "Reception", "Details"] },
    { name: "Fashion", subcategories: ["Editorial", "Lookbook"] },
    { name: "Studio", subcategories: ["Portraits", "Fine details"] },
    { name: "Events", subcategories: ["Private", "Reception"] },
    { name: "Brand", subcategories: [] }
  ],
  monochrome: [
    { name: "Fine Art", subcategories: ["Black and white", "Series", "Prints"] },
    { name: "Portraits", subcategories: ["Character", "Studio", "Close work"] },
    { name: "Street", subcategories: ["Shadows", "Architecture"] },
    { name: "Objects", subcategories: ["Still life", "Texture"] },
    { name: "Archive", subcategories: [] }
  ],
  panorama: [
    { name: "Landscape", subcategories: ["Mountains", "Valleys", "Coast"] },
    { name: "Travel", subcategories: ["Routes", "Cities", "Remote"] },
    { name: "Nature", subcategories: ["Wild", "Seasonal"] },
    { name: "Roads", subcategories: ["Highways", "Passes"] },
    { name: "Aerial", subcategories: [] }
  ]
};

export function formatSubcategories(subcategories: string[]) {
  return subcategories.length ? subcategories.join(" / ") : "Direct gallery";
}
