import { Camera, Feather, Gem, Grid3X3, Layers3 } from "lucide-react";

const themeIcons = {
  minimal: Feather,
  editorial: Layers3,
  cinematic: Camera,
  masonry: Grid3X3,
  luxury: Gem
} as const;

export function getThemeIcon(iconKey: string) {
  return themeIcons[iconKey as keyof typeof themeIcons] ?? Camera;
}
