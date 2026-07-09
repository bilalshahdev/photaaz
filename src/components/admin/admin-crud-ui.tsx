import { cn } from "@/lib/utils";
import { Check, GripVertical, X } from "lucide-react";

export function AdminStatusMessage({ children, className }: { children: React.ReactNode; className?: string }) {
  if (!children) return null;

  return (
    <div className={cn("mb-4 border border-primary/20 bg-primary/5 p-3 text-sm font-medium text-primary", className)}>
      {children}
    </div>
  );
}

export function AdminRecordGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 lg:grid-cols-2 2xl:grid-cols-3", className)}>{children}</div>;
}

export function AdminTable({
  children,
  minWidth = "760px",
  className
}: {
  children: React.ReactNode;
  minWidth?: string;
  className?: string;
}) {
  return (
    <div className={cn("no-scrollbar overflow-x-auto rounded-md border border-slate-200", className)}>
      <table className="w-full border-collapse text-left text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function AdminTableEmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center text-sm text-slate-500">
        {children}
      </td>
    </tr>
  );
}

export function AdminRecordCard({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"article">) {
  return (
    <article
      {...props}
      className={cn(
        "flex min-h-full flex-col border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-[0_20px_46px_rgba(15,23,42,0.1)]",
        className
      )}
    >
      {children}
    </article>
  );
}

export function AdminInfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-slate-200 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-950">{value}</span>
    </div>
  );
}

export function AdminEmptyState({
  title,
  body,
  className
}: {
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn("border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm", className)}>
      <p className="font-semibold text-slate-950">{title}</p>
      {body ? <p className="mt-1 text-slate-500">{body}</p> : null}
    </div>
  );
}

export function AdminStatusPill({
  active,
  activeLabel,
  inactiveLabel,
  activeClassName,
  inactiveClassName
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        active ? activeClassName ?? "bg-primary/5 text-primary" : inactiveClassName ?? "bg-slate-100 text-slate-500"
      )}
    >
      {active ? <Check className="size-3" aria-hidden="true" /> : <X className="size-3" aria-hidden="true" />}
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export function AdminDragHandle({ label = "Drag to reorder", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex size-8 cursor-grab items-center justify-center rounded-md border border-slate-200 text-slate-500 active:cursor-grabbing", className)}
      aria-label={label}
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </span>
  );
}
