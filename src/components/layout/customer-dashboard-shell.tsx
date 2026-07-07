"use client";

import { BookOpenText, Brush, CreditCard, FolderTree, Globe2, ImageIcon, Images, LayoutDashboard, LifeBuoy, MessageCircle, Settings, Tags, UserRound } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/dashboard-shell";
import { customerDashboardPath } from "@/config/routes";

type CustomerDashboardShellProps = {
  children: React.ReactNode;
  slug: string;
  name?: string;
};

export function CustomerDashboardShell({ children, slug, name = "Studio" }: CustomerDashboardShellProps) {
  const rootHref = customerDashboardPath(slug);
  const nav: DashboardNavItem[] = [
    { label: "Overview", href: rootHref, icon: LayoutDashboard },
    { label: "Categories", href: customerDashboardPath(slug, "/categories"), icon: FolderTree },
    { label: "Galleries", href: customerDashboardPath(slug, "/galleries"), icon: Images },
    { label: "Photos", href: customerDashboardPath(slug, "/photos"), icon: ImageIcon },
    { label: "Blogs", href: customerDashboardPath(slug, "/blogs"), icon: BookOpenText },
    { label: "Blog Categories", href: customerDashboardPath(slug, "/blog-categories"), icon: Tags },
    { label: "Support", href: customerDashboardPath(slug, "/support"), icon: LifeBuoy },
    { label: "Messages", href: customerDashboardPath(slug, "/messages"), icon: MessageCircle },
    { label: "Theme", href: customerDashboardPath(slug, "/theme"), icon: Brush },
    { label: "Subscription", href: customerDashboardPath(slug, "/package"), icon: CreditCard },
    { label: "Domain", href: customerDashboardPath(slug, "/domain"), icon: Globe2 },
    { label: "Profile", href: customerDashboardPath(slug, "/profile"), icon: UserRound },
    { label: "Settings", href: customerDashboardPath(slug, "/settings"), icon: Settings }
  ];

  return (
    <DashboardShell
      brand={{
        label: name,
        subtitle: `/${slug}`,
        href: rootHref,
        mark: name.slice(0, 1).toUpperCase()
      }}
      nav={nav}
      storageKey={`photaaz:customer-sidebar:${slug}`}
      activeRootHref={rootHref}
      badge="Customer Dashboard"
      profile={{
        href: customerDashboardPath(slug, "/profile"),
        label: "Profile",
        mark: name.slice(0, 1).toUpperCase()
      }}
      logout={{
        label: "Exit",
        title: "Exit dashboard?",
        body: "You will leave the customer dashboard and return to the public portfolio.",
        confirmLabel: "Exit dashboard",
        onClick: () => {
          window.location.href = `/site/${slug}`;
        }
      }}
    >
      {children}
    </DashboardShell>
  );
}
