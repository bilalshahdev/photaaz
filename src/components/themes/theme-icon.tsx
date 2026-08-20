import {
  Aperture,
  Camera,
  Feather,
  Gem,
  Grid3X3,
  Layers3,
  Mountain,
  Route,
  NotebookPen,
  Shapes,
  Theater,
  Map,
  GalleryVerticalEnd,
} from "lucide-react";

const themeIcons = {
  minimal: Feather,
  editorial: Layers3,
  cinematic: Camera,
  masonry: Grid3X3,
  luxury: Gem,
  monochrome: Aperture,
  panorama: Mountain,
  velvet: Gem,
  relay: Route,
  fieldbook: NotebookPen,
  kaleido: Shapes,
  proscenium: Theater,
  cartograph: Map,
  vitrine: GalleryVerticalEnd,
} as const;

export function getThemeIcon(iconKey: string) {
  return themeIcons[iconKey as keyof typeof themeIcons] ?? Camera;
}
