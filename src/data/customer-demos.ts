export const customerDemos: Record<
  string,
  {
    studioName: string;
    themeKey?: string;
    specialty: string;
    tagline: string;
    heroImage: string;
    galleries: Array<{ title: string; location: string; image: string }>;
  }
> = {
  demo: {
    studioName: "Demo Photography",
    specialty: "Wedding and editorial photography",
    tagline: "Warm, intentional stories for couples and creative brands.",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Summer Wedding",
        location: "Islamabad",
        image:
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Editorial Portraits",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Golden Hour",
        location: "Outdoor",
        image:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "minimal-demo": {
    studioName: "Aira & Co.",
    specialty: "Wedding and lifestyle photography",
    tagline:
      "Soft daylight stories, calm gallery pages, and a portfolio that lets the images breathe.",
    heroImage:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Morning Vows",
        location: "Islamabad",
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Home Session",
        location: "DHA",
        image:
          "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Soft Portraits",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "editorial-demo": {
    studioName: "Northline Archive",
    specialty: "Editorial and campaign photography",
    tagline:
      "Magazine-led pages for campaigns, cover stories, lookbooks, and visual essays.",
    heroImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Cover Story",
        location: "Karachi",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Studio Notes",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Campaign Issue",
        location: "Lahore",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "cinematic-demo": {
    studioName: "Noor Frames",
    specialty: "Travel and documentary photography",
    tagline:
      "Dark, immersive sequences for moody landscapes, street work, and visual journeys.",
    heroImage:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Road North",
        location: "Hunza",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Blue Hour",
        location: "Istanbul",
        image:
          "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Last Light",
        location: "Sunset",
        image:
          "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "masonry-demo": {
    studioName: "Frame Index",
    specialty: "Portrait and archive photography",
    tagline:
      "A fast visual archive for many shoots, faces, categories, and image-led stories.",
    heroImage:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Portrait Index",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Model Tests",
        location: "Raw Studio",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Location Set",
        location: "Margalla",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "luxury-demo": {
    studioName: "Maison Riva",
    specialty: "Luxury weddings and fashion",
    tagline:
      "A boutique portfolio with refined spacing, polished galleries, and a premium booking path.",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Atelier Wedding",
        location: "Florence",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Fine Details",
        location: "Villa",
        image:
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Fashion Portraits",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "monochrome-demo": {
    studioName: "Monogram Works",
    specialty: "Fine-art black-and-white photography",
    tagline:
      "A restrained gallery experience for portraits, shadows, quiet detail, and print-led collections.",
    heroImage:
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Shadow Study",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Quiet Portraits",
        location: "Gallery Room",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Street Lines",
        location: "Old City",
        image:
          "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
  "panorama-demo": {
    studioName: "Horizon Field",
    specialty: "Landscape and travel photography",
    tagline:
      "Wide visual journeys for mountain routes, remote valleys, open roads, and outdoor collections.",
    heroImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "High Valley",
        location: "North",
        image:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=84",
      },
      {
        title: "Open Road",
        location: "Skardu",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=84",
      },
      {
        title: "Coastal Air",
        location: "Makran",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=84",
      },
    ],
  },
  "velvet-demo": {
    studioName: "Rouge House",
    themeKey: "velvet",
    specialty: "Fashion and luxury portraiture",
    tagline:
      "After-dark elegance, sculpted light, and fashion stories with a cinematic pulse.",
    heroImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Crimson Hour",
        location: "Paris",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Backstage",
        location: "Fashion Week",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=84",
      },
      {
        title: "Midnight Skin",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=84",
      },
    ],
  },
};

Object.assign(customerDemos, {
  "relay-demo": {
    studioName: "Northbound Relay",
    themeKey: "relay",
    specialty: "People, motion, and commissioned stories",
    tagline:
      "Photographic dispatches passed from one place, person, and moment to the next.",
    heroImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Night Shift",
        location: "Tokyo",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Open Road",
        location: "Balochistan",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "After Image",
        location: "Studio 04",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
      },
    ],
  },
  "fieldbook-demo": {
    studioName: "Mara Field Notes",
    themeKey: "fieldbook",
    specialty: "Documentary and environmental portraiture",
    tagline:
      "Observed lives, working landscapes, and the small evidence a place leaves behind.",
    heroImage:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "River People",
        location: "Sindh",
        image:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "High Pastures",
        location: "Gilgit",
        image:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Workshop Light",
        location: "Lahore",
        image:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85",
      },
    ],
  },
  "kaleido-demo": {
    studioName: "Odd Sunday",
    themeKey: "kaleido",
    specialty: "Color, culture, and playful portraiture",
    tagline:
      "Bright portraits and visual collisions for people who refuse to disappear into the background.",
    heroImage:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Color Club",
        location: "Karachi",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Soft Geometry",
        location: "Studio",
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Playground",
        location: "Islamabad",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
      },
    ],
  },
  "proscenium-demo": {
    studioName: "The Still Stage",
    themeKey: "proscenium",
    specialty: "Performance, music, and cinematic portraiture",
    tagline:
      "Every body enters the light with a story; every photograph holds the stage after the curtain falls.",
    heroImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Act of Light",
        location: "Theater",
        image:
          "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Backstage",
        location: "London",
        image:
          "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Encore",
        location: "Live",
        image:
          "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85",
      },
    ],
  },
  "cartograph-demo": {
    studioName: "Elsewhere Atlas",
    themeKey: "cartograph",
    specialty: "Travel, terrain, and expedition photography",
    tagline:
      "Routes through unfamiliar ground, recorded as coordinates, encounters, and changing weather.",
    heroImage:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "North Line",
        location: "Karakoram",
        image:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Salt Route",
        location: "Makran",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Green Meridian",
        location: "Azores",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
      },
    ],
  },
  "vitrine-demo": {
    studioName: "Room Eleven",
    themeKey: "vitrine",
    specialty: "Fine portraiture and exhibition projects",
    tagline:
      "A changing exhibition of faces, spaces, and collected gestures presented one room at a time.",
    heroImage:
      "https://images.unsplash.com/photo-1561839561-b13bcfe95249?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "The Red Room",
        location: "Room 01",
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Studies in Blue",
        location: "Room 02",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
      },
      {
        title: "Quiet Objects",
        location: "Room 03",
        image:
          "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85",
      },
    ],
  },
});
