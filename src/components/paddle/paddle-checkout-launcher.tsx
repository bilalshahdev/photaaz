"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Paddle?: {
      Environment?: {
        set: (environment: "sandbox" | "production") => void;
      };
      Initialize: (options: {
        token: string;
        eventCallback?: (event: PaddleCheckoutEvent) => void;
      }) => void;
      Checkout: {
        open: (options: { transactionId: string }) => void;
      };
    };
  }
}

type PaddleCheckoutEvent = {
  name?: string;
  data?: {
    transaction_id?: string;
  };
};

type PaddleCheckoutLauncherProps = {
  transactionId?: string;
  returnTo?: string;
  clientToken?: string;
  environment: "sandbox" | "production";
};

export function PaddleCheckoutLauncher({
  transactionId,
  returnTo,
  clientToken,
  environment
}: PaddleCheckoutLauncherProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Preparing secure checkout...");

  const safeReturnTo = useMemo(() => {
    if (!returnTo) return "/";

    try {
      if (typeof window === "undefined") {
        return returnTo.startsWith("/") ? returnTo : "/";
      }

      const url = new URL(returnTo, window.location.origin);
      if (url.origin !== window.location.origin) return "/";
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "/";
    }
  }, [returnTo]);

  useEffect(() => {
    if (!transactionId) {
      setStatus("error");
      setMessage("Checkout transaction is missing.");
      return;
    }

    if (!clientToken) {
      setStatus("error");
      setMessage("Paddle client token is not configured.");
      return;
    }

    const activeTransactionId = transactionId;
    const activeClientToken = clientToken;
    let cancelled = false;

    async function openCheckout() {
      try {
        await loadPaddleScript();

        if (cancelled || !window.Paddle) return;

        if (environment === "sandbox") {
          window.Paddle.Environment?.set("sandbox");
        }

        window.Paddle.Initialize({
          token: activeClientToken,
          eventCallback: (event) => {
            if (event.name === "checkout.completed") {
              const completedTransactionId = event.data?.transaction_id ?? activeTransactionId;
              const returnParams = new URLSearchParams({
                _ptxn: completedTransactionId,
                returnTo: safeReturnTo
              });

              window.location.href = `/checkout/paddle/return?${returnParams.toString()}`;
            }

            if (event.name === "checkout.closed") {
              setStatus("ready");
              setMessage("Checkout was closed. You can reopen it or return to your dashboard.");
            }
          }
        });

        window.Paddle.Checkout.open({ transactionId: activeTransactionId });
        setStatus("ready");
        setMessage("Checkout is open. Complete the payment to activate your plan.");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Could not open Paddle checkout. Please try again.");
        }
      }
    }

    void openCheckout();

    return () => {
      cancelled = true;
    };
  }, [clientToken, environment, safeReturnTo, transactionId]);

  function reopenCheckout() {
    if (!window.Paddle || !transactionId) return;
    window.Paddle.Checkout.open({ transactionId });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <section className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-teal-50 text-teal-700">
          {status === "loading" ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          {status === "ready" ? <span className="text-lg font-black">P</span> : null}
          {status === "error" ? <span className="text-lg font-black">!</span> : null}
        </div>
        <h1 className="mt-5 font-display text-3xl font-black tracking-[-0.04em] text-slate-950">Paddle checkout</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" onClick={reopenCheckout} disabled={status === "loading" || !transactionId}>
            Open checkout
          </Button>
          <Button type="button" variant="outline" onClick={() => (window.location.href = safeReturnTo)}>
            Back to dashboard
          </Button>
        </div>
      </section>
    </main>
  );
}

function loadPaddleScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Paddle) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Paddle script failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paddle script failed to load."));
    document.head.appendChild(script);
  });
}
