"use client";

import { useActionState, useEffect } from "react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updateCustomerSiteSettingsWithFeedback, type CustomerSettingsActionState } from "@/actions/customer-settings-actions";
import { Button } from "@/components/ui/button";
import { DirectUploadForm } from "@/components/forms/direct-upload-form";

const initialState: CustomerSettingsActionState = {
  status: "idle",
  message: ""
};

export function CustomerSettingsForm({ children }: { children: ReactNode }) {
  const [state, formAction] = useActionState(updateCustomerSiteSettingsWithFeedback, initialState);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    if (state.status === "error") toast.error(state.message);
  }, [state]);

  return (
    <DirectUploadForm action={formAction} className="mt-5 grid gap-5">
      {children}
      <div className="order-last sticky bottom-4 z-20 flex justify-end">
        <SaveSettingsButton />
      </div>
    </DirectUploadForm>
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
