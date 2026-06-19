import Link from "next/link";
import type { Route } from "next";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl font-black tracking-[-0.04em]">Page not found</h1>
        <p className="mt-3 text-muted-foreground">This portfolio page is unavailable or has not been published yet.</p>
        <Button asChild className="mt-6">
          <Link href={"/" as Route}>Go home</Link>
        </Button>
      </div>
    </main>
  );
}
