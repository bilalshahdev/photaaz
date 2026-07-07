import Link from "next/link";
import type { Route } from "next";
import * as React from "react";
import {
  AdminEmptyState,
  AdminRecordCard,
  AdminRecordGrid,
  AdminStatusPill
} from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminConfirmDialog, AdminIconButton, AdminIconLink, AdminPanel, MetricCard } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

export function CustomerDashboardPage({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("px-4 py-6 sm:px-6 lg:px-8", className)}>
      <div className="w-full">{children}</div>
    </main>
  );
}

export function CustomerDashboardHeader({
  eyebrow,
  title,
  body,
  actions,
  media
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: React.ReactNode;
  media?: React.ReactNode;
}) {
  return (
    <section className={cn("grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm", media && "lg:grid-cols-[1fr_360px]")}>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em] text-slate-950">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{body}</p>
        {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {media}
    </section>
  );
}

export function CustomerPanel(props: React.ComponentProps<typeof AdminPanel>) {
  return <AdminPanel {...props} />;
}

export function CustomerConfirmDialog(props: React.ComponentProps<typeof AdminConfirmDialog>) {
  return <AdminConfirmDialog {...props} />;
}

export function CustomerRecordGrid(props: React.ComponentProps<typeof AdminRecordGrid>) {
  return <AdminRecordGrid {...props} />;
}

export function CustomerRecordCard(props: React.ComponentProps<typeof AdminRecordCard>) {
  return <AdminRecordCard {...props} />;
}

export function CustomerEmptyState(props: React.ComponentProps<typeof AdminEmptyState>) {
  return <AdminEmptyState {...props} />;
}

export function CustomerStatusPill(props: React.ComponentProps<typeof AdminStatusPill>) {
  return <AdminStatusPill {...props} />;
}

export function CustomerIconLink(props: React.ComponentProps<typeof AdminIconLink>) {
  return <AdminIconLink {...props} />;
}

export const CustomerIconButton = React.forwardRef<
  React.ElementRef<typeof AdminIconButton>,
  React.ComponentPropsWithoutRef<typeof AdminIconButton>
>(function CustomerIconButton(props, ref) {
  return <AdminIconButton ref={ref} {...props} />;
});

export const CustomerAddButton = React.forwardRef<
  React.ElementRef<typeof AdminAddButton>,
  React.ComponentPropsWithoutRef<typeof AdminAddButton>
>(function CustomerAddButton(props, ref) {
  return <AdminAddButton ref={ref} {...props} />;
});

export function CustomerMetricCard(props: React.ComponentProps<typeof MetricCard>) {
  return <MetricCard {...props} />;
}

export function CustomerActionLink({
  href,
  children,
  variant = "primary",
  target
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  target?: string;
}) {
  return (
    <Link
      href={href as Route}
      target={target}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-slate-950 text-white hover:bg-teal-800"
          : "border border-slate-200 text-slate-700 hover:border-teal-700 hover:text-teal-700"
      )}
    >
      {children}
    </Link>
  );
}
