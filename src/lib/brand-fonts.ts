export const brandFontKeys = [
  "inter",
  "montserrat",
  "cormorant",
  "raleway",
  "whisper",
  "playfair",
  "poppins",
  "lato",
  "josefin",
  "garamond",
] as const;

export type BrandFont = (typeof brandFontKeys)[number];

export const brandFontLabels: Record<BrandFont, string> = {
  inter: "Inter",
  montserrat: "Montserrat",
  cormorant: "Cormorant Garamond",
  raleway: "Raleway",
  whisper: "Whisper",
  playfair: "Playfair Display",
  poppins: "Poppins",
  lato: "Lato",
  josefin: "Josefin Sans",
  garamond: "EB Garamond",
};

/** Maps each key to the CSS variable injected by next/font/google in layout.tsx */
export const brandFontVarMap: Record<BrandFont, string> = {
  inter: "var(--pf-font-inter)",
  montserrat: "var(--pf-font-montserrat)",
  cormorant: "var(--pf-font-cormorant)",
  raleway: "var(--pf-font-raleway)",
  whisper: "var(--pf-font-whisper)",
  playfair: "var(--pf-font-playfair)",
  poppins: "var(--pf-font-poppins)",
  lato: "var(--pf-font-lato)",
  josefin: "var(--pf-font-josefin)",
  garamond: "var(--pf-font-garamond)",
};

export const brandFontSizeKeys = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
export type BrandFontSize = (typeof brandFontSizeKeys)[number];

export const brandFontSizeLabels: Record<BrandFontSize, string> = {
  xs: "XS",
  sm: "SM",
  md: "MD",
  lg: "LG",
  xl: "XL",
  "2xl": "2XL",
};

/** Tailwind responsive classes for each brand font size (must be complete strings for Tailwind JIT) */
export const brandFontSizeClasses: Record<BrandFontSize, string> = {
  xs: "text-lg sm:text-xl md:text-2xl",
  sm: "text-xl sm:text-2xl md:text-3xl",
  md: "text-2xl sm:text-3xl md:text-4xl",
  lg: "text-3xl sm:text-4xl md:text-5xl",
  xl: "text-4xl sm:text-5xl md:text-6xl",
  "2xl": "text-5xl sm:text-6xl md:text-7xl",
};
