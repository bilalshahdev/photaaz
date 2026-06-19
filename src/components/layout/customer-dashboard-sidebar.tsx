import Link from "next/link";
import type { Route } from "next";
import { BookOpenText, Brush, Globe2, Images, LayoutDashboard, Settings } from "lucide-react";
import { customerDashboardPath } from "@/config/routes";

type CustomerDashboardSidebarProps = {
  slug: string;
  name?: string;
};

export function CustomerDashboardSidebar({ slug, name = "Studio" }: CustomerDashboardSidebarProps) {
  const nav = [
    { label: "Overview", href: customerDashboardPath(slug), icon: LayoutDashboard },
    { label: "Galleries", href: customerDashboardPath(slug, "/galleries"), icon: Images },
    { label: "Blogs", href: customerDashboardPath(slug, "/blogs"), icon: BookOpenText },
    { label: "Theme", href: customerDashboardPath(slug, "/theme"), icon: Brush },
    { label: "Domain", href: customerDashboardPath(slug, "/domain"), icon: Globe2 },
    { label: "Settings", href: customerDashboardPath(slug, "/settings"), icon: Settings }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <Link href={customerDashboardPath(slug)} className="block rounded-lg px-2">
        <p className="truncate font-display text-2xl font-black tracking-[-0.04em]">{name}</p>
        <p className="text-sm text-slate-500">/{slug}</p>
      </Link>
      <nav className="mt-8 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href as Route} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
