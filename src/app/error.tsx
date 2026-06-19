"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-lg border bg-card p-6 text-center">
        <h1 className="font-display text-3xl font-black tracking-[-0.04em]">Something needs attention</h1>
        <p className="mt-3 text-muted-foreground">
          The page could not finish loading. Try again, or return to the dashboard.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
