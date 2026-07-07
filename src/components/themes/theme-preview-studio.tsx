"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Check, Crown, ExternalLink, Loader2, Lock } from "lucide-react";
import { applyCustomerTheme } from "@/actions/customer-settings-actions";
import { CustomerConfirmDialog } from "@/components/customer/customer-dashboard-ui";
import { Button } from "@/components/ui/button";
import { themeDemoPath } from "@/config/routes";
import { getThemeBadgeLabel, getThemeRequiredAccess, themes, type ThemeConfig, type ThemeKey } from "@/config/themes";
import { localizePath, type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

type ThemePreviewStudioProps = {
  tenantSlug: string;
  currentThemeKey?: string;
  accessibleThemeKeys: ThemeKey[];
  locale: AppLocale;
  themeChangedAt?: Date | string | null;
  cooldownDays: number;
};

export function ThemePreviewStudio({ tenantSlug, currentThemeKey = themes[0].key, accessibleThemeKeys, locale, themeChangedAt, cooldownDays }: ThemePreviewStudioProps) {
  const safeCurrentTheme = themes.find((theme) => theme.key === currentThemeKey) ?? themes[0];
  const [appliedKey, setAppliedKey] = useState<ThemeKey>(safeCurrentTheme.key);
  const [lastChangedAt, setLastChangedAt] = useState<Date | null>(() => readDate(themeChangedAt));
  const [message, setMessage] = useState("");
  const [pendingThemeKey, setPendingThemeKey] = useState<ThemeKey | null>(null);
  const [confirmThemeKey, setConfirmThemeKey] = useState<ThemeKey | null>(null);
  const [isPending, startTransition] = useTransition();
  const nextSwitchAt = lastChangedAt && cooldownDays > 0 ? addDays(lastChangedAt, cooldownDays) : null;
  const switchingBlocked = Boolean(nextSwitchAt && nextSwitchAt.getTime() > Date.now());
  const cooldownMessage = switchingBlocked && nextSwitchAt ? `You can apply another theme on ${formatDate(nextSwitchAt)}.` : "";
  const switchNotice =
    cooldownDays > 0
      ? ` After applying, you may need to wait ${cooldownDays} day${cooldownDays === 1 ? "" : "s"} before switching again.`
      : " You can switch again anytime because the platform cooldown is currently disabled.";

  const confirmTheme = confirmThemeKey ? themes.find((theme) => theme.key === confirmThemeKey) ?? null : null;

  function requestApplyTheme(themeKey: ThemeKey) {
    const isSwitchingTheme = themeKey !== appliedKey;

    if (isSwitchingTheme && switchingBlocked) {
      setMessage(cooldownMessage);
      return;
    }

    setConfirmThemeKey(themeKey);
  }

  function applyTheme(themeKey: ThemeKey) {
    const isSwitchingTheme = themeKey !== appliedKey;

    const formData = new FormData();
    formData.set("tenantSlug", tenantSlug);
    formData.set("themeKey", themeKey);
    setPendingThemeKey(themeKey);

    startTransition(async () => {
      try {
        await applyCustomerTheme(formData);
        setAppliedKey(themeKey);
        if (isSwitchingTheme) {
          setLastChangedAt(new Date());
        }
        setMessage("Theme applied.");
        setConfirmThemeKey(null);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not apply this theme.");
      } finally {
        setPendingThemeKey(null);
      }
    });
  }

  return (
    <div className="grid gap-5">
      {cooldownMessage || message ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {message || cooldownMessage}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => {
          const locked = !accessibleThemeKeys.includes(theme.key);
          const applied = appliedKey === theme.key;
          const pending = isPending && pendingThemeKey === theme.key;
          return (
            <ThemeChoiceCard
              key={theme.key}
              theme={theme}
              applied={applied}
              locked={locked}
              pending={pending}
              switchBlocked={theme.key !== appliedKey && switchingBlocked}
              onApply={() => requestApplyTheme(theme.key)}
              demoHref={localizePath(locale, themeDemoPath(theme.key))}
            />
          );
        })}
      </div>
      <CustomerConfirmDialog
        open={Boolean(confirmTheme)}
        onOpenChange={(open) => {
          if (!open) setConfirmThemeKey(null);
        }}
        eyebrow="Apply theme"
        title={confirmTheme ? `Apply ${confirmTheme.name}?` : "Apply theme?"}
        body={
          confirmTheme
            ? `This will switch your public portfolio to ${confirmTheme.name}. Your content stays the same, but the layout and presentation will change.${switchNotice}`
            : "This will switch your public portfolio theme."
        }
        confirmLabel="Apply theme"
        tone="default"
        pending={isPending}
        onConfirm={() => {
          if (confirmThemeKey) applyTheme(confirmThemeKey);
        }}
      />
    </div>
  );
}

function ThemeChoiceCard({
  theme,
  applied,
  locked,
  pending,
  switchBlocked,
  onApply,
  demoHref
}: {
  theme: ThemeConfig;
  applied: boolean;
  locked: boolean;
  pending: boolean;
  switchBlocked: boolean;
  onApply: () => void;
  demoHref: Route;
}) {
  return (
    <article
      className={cn(
        "flex min-h-full flex-col overflow-hidden rounded-lg border bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow] duration-200",
        applied ? "border-slate-950 ring-1 ring-slate-950" : "border-slate-200 hover:border-slate-400 hover:shadow-[0_16px_34px_rgba(15,23,42,0.1)]"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image src={theme.previewImage} alt={`${theme.name} preview`} fill sizes="(min-width: 1280px) 28vw, (min-width: 640px) 44vw, 100vw" className="object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {applied ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 shadow-sm">Current</span> : <ThemeBadge theme={theme} locked={locked} />}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-black tracking-[-0.04em] text-slate-950">{theme.name}</h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{theme.mood}</p>
          </div>
          {locked ? <Lock className="mt-1 size-4 shrink-0 text-slate-400" aria-hidden="true" /> : null}
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">{theme.description}</p>

        <div className="mt-5 flex gap-1.5">
          {theme.palette.map((color) => (
            <span key={color} className="size-5 rounded-full border border-black/10" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 p-3">
        <Button asChild variant="outline" size="sm" className="bg-white">
          <Link href={demoHref} target="_blank">
            <ExternalLink className="size-4" aria-hidden="true" />
            View
          </Link>
        </Button>
        <Button type="button" size="sm" onClick={onApply} disabled={applied || pending || locked || switchBlocked}>
          {locked ? <Lock className="size-4" aria-hidden="true" /> : pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
          {locked ? "Locked" : switchBlocked ? "Wait" : applied ? "Applied" : "Apply"}
        </Button>
      </div>
    </article>
  );
}

function readDate(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(date);
}

function getLockedThemeLabel(theme: ThemeConfig) {
  return getThemeRequiredAccess(theme) === "pro" ? "Requires Pro" : "Requires paid plan";
}

function ThemeBadge({ theme, locked }: { theme: ThemeConfig; locked: boolean }) {
  const label = locked ? getLockedThemeLabel(theme) : getThemeBadgeLabel(theme);

  if (theme.tier === "basic") {
    return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{label}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        theme.tier === "special" ? "bg-amber-50 text-amber-800" : "bg-violet-50 text-violet-800",
        locked && "bg-slate-100 text-slate-500"
      )}
    >
      {locked ? <Lock className="size-3.5" aria-hidden="true" /> : <Crown className="size-3.5" aria-hidden="true" />}
      {label}
    </span>
  );
}
