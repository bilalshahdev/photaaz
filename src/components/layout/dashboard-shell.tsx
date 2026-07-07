"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { LogOut, Menu, PanelLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type DashboardShellProps = {
  children: React.ReactNode;
  brand: {
    label: string;
    subtitle: string;
    href: string;
    mark?: string;
  };
  nav: DashboardNavItem[];
  storageKey: string;
  activeRootHref: string;
  badge?: string;
  profile?: {
    href: string;
    label: string;
    mark?: string;
  };
  logout?: {
    label: string;
    onClick: () => void;
    title?: string;
    body?: string;
    confirmLabel?: string;
  };
};

export function DashboardShell({ children, brand, nav, storageKey, activeRootHref, badge = "Dashboard", profile, logout }: DashboardShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useDashboardCollapsed(storageKey);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  function toggleSidebar() {
    setIsCollapsed((current) => !current);
  }

  function renderNavItems({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
    return nav.map(({ label, href, icon: Icon }) => {
      const isActive = href === activeRootHref ? pathname === href : pathname.startsWith(href);
      const link = (
        <Link
          href={href as Route}
          onClick={onNavigate}
          className={cn(
            "flex h-9 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-medium transition-[width,height,padding,background-color,color] duration-200 ease-linear",
            collapsed && "!size-8 !p-2",
            isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          <span className={cn("truncate", collapsed && "hidden")}>{label}</span>
        </Link>
      );

      return (
        <li key={href}>
          {collapsed ? (
            <Tooltip content={label} side="right" className="w-full">
              {link}
            </Tooltip>
          ) : (
            link
          )}
        </li>
      );
    });
  }

  function renderLogout({ collapsed = false }: { collapsed?: boolean }) {
    if (!logout) return null;

    const button = (
      <button
        type="button"
        onClick={() => setIsLogoutOpen(true)}
        className={cn(
          "flex h-9 w-full items-center gap-2 overflow-hidden rounded-md bg-red-50 p-2 text-left text-sm font-medium text-red-700 transition-[width,height,padding,background-color,color] duration-200 ease-linear hover:bg-red-100",
          collapsed && "!size-8 !p-2"
        )}
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        <span className={cn("truncate", collapsed && "hidden")}>{logout.label}</span>
      </button>
    );

    return collapsed ? (
      <Tooltip content={logout.label} side="right" className="w-full">
        {button}
      </Tooltip>
    ) : (
      button
    );
  }

  return (
    <>
    <div className="fixed inset-0 flex overflow-hidden bg-slate-50">
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ease-out",
            isMobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        />
        <aside
          className={cn(
            "relative flex h-full w-[min(84vw,20rem)] flex-col border-r border-slate-200 bg-white shadow-[18px_0_70px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <DashboardBrand brand={brand} onNavigate={() => setIsMobileOpen(false)} />
          <div className="no-scrollbar flex min-h-0 flex-1 flex-col justify-between overflow-y-auto p-3">
            <nav>
              <ul className="grid gap-1.5">{renderNavItems({ onNavigate: () => setIsMobileOpen(false) })}</ul>
            </nav>
            <div className="pt-4">{renderLogout({})}</div>
          </div>
        </aside>
      </div>

      <div className="group/sidebar peer hidden text-slate-700 md:block" data-state={isCollapsed ? "collapsed" : "expanded"} data-collapsible={isCollapsed ? "icon" : ""}>
        <div className="relative h-screen w-64 bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=icon]/sidebar:w-12" />
        <div className="fixed inset-y-0 left-0 z-40 hidden h-screen w-64 transition-[width] duration-200 ease-linear md:flex group-data-[collapsible=icon]/sidebar:w-12">
          <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
            <DashboardBrand brand={brand} collapsed={isCollapsed} />
            <div className="no-scrollbar my-2 flex min-h-0 flex-1 flex-col justify-between overflow-y-auto group-data-[collapsible=icon]/sidebar:overflow-visible">
              <nav className="relative flex w-full min-w-0 flex-col p-2">
                <ul className="flex w-full min-w-0 flex-col gap-2">{renderNavItems({ collapsed: isCollapsed })}</ul>
              </nav>
              <div className="flex flex-col gap-2 p-2">{renderLogout({ collapsed: isCollapsed })}</div>
            </div>
          </aside>
        </div>
      </div>

      <div className="flex h-full min-w-0 flex-grow flex-col">
        <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 md:h-12">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setIsMobileOpen(true)} className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 md:hidden">
              <Menu className="size-5" aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </button>
            <button type="button" onClick={toggleSidebar} className="hidden size-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 md:inline-flex">
              <PanelLeft className="size-5" aria-hidden="true" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <div className="min-w-0 md:hidden">
              <p className="truncate text-sm font-semibold text-slate-950">{brand.label}</p>
              <p className="text-xs text-slate-500">{brand.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="rounded-full border border-slate-200 px-2.5 py-1">{badge}</span>
            {profile ? (
              <Link
                href={profile.href as Route}
                className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-slate-950 text-xs font-bold text-white transition hover:bg-teal-800"
                aria-label={profile.label}
              >
                {profile.mark ?? profile.label.slice(0, 1).toUpperCase()}
              </Link>
            ) : null}
          </div>
        </header>
        <div className="admin-scrollbar min-h-0 flex-grow overflow-auto bg-slate-50">{children}</div>
      </div>
    </div>
    {logout ? (
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{logout.title ?? logout.label}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-6 text-slate-600">
            {logout.body ?? "Are you sure you want to continue?"}
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsLogoutOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-slate-950 text-white hover:bg-teal-800"
              onClick={() => {
                setIsLogoutOpen(false);
                logout.onClick();
              }}
            >
              {logout.confirmLabel ?? logout.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : null}
    </>
  );
}

function DashboardBrand({ brand, collapsed = false, onNavigate }: { brand: DashboardShellProps["brand"]; collapsed?: boolean; onNavigate?: () => void }) {
  return (
    <div className="flex h-12 shrink-0 items-center border-b border-slate-200 p-2">
      <Link href={brand.href as Route} onClick={onNavigate} className="flex h-8 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-medium transition-[width,height,padding] hover:bg-slate-100 group-data-[collapsible=icon]/sidebar:!size-8 group-data-[collapsible=icon]/sidebar:!p-2">
        <span className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-slate-950 text-[0.65rem] font-bold text-white">{brand.mark ?? "P"}</span>
        <span className={cn("truncate text-lg font-semibold tracking-[-0.03em] text-slate-950", collapsed && "hidden")}>{brand.label}</span>
      </Link>
      {!collapsed && onNavigate ? (
        <button type="button" onClick={onNavigate} className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 md:hidden" aria-label="Close menu">
          <X className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function useDashboardCollapsed(storageKey: string) {
  const [isCollapsed, setIsCollapsedState] = React.useState(false);

  React.useEffect(() => {
    setIsCollapsedState(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function setIsCollapsed(value: (current: boolean) => boolean) {
    setIsCollapsedState((current) => {
      const nextValue = value(current);
      localStorage.setItem(storageKey, String(nextValue));
      return nextValue;
    });
  }

  return [isCollapsed, setIsCollapsed] as const;
}
