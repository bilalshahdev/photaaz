"use client";

import { CheckCircle2, PartyPopper, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const confettiPieces = [
  { className: "left-[8%] top-[70%] bg-emerald-500", delay: "0ms" },
  { className: "left-[20%] top-[35%] bg-cyan-500", delay: "90ms" },
  { className: "left-[48%] top-[75%] bg-teal-500", delay: "160ms" },
  { className: "left-[72%] top-[38%] bg-amber-400", delay: "230ms" },
  { className: "left-[88%] top-[66%] bg-emerald-400", delay: "310ms" }
];

type PaymentSuccessNoticeProps = {
  planName: string;
};

export function PaymentSuccessNotice({ planName }: PaymentSuccessNoticeProps) {
  return (
    <div className="relative mt-5 overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-5 py-4 shadow-sm">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {confettiPieces.map((piece) => (
          <span
            key={piece.delay}
            className={cn(
              "absolute size-1.5 rounded-full opacity-0 [animation:payment-confetti_1500ms_ease-out_forwards]",
              piece.className
            )}
            style={{ animationDelay: piece.delay }}
          />
        ))}
      </div>

      <div className="relative flex items-start gap-3">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-base font-semibold text-emerald-950">
            Payment verified
            <PartyPopper className="size-4 text-emerald-700" aria-hidden="true" />
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Your {planName} plan is active. Premium tools are now available in your dashboard.
          </p>
        </div>
        <Sparkles className="ml-auto hidden size-5 text-emerald-600 sm:block" aria-hidden="true" />
      </div>
    </div>
  );
}
