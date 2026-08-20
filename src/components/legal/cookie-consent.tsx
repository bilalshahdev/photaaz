"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

const storageKey = "photaaz-cookie-consent-v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(!localStorage.getItem(storageKey)), []);
  if (!visible) return null;

  function choose(optional: boolean) {
    localStorage.setItem(storageKey, JSON.stringify({ necessary: true, optional, updatedAt: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent("photaaz:cookie-consent", { detail: { optional } }));
    setVisible(false);
  }

  return (
    <aside aria-label="Cookie preferences" className="fixed inset-x-3 bottom-3 z-[10000] mx-auto max-w-3xl border border-slate-300 bg-white p-4 text-slate-900 shadow-2xl sm:flex sm:items-center sm:gap-5">
      <p className="text-sm leading-6">We use necessary cookies for login, security, and language preferences. Optional analytics remain off unless you accept them. <Link className="underline" href={"/legal/cookies" as Route}>Cookie Policy</Link></p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button type="button" onClick={() => choose(false)} className="border border-slate-400 px-3 py-2 text-xs font-semibold">Reject optional</button>
        <button type="button" onClick={() => choose(true)} className="bg-slate-950 px-3 py-2 text-xs font-semibold text-white">Accept optional</button>
      </div>
    </aside>
  );
}
