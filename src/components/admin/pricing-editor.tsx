"use client";

import { useState, useTransition } from "react";
import { BadgeDollarSign, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-ui";
import { savePricingPlans } from "@/app/admin/actions";
import type { PlatformPricingPlanView } from "@/services/platform/platform-data";

export function PricingEditor({ initialPlans }: { initialPlans: PlatformPricingPlanView[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePricingPlans(plans);
        setMessage("Pricing saved.");
      } catch {
        setMessage("Could not save pricing. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel title="Plan Catalog" icon={BadgeDollarSign}>
      {message ? <div className="mb-4 border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{message}</div> : null}
      <div className="mb-5 flex justify-end">
        <Button type="button" onClick={save} disabled={isPending} className="rounded-none bg-slate-950 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
          <Save className="size-4" aria-hidden="true" />
          {isPending ? "Saving" : "Save pricing"}
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <article key={plan.key} className={plan.featured ? "border-2 border-slate-950 bg-slate-950 p-5 text-white" : "border border-slate-200 bg-white p-5"}>
            <div className="grid gap-3">
              <input value={plan.name} onChange={(event) => setPlans((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)))} className="h-10 border border-slate-200 px-3 font-semibold text-slate-950 outline-none focus:border-teal-700" />
              <input value={plan.price} onChange={(event) => setPlans((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, price: event.target.value } : item)))} className="h-10 border border-slate-200 px-3 font-semibold text-slate-950 outline-none focus:border-teal-700" />
              <textarea value={plan.description} onChange={(event) => setPlans((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item)))} className="min-h-20 resize-y border border-slate-200 px-3 py-2 text-sm text-slate-950 outline-none focus:border-teal-700" />
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={plan.enabled} onChange={(event) => setPlans((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, enabled: event.target.checked } : item)))} />
                Enabled
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={plan.featured} onChange={(event) => setPlans((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, featured: event.target.checked } : item)))} />
                Featured
              </label>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-500" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AdminPanel>
  );
}
