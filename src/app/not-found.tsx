import { FallbackScreen } from "@/components/layout/fallback-screen";

export default function NotFound() {
  return (
    <FallbackScreen
      eyebrow="404"
      title="This frame is missing."
      description="The page may have moved, expired, or belongs to a portfolio that is not published yet."
      primaryLabel="Go home"
      primaryHref="/"
      secondaryLabel="View themes"
      secondaryHref="/themes"
    />
  );
}
