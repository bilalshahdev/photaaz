"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerDashboardPath, onboardingPath } from "@/config/routes";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import { currentLegalVersions } from "@/config/legal";
import { localizePath, type AppLocale } from "@/i18n/locales";

type AuthPanelProps = {
  mode: "sign-in" | "sign-up";
  locale: AppLocale;
};

export function AuthPanel({ mode, locale }: AuthPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "Photographer");

    if (mode === "sign-up" && formData.get("legalAccepted") !== "on") {
      setPending(false);
      setError("You must accept the Terms and Privacy Policy to create an account.");
      return;
    }

    const result = mode === "sign-up"
      ? await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password, name, callbackURL: onboardingPath(), legalAccepted: true, legalVersions: currentLegalVersions, locale }),
        }).then(async (response) => response.ok
          ? ({ error: null })
          : ({ error: { message: ((await response.json().catch(() => null)) as { message?: string } | null)?.message ?? "Account creation failed." } }))
      : await authClient.signIn.email({
            email,
            password,
            callbackURL: customerDashboardPath("demo")
          });

    setPending(false);

    if (result.error) {
      setError(result.error.message ?? "Authentication failed.");
      return;
    }

    router.push(mode === "sign-up" ? onboardingPath() : customerDashboardPath("demo"));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-white/14 bg-[#17130f] p-5 text-white shadow-2xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {mode === "sign-up" ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.04em]">
          {mode === "sign-up" ? "Start your studio workspace." : "Sign in to your studio."}
        </h1>
      </div>
      {mode === "sign-up" ? (
        <Label className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/75">
          <input name="legalAccepted" type="checkbox" required className="mt-1 size-4 accent-teal-500" />
          <span>
            I agree to the <Link className="text-accent underline" href={localizePath(locale, "/legal/terms")} target="_blank">Terms</Link> and acknowledge the <Link className="text-accent underline" href={localizePath(locale, "/legal/privacy")} target="_blank">Privacy Policy</Link>.
          </span>
        </Label>
      ) : null}
      <div className="mt-6 space-y-4">
        {mode === "sign-up" ? (
          <Label className="block">
            <span className="text-sm font-medium text-white/70">Name</span>
            <Input
              name="name"
              required
              className="mt-2 h-11 w-full rounded-md border border-white/14 bg-[#221d18] px-3 text-white outline-none placeholder:text-white/36 focus:border-accent"
              placeholder="Bilal Shah"
            />
          </Label>
        ) : null}
        <Label className="block">
          <span className="text-sm font-medium text-white/70">Email</span>
          <Input
            name="email"
            type="email"
            required
            className="mt-2 h-11 w-full rounded-md border border-white/14 bg-[#221d18] px-3 text-white outline-none placeholder:text-white/36 focus:border-accent"
            placeholder="you@studio.com"
          />
        </Label>
        <Label className="block">
          <span className="text-sm font-medium text-white/70">Password</span>
          <Input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-2 h-11 w-full rounded-md border border-white/14 bg-[#221d18] px-3 text-white outline-none placeholder:text-white/36 focus:border-accent"
            placeholder="Minimum 8 characters"
          />
        </Label>
      </div>
      {error ? <p className="mt-4 rounded-md bg-red-500/16 p-3 text-sm text-red-100">{error}</p> : null}
      <Button disabled={pending} className="mt-6 w-full" size="lg">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
        {mode === "sign-up" ? "Create workspace" : "Enter dashboard"}
      </Button>
    </form>
  );
}
