import { ThemePreviewStudio } from "@/components/themes/theme-preview-studio";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";

type CustomerThemePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerThemePage({ params }: CustomerThemePageProps) {
  const { slug } = await params;
  const tenant = await getCustomerDashboardView(slug);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Theme Studio</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Preview and customize the customer site.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Theme previews belong inside the customer dashboard, where settings can be saved to that tenant.
          </p>
        </section>
        <ThemePreviewStudio initialThemeKey={tenant?.themeKey} />
      </div>
    </main>
  );
}
