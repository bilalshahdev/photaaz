import { Aperture, Camera, Feather, Gem, Grid3X3, Layers3, Mountain } from "lucide-react";

const themeIcons = {
  minimal: Feather,
  editorial: Layers3,
  cinematic: Camera,
  masonry: Grid3X3,
  luxury: Gem,
  monochrome: Aperture,
  panorama: Mountain
} as const;

export function getThemeIcon(iconKey: string) {
  return themeIcons[iconKey as keyof typeof themeIcons] ?? Camera;
}
