"use client";

import { FallbackScreen } from "@/components/layout/fallback-screen";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <FallbackScreen
          eyebrow="Critical error"
          title="The app needs a clean reload."
          description="Photaaz could not recover this screen automatically. Try again, or return to the homepage."
          primaryLabel="Try again"
          onPrimaryAction={reset}
          secondaryLabel="Go home"
          secondaryHref="/"
        />
      </body>
    </html>
  );
}
