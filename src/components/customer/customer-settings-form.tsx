"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { updateCustomerSiteSettingsWithFeedback, type CustomerSettingsActionState } from "@/actions/customer-settings-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: CustomerSettingsActionState = {
  status: "idle",
  message: ""
};

export function CustomerSettingsForm({ children }: { children: ReactNode }) {
  const [state, formAction] = useActionState(updateCustomerSiteSettingsWithFeedback, initialState);

  return (
    <form action={formAction} className="mt-5 grid gap-5">
      {state.status !== "idle" ? (
        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm font-semibold",
            state.status === "success" ? "border-teal-200 bg-teal-50 text-teal-900" : "border-red-200 bg-red-50 text-red-900"
          )}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      ) : null}

      {children}

      <div className="order-last sticky bottom-4 z-20 flex justify-end">
        <SaveSettingsButton />
      </div>
    </form>
  );
}

function SaveSettingsButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="h-11 gap-2 bg-slate-950 px-5 shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70">
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Saving..." : "Save site settings"}
    </Button>
  );
}
