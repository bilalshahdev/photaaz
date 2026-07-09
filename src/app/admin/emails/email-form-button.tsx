"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmailDeliveryButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Saving\u2026" : "Save delivery"}
    </Button>
  );
}

export function EmailSettingButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-10 gap-2 bg-slate-950 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Save className="size-3.5" aria-hidden="true" />}
      {pending ? "Saving\u2026" : "Save setting"}
    </Button>
  );
}
