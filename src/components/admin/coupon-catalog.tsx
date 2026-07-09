"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Save, Tags, Trash2 } from "lucide-react";
import { deleteCoupon, saveCoupon } from "@/app/admin/actions";
import {
  AdminEmptyState,
  AdminInfoRow,
  AdminRecordCard,
  AdminRecordGrid
} from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminConfirmDialog, AdminIconButton, AdminPanel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  amount: number;
  enabled: boolean;
  maxRedemptions: number | null;
  redeemedCount: number;
  startsAt: Date | null;
  expiresAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CouponDraft = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  amount: number;
  enabled: boolean;
  maxRedemptions: number | null;
  redeemedCount: number;
  expiresAt: string;
  notes: string | null;
};

export function CouponCatalog({ coupons: initialCoupons }: { coupons: Coupon[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [draft, setDraft] = useState<CouponDraft | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  function openCreateDialog() {
    setIsCreating(true);
    setDraft({
      id: "",
      code: "",
      type: "PERCENT",
      amount: 10,
      enabled: true,
      maxRedemptions: null,
      redeemedCount: 0,
      expiresAt: "",
      notes: ""
    });
  }

  function openEditDialog(coupon: Coupon) {
    setIsCreating(false);
    setDraft(toDraft(coupon));
  }

  function closeDialog() {
    setDraft(null);
    setIsCreating(false);
  }

  function saveDraft() {
    if (!draft) return;

    startTransition(async () => {
      try {
        await saveCoupon({
          id: isCreating ? undefined : draft.id,
          code: draft.code,
          type: draft.type,
          amount: draft.amount,
          enabled: draft.enabled,
          maxRedemptions: draft.maxRedemptions,
          expiresAt: draft.expiresAt,
          notes: draft.notes ?? ""
        });

        if (isCreating) {
          toast.success("Coupon created.");
        } else {
          setCoupons((current) => current.map((coupon) => (coupon.id === draft.id ? { ...coupon, ...fromDraft(draft) } : coupon)));
          toast.success("Coupon saved.");
        }

        closeDialog();
      } catch {
        toast.error("Could not save coupon. Check your local database connection.");
      }
    });
  }

  function removeCoupon(coupon: Coupon) {
    if (coupon.redeemedCount > 0) {
      toast.error("This coupon has redemptions, so it cannot be deleted. Disable it instead.");
      return;
    }

    setDeleteTarget(coupon);
  }

  function confirmDeleteCoupon() {
    if (!deleteTarget) return;

    startTransition(async () => {
      try {
        await deleteCoupon(deleteTarget.id);
        setCoupons((current) => current.filter((item) => item.id !== deleteTarget.id));
        toast.success("Coupon deleted.");
        setDeleteTarget(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not delete coupon.");
      }
    });
  }

  return (
    <AdminPanel
      title="Coupon List"
      icon={Tags}
      actions={
        <AdminAddButton onClick={openCreateDialog}>
          Add coupon
        </AdminAddButton>
      }
    >
      <AdminRecordGrid>
        {coupons.map((coupon) => (
          <AdminRecordCard key={coupon.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{coupon.code}</h3>
                  <span className={coupon.enabled ? "rounded-full bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"}>
                    {coupon.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{coupon.type === "PERCENT" ? `${coupon.amount}% off` : `$${coupon.amount} off`}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <AdminIconButton icon={Pencil} label={`Edit ${coupon.code}`} tooltip={`Edit ${coupon.code}`} onClick={() => openEditDialog(coupon)} />
                <AdminIconButton icon={Trash2} label={`Delete ${coupon.code}`} tooltip={coupon.redeemedCount > 0 ? "Redeemed coupons cannot be deleted" : `Delete ${coupon.code}`} tone="danger" disabled={isPending || coupon.redeemedCount > 0} onClick={() => removeCoupon(coupon)} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm">
              <AdminInfoRow label="Usage" value={`${coupon.redeemedCount}/${coupon.maxRedemptions ?? "Unlimited"}`} />
              <AdminInfoRow label="Expires" value={coupon.expiresAt ? formatDate(coupon.expiresAt) : "No expiry"} />
            </div>
            {coupon.notes ? <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-500">{coupon.notes}</p> : null}
          </AdminRecordCard>
        ))}
        {coupons.length === 0 ? <AdminEmptyState title="No coupons yet." body="Create a promo code from the add button above." /> : null}
      </AdminRecordGrid>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-2xl">
          {draft ? (
            <>
              <DialogHeader>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-primary">{isCreating ? "Add coupon" : "Edit coupon"}</p>
                <DialogTitle className="font-display text-3xl font-black tracking-[-0.04em]">{draft.code || "New coupon"}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Label className="block text-sm font-medium text-slate-700">
                  Code
                  <Input value={draft.code} onChange={(event) => setDraft((current) => (current ? { ...current, code: event.target.value.toUpperCase() } : current))} placeholder="SUMMER2026" className="mt-2 h-11 uppercase" />
                </Label>
                <Label className="block text-sm font-medium text-slate-700">
                  Discount type
                  <Select value={draft.type} onValueChange={(type) => setDraft((current) => (current ? { ...current, type: type as "PERCENT" | "FIXED" } : current))}>
                    <SelectTrigger className="mt-2 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENT">Percent</SelectItem>
                      <SelectItem value="FIXED">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </Label>
                <NumberInput label="Amount" value={draft.amount} onChange={(amount) => setDraft((current) => (current ? { ...current, amount: amount ?? 0 } : current))} />
                <NumberInput label="Max redemptions" value={draft.maxRedemptions} onChange={(maxRedemptions) => setDraft((current) => (current ? { ...current, maxRedemptions } : current))} nullable />
                <Label className="block text-sm font-medium text-slate-700">
                  Expires at
                  <Input type="date" value={draft.expiresAt} onChange={(event) => setDraft((current) => (current ? { ...current, expiresAt: event.target.value } : current))} className="mt-2 h-11" />
                </Label>
                <Label className="flex items-center gap-2 border border-slate-200 p-3 text-sm font-medium">
                  <Checkbox checked={draft.enabled} onCheckedChange={(checked) => setDraft((current) => (current ? { ...current, enabled: checked === true } : current))} />
                  Enabled
                </Label>
              </div>
              <Label className="block text-sm font-medium text-slate-700">
                Internal notes
                <Textarea value={draft.notes ?? ""} onChange={(event) => setDraft((current) => (current ? { ...current, notes: event.target.value } : current))} placeholder="Internal notes" className="mt-2 min-h-24 resize-y" />
              </Label>
              </div>

              <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button type="button" onClick={saveDraft} disabled={isPending} className="bg-slate-950 text-white hover:bg-primary/90">
                {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                {isPending ? "Saving\u2026" : isCreating ? "Create coupon" : "Save coupon"}
              </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${deleteTarget.code}?` : "Delete coupon?"}
        body="This coupon will be removed from future checkout and discount flows."
        pending={isPending}
        onConfirm={confirmDeleteCoupon}
      />
    </AdminPanel>
  );
}

function NumberInput({ label, value, nullable = false, onChange }: { label: string; value: number | null; nullable?: boolean; onChange: (value: number | null) => void }) {
  return (
    <Label className="block text-sm font-medium text-slate-700">
      {label}
      <Input
        type="number"
        min={1}
        value={value ?? ""}
        placeholder={nullable ? "Unlimited" : "10"}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : nullable ? null : 0)}
        className="mt-2 h-11"
      />
    </Label>
  );
}

function toDraft(coupon: Coupon): CouponDraft {
  return {
    ...coupon,
    expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : ""
  };
}

function fromDraft(draft: CouponDraft): Partial<Coupon> {
  return {
    code: draft.code,
    type: draft.type,
    amount: draft.amount,
    enabled: draft.enabled,
    maxRedemptions: draft.maxRedemptions,
    expiresAt: draft.expiresAt ? new Date(draft.expiresAt) : null,
    notes: draft.notes
  };
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(value);
}
