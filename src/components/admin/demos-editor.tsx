"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState, useTransition } from "react";
import { ExternalLink, Images, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-ui";
import { savePlatformThemes } from "@/app/admin/actions";
import type { PlatformThemeView } from "@/services/platform/platform-data";

export function DemosEditor({ initialThemes }: { initialThemes: PlatformThemeView[] }) {
  const [themes, setThemes] = useState(initialThemes);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePlatformThemes(themes);
        setMessage("Demo routes saved.");
      } catch {
        setMessage("Could not save demo routes. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel title="Theme Demo Mapping" icon={Images}>
      {message ? <div className="mb-4 border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{message}</div> : null}
      <div className="mb-5 flex justify-end">
        <Button type="button" onClick={save} disabled={isPending} className="rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
          <Save className="size-4" aria-hidden="true" />
          {isPending ? "Saving" : "Save demo routes"}
        </Button>
      </div>
      <div className="overflow-hidden border border-slate-200">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="p-4">Theme</th>
              <th className="p-4">Demo route</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {themes.map((theme) => (
              <tr key={theme.slug} className="border-t border-slate-200">
                <td className="p-4 font-semibold">{theme.name}</td>
                <td className="p-4">
                  <input value={theme.demoPath} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, demoPath: event.target.value } : item)))} className="h-9 w-full border border-slate-200 px-2 outline-none focus:border-teal-700" />
                </td>
                <td className="p-4">
                  <select value={theme.enabled ? "Live" : "Hidden"} onChange={(event) => setThemes((current) => current.map((item) => (item.slug === theme.slug ? { ...item, enabled: event.target.value === "Live" } : item)))} className="h-9 border border-slate-200 px-2 outline-none focus:border-teal-700">
                    <option>Live</option>
                    <option>Hidden</option>
                  </select>
                </td>
                <td className="p-4">
                  <Link href={theme.demoPath as Route} className="inline-flex items-center gap-2 font-semibold text-teal-700">
                    Open
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPanel>
  );
}
