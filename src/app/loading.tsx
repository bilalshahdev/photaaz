import { FallbackScreen } from "@/components/layout/fallback-screen";

export default function Loading() {
  return (
    <FallbackScreen
      eyebrow="Loading"
      title="Preparing the portfolio."
      description="We are lining up the latest portfolio content, theme settings, and visual assets."
      isLoading
    />
  );
}
