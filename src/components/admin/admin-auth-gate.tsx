"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { adminSessionStorageKey, adminSidebarStorageKey } from "@/lib/admin-session";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const nextAuthed = localStorage.getItem(adminSessionStorageKey) === "true";
    const nextCollapsed = localStorage.getItem(adminSidebarStorageKey) === "true";

    setIsAuthed(nextAuthed);
    setIsCollapsed(nextCollapsed);
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

  function toggleSidebar() {
    setIsCollapsed((current) => {
      const nextValue = !current;

      localStorage.setItem(adminSidebarStorageKey, String(nextValue));

      return nextValue;
    });
  }

  return (
    <>
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <div className={isCollapsed ? "lg:pl-20" : "lg:pl-72"}>{children}</div>
    </>
  );
}
