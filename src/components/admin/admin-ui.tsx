import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AdminPage({
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

export function MetricCard({ icon: Icon, label, value, body, href }: { icon: React.ElementType; label: string; value: string; body: string; href?: string }) {
  const card = (
    <section className="flex h-full flex-col rounded-lg border border-slate-300 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-shadow">
      <Icon className="size-6 text-primary" aria-hidden="true" />
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-4xl font-black tracking-[-0.04em] text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </section>
  );

  return href ? (
    <Link href={href as Route} className="block h-full transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      {card}
    </Link>
  ) : (
    card
  );
}

export function AdminPanel({ id, title, icon: Icon, actions, children, className }: { id?: string; title: string; icon: React.ElementType; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={cn("rounded-lg border border-slate-300 bg-white p-5 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)]", className)}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-primary" aria-hidden="true" />
          <h2 className="font-semibold text-slate-950">{title}</h2>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  body,
  actions
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.04em] text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">{body}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminSectionTitle({ title, body }: { title: string; body?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      {body ? <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p> : null}
    </div>
  );
}

type AdminAddButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  children: React.ReactNode;
  href?: Route;
  icon?: LucideIcon;
  className?: string;
};

export const AdminAddButton = React.forwardRef<HTMLButtonElement, AdminAddButtonProps>(function AdminAddButton(
  { children, href, icon: Icon = Plus, className, ...props },
  ref
) {
  const buttonClassName = cn("bg-slate-950 text-white hover:bg-primary/90 disabled:opacity-50", className);

  if (href) {
    return (
      <Button asChild className={buttonClassName}>
        <Link href={href}>
          <Icon className="size-4" aria-hidden="true" />
          {children}
        </Link>
      </Button>
    );
  }

  return (
    <Button ref={ref} type="button" className={buttonClassName} {...props}>
      <Icon className="size-4" aria-hidden="true" />
      {children}
    </Button>
  );
});

type AdminIconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: LucideIcon;
  label: string;
  tooltip?: string;
  tone?: "default" | "danger";
};

export const AdminIconButton = React.forwardRef<HTMLButtonElement, AdminIconButtonProps>(function AdminIconButton(
  { icon: Icon, label, tooltip, tone = "default", className, ...props },
  ref
) {
  const button = (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "size-9 bg-white p-0",
        tone === "danger"
          ? "border-red-200 text-red-700 hover:bg-red-50 disabled:border-slate-200 disabled:text-slate-300"
          : "border-slate-300 text-slate-700 hover:border-primary hover:text-primary",
        className
      )}
      aria-label={label}
      {...props}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );

  return tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button;
});

export function AdminIconLink({
  href,
  icon: Icon,
  label,
  tooltip,
  tone = "default"
}: {
  href: Route;
  icon: LucideIcon;
  label: string;
  tooltip?: string;
  tone?: "default" | "danger" | "solid";
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border bg-white transition",
        tone === "solid"
          ? "border-slate-950 bg-slate-950 text-white hover:bg-primary/90"
          : tone === "danger"
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-slate-300 text-slate-700 hover:border-primary hover:text-primary"
      )}
      aria-label={label}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Link>
  );

  return tooltip ? <Tooltip content={tooltip}>{link}</Tooltip> : link;
}

export function AdminConfirmDialog({
  open,
  onOpenChange,
  eyebrow = "Delete",
  title,
  body,
  confirmLabel = "Delete",
  tone = "danger",
  pending,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow?: string;
  title: string;
  body: string;
  confirmLabel?: string;
  tone?: "default" | "danger";
  pending?: boolean;
  onConfirm: () => void;
}) {
  const isDanger = tone === "danger";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <p className={cn("font-nav text-xs font-semibold uppercase tracking-[0.2em]", isDanger ? "text-red-600" : "text-primary")}>{eyebrow}</p>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-slate-600">{body}</p>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={pending} className={cn("text-white", isDanger ? "bg-red-600 hover:bg-red-700" : "bg-slate-950 hover:bg-primary/90")}>
            {pending ? "Working" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
