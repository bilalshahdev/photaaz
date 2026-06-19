import Image from "next/image";
import { Bell, Brush, Globe2, Images, RadioTower } from "lucide-react";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";

type CustomerDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

const modules = [
  { title: "Galleries", body: "Albums, categories, featured states, upload limits.", icon: Images },
  { title: "Theme", body: "Theme selection, colors, typography, navigation, gallery layout.", icon: Brush },
  { title: "Domain", body: "Free subdomain first, custom domain verification on paid plans.", icon: Globe2 },
  { title: "Publish", body: "SEO metadata, sitemap readiness, and public visibility.", icon: RadioTower }
];

export default async function CustomerDashboardPage({ params }: CustomerDashboardPageProps) {
  const { slug } = await params;
  const tenant = await getCustomerDashboardView(slug);
  const title = tenant?.name ?? `/${slug}`;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Customer Dashboard</p>
            <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Manage {title}</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Theme: {tenant?.themeKey ?? "minimal"} · Plan: {tenant?.planKey ?? "free"} · {tenant?.categoryCount ?? 0} categories · {tenant?.albumCount ?? 0} galleries · {tenant?.photoCount ?? 0} photos
            </p>
          </div>
          <div className="relative min-h-56 overflow-hidden rounded-lg bg-slate-900">
            <Image
              src={tenant?.heroImage ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85"}
              alt="Portfolio publish preview"
              fill
              className="object-cover opacity-78"
            />
          </div>
        </section>
        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map(({ title, body, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="size-6 text-teal-700" aria-hidden="true" />
              <h2 className="mt-8 font-display text-3xl font-black tracking-[-0.04em]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
            </article>
          ))}
        </section>
        {tenant?.notifications.length ? (
          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Bell className="size-5 text-teal-700" aria-hidden="true" />
              <h2 className="font-semibold">Messages from PhotoFolio</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {tenant.notifications.map((notification) => (
                <article key={notification.id} className="rounded-md border border-slate-200 p-4">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{notification.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">{notification.status}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
