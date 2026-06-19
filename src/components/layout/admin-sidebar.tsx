"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  Mail,
  Settings,
  Images,
  LayoutDashboard,
  LifeBuoy,
  Languages,
  LogOut,
  Megaphone,
  Palette,
  Tags,
  UsersRound,
  Wand2
} from "lucide-react";
import { adminSessionStorageKey } from "@/lib/admin-session";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Landing", href: "/admin/landing", icon: Wand2 },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Demos", href: "/admin/demos", icon: Images },
  { label: "Themes", href: "/admin/themes", icon: Palette },
  { label: "Focus Types", href: "/admin/focus-types", icon: Tags },
  { label: "Pricing", href: "/admin/pricing", icon: BadgeDollarSign },
  { label: "Packages", href: "/admin/packages", icon: BadgeDollarSign },
  { label: "Coupons", href: "/admin/coupons", icon: Tags },
  { label: "Translations", href: "/admin/translations", icon: Languages },
  { label: "Customers", href: "/admin/customers", icon: UsersRound },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
  { label: "App Config", href: "/admin/settings", icon: Settings }
];

type AdminSidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem(adminSessionStorageKey);
    router.replace("/admin/login" as Route);
  }

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white px-3 py-5 transition-[width] duration-200 lg:flex lg:flex-col ${isCollapsed ? "w-20" : "w-72"}`}>
      <div className="flex items-center justify-between gap-2">
        <Link href="/admin" className={`flex min-w-0 items-center gap-3 rounded-lg px-2 ${isCollapsed ? "justify-center" : ""}`}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">PF</span>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate font-semibold">PhotoFolio</p>
              <p className="truncate text-xs text-slate-500">Super Admin</p>
            </div>
          ) : null}
        </Link>
        <button type="button" onClick={onToggle} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-950" aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {isCollapsed ? <ChevronRight className="size-4" aria-hidden="true" /> : <ChevronLeft className="size-4" aria-hidden="true" />}
        </button>
      </div>

      <nav className="mt-8 space-y-1">
        {adminNav.map(({ label, href, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href as Route}
              title={isCollapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!isCollapsed ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700 ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          {!isCollapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </aside>
  );
}
