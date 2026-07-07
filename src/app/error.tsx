"use client";

import { FallbackScreen } from "@/components/layout/fallback-screen";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FallbackScreen
      eyebrow="Error"
      title="Something needs attention."
      description="The page could not finish loading. Try again, or return to the Photaaz home screen."
      primaryLabel="Try again"
      onPrimaryAction={reset}
      secondaryLabel="Go home"
      secondaryHref="/"
    />
  );
}
