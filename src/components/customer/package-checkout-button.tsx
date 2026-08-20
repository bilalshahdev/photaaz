"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startPlanCheckout } from "@/actions/customer-billing-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaddleBillingInterval } from "@/lib/paddle/client";

type PackageCheckoutButtonProps = {
  tenantSlug: string;
  planKey: string;
  billingInterval: PaddleBillingInterval;
  disabled?: boolean;
  isCurrent?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function PackageCheckoutButton({
  tenantSlug,
  planKey,
  billingInterval,
  disabled,
  isCurrent,
  className,
  children
}: PackageCheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  function beginCheckout() {
    if (disabled || isCurrent) return;

    startTransition(async () => {
      try {
        const result = await startPlanCheckout({
          tenantSlug,
          planKey,
          billingInterval
        });

        if (!result.ok || !result.transactionId) {
          toast.error(result.message ?? "Could not start checkout.");
          return;
        }

        const params = new URLSearchParams({
          transactionId: result.transactionId,
          returnTo: result.returnTo ?? `/site/${tenantSlug}/dashboard/package`
        });

        window.location.href = `/checkout/paddle?${params.toString()}`;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not start checkout.");
      }
    });
  }

  return (
    <Button
      type="button"
      disabled={disabled || isCurrent || isPending}
      onClick={beginCheckout}
      className={cn(
        "h-11 bg-slate-950 text-white hover:bg-teal-800 disabled:bg-slate-200 disabled:text-slate-500",
        className
      )}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : isCurrent ? <Check className="size-4" aria-hidden="true" /> : null}
      {isPending ? "Opening checkout..." : children}
    </Button>
  );
}
