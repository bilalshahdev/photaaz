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
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Summer Wedding",
        location: "Islamabad",
        image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Editorial Portraits",
        location: "Studio",
        image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Golden Hour",
        location: "Outdoor",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "minimal-demo": {
    studioName: "Aira & Co.",
    specialty: "Wedding and lifestyle photography",
    tagline: "Soft daylight stories, calm gallery pages, and a portfolio that lets the images breathe.",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Morning Vows",
        location: "Islamabad",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Home Session",
        location: "DHA",
        image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Soft Portraits",
        location: "Studio",
        image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "editorial-demo": {
    studioName: "Northline Archive",
    specialty: "Editorial and campaign photography",
    tagline: "Magazine-led pages for campaigns, cover stories, lookbooks, and visual essays.",
    heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Cover Story",
        location: "Karachi",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Studio Notes",
        location: "Studio",
        image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Campaign Issue",
        location: "Lahore",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "cinematic-demo": {
    studioName: "Noor Frames",
    specialty: "Travel and documentary photography",
    tagline: "Dark, immersive sequences for moody landscapes, street work, and visual journeys.",
    heroImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Road North",
        location: "Hunza",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Blue Hour",
        location: "Istanbul",
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Last Light",
        location: "Sunset",
        image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "masonry-demo": {
    studioName: "Frame Index",
    specialty: "Portrait and archive photography",
    tagline: "A fast visual archive for many shoots, faces, categories, and image-led stories.",
    heroImage: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Portrait Index",
        location: "Studio",
        image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Model Tests",
        location: "Raw Studio",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Location Set",
        location: "Margalla",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "luxury-demo": {
    studioName: "Maison Riva",
    specialty: "Luxury weddings and fashion",
    tagline: "A boutique portfolio with refined spacing, polished galleries, and a premium booking path.",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Atelier Wedding",
        location: "Florence",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Fine Details",
        location: "Villa",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Fashion Portraits",
        location: "Studio",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "monochrome-demo": {
    studioName: "Monogram Works",
    specialty: "Fine-art black-and-white photography",
    tagline: "A restrained gallery experience for portraits, shadows, quiet detail, and print-led collections.",
    heroImage: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Shadow Study",
        location: "Studio",
        image: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Quiet Portraits",
        location: "Gallery Room",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Street Lines",
        location: "Old City",
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  "panorama-demo": {
    studioName: "Horizon Field",
    specialty: "Landscape and travel photography",
    tagline: "Wide visual journeys for mountain routes, remote valleys, open roads, and outdoor collections.",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "High Valley",
        location: "North",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=84"
      },
      {
        title: "Open Road",
        location: "Skardu",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=84"
      },
      {
        title: "Coastal Air",
        location: "Makran",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=84"
      }
    ]
  },
  wedding: {
    studioName: "Ever Vows",
    specialty: "Wedding photography",
    tagline: "Elegant wedding stories with a soft editorial finish.",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Garden Ceremony",
        location: "Florence",
        image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Reception Details",
        location: "Villa",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Couple Portraits",
        location: "Sunset",
        image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  travel: {
    studioName: "Atlas Frames",
    specialty: "Travel photography",
    tagline: "Destination stories, visual journals, and cinematic landscapes.",
    heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Mountain Roads",
        location: "North",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "City Notes",
        location: "Istanbul",
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Coastal Light",
        location: "Portugal",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  nature: {
    studioName: "Wild Still",
    specialty: "Nature photography",
    tagline: "Quiet landscapes, natural details, and immersive outdoor collections.",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Forest Studies",
        location: "Pine Valley",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Misty Peaks",
        location: "Highlands",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Wild Bloom",
        location: "Meadow",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=84"
      }
    ]
  },
  street: {
    studioName: "Street Index",
    specialty: "Street photography",
    tagline: "Graphic city frames, movement, contrast, and human moments.",
    heroImage: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=85",
    galleries: [
      {
        title: "Night Walks",
        location: "Tokyo",
        image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Crossings",
        location: "New York",
        image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=84"
      },
      {
        title: "Metro Faces",
        location: "Paris",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=84"
      }
    ]
  }
};
