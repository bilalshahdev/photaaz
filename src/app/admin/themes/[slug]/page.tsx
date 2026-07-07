import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ThemeDetailEditor } from "@/components/admin/themes-editor";
import { Button } from "@/components/ui/button";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getPlatformTheme } from "@/services/platform/platform-data";

type AdminThemeDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminThemeDetailPage({ params }: AdminThemeDetailPageProps) {
  const { slug } = await params;
  const [theme, locales] = await Promise.all([getPlatformTheme(slug), getTranslationLocaleConfig()]);

  if (!theme) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="mb-5">
          <Button asChild variant="outline" className="rounded-none border-slate-300 bg-white">
            <Link href={"/admin/themes" as Route}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to themes
            </Link>
          </Button>
        </div>
        <AdminPageHeader eyebrow="Theme" title="Edit theme details." body="Manage copy, SEO, demo route, visibility, premium status, and customization gates for this theme." />
        <ThemeDetailEditor initialTheme={theme} locales={locales.filter((locale) => locale.enabled)} />
      </div>
    </main>
  );
}
