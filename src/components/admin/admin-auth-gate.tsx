"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import {
  BadgeDollarSign,
  HelpCircle,
  Languages,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Megaphone,
  MessageCircle,
  Palette,
  Search,
  Settings,
  ShieldAlert,
  Tags,
  UsersRound,
  Wand2,
  Wrench
} from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";
import { adminSessionStorageKey, adminSidebarStorageKey } from "@/lib/admin-session";

const adminNav: DashboardNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Landing", href: "/admin/landing", icon: Wand2 },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Themes", href: "/admin/themes", icon: Palette },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Moderation", href: "/admin/moderation", icon: ShieldAlert },
  { label: "Features", href: "/admin/features", icon: Wrench },
  { label: "Packages", href: "/admin/packages", icon: BadgeDollarSign },
  { label: "Coupons", href: "/admin/coupons", icon: Tags },
  { label: "Translations", href: "/admin/translations", icon: Languages },
  { label: "Customers", href: "/admin/customers", icon: UsersRound },
  { label: "Messages", href: "/admin/messages", icon: MessageCircle },
  { label: "Email Config", href: "/admin/emails", icon: Mail },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
  { label: "App Config", href: "/admin/settings", icon: Settings }
];

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const nextAuthed = localStorage.getItem(adminSessionStorageKey) === "true";

    setIsAuthed(nextAuthed);
    setIsReady(true);

    if (!nextAuthed && !isLoginPage) {
      router.replace("/admin/login" as Route);
    }

    if (nextAuthed && isLoginPage) {
      router.replace("/admin" as Route);
    }
  }, [isLoginPage, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Checking admin access...
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Redirecting to admin login...
      </div>
    );
  }

  return (
    <DashboardShell
      brand={{ label: "Photaaz", subtitle: "Super Admin", href: "/admin", mark: "P" }}
      nav={adminNav}
      storageKey={adminSidebarStorageKey}
      activeRootHref="/admin"
      badge="Dashboard"
      logout={{
        label: "Logout",
        title: "Logout?",
        body: "You will be signed out of the super admin dashboard.",
        confirmLabel: "Logout",
        onClick: () => {
          localStorage.removeItem(adminSessionStorageKey);
          router.replace("/admin/login" as Route);
        }
      }}
    >
      {children}
    </DashboardShell>
  );
}
