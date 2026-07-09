import type { Metadata } from "next";
import { AdminAuthGate } from "@/components/admin/admin-auth-gate";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";

export const metadata: Metadata = {
  title: "Admin - Photaaz",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locales = await getTranslationLocaleConfig();
  const enabledLocales = locales.filter((l) => l.enabled);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <AdminAuthGate enabledLocales={enabledLocales}>{children}</AdminAuthGate>
    </div>
  );
}
