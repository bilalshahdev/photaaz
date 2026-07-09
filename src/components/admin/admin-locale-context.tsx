"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminLocaleOption } from "@/components/admin/localized-fields";

type AdminLocaleContextValue = {
  activeLocale: string;
  setActiveLocale: (code: string) => void;
  locales: AdminLocaleOption[];
};

const AdminLocaleCtx = createContext<AdminLocaleContextValue | null>(null);

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleCtx);
  if (!ctx) return null;
  return ctx;
}

export function AdminLocaleProvider({ locales, children }: { locales: AdminLocaleOption[]; children: ReactNode }) {
  const [activeLocale, setActiveLocale] = useState(locales[0]?.code ?? "en");

  return (
    <AdminLocaleCtx.Provider value={{ activeLocale, setActiveLocale, locales }}>
      {children}
    </AdminLocaleCtx.Provider>
  );
}

export function AdminLocaleSelector() {
  const ctx = useAdminLocale();
  if (!ctx || ctx.locales.length <= 1) return null;

  const active = ctx.locales.find((l) => l.code === ctx.activeLocale);

  return (
    <div className="flex items-center gap-2">
      <Languages className="size-3.5 text-slate-400" aria-hidden="true" />
      <Select value={ctx.activeLocale} onValueChange={ctx.setActiveLocale}>
        <SelectTrigger className="h-8 w-40 border-slate-200 bg-white text-xs font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ctx.locales.map((l) => (
            <SelectItem key={l.code} value={l.code} className="text-xs">
              {l.code.toUpperCase()} — {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {active && active.direction === "rtl" && (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">RTL</span>
      )}
    </div>
  );
}
