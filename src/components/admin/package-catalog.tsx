"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BadgeDollarSign, CheckCircle2, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { booleanOnlyFeatures, featureDisplayOrder } from "@/config/features";
import { createPlanPackage, deletePlanPackage, savePlanPackage } from "@/app/admin/actions";
import {
  AdminDragHandle,
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
import { Textarea } from "@/components/ui/textarea";

type FeatureOption = {
  id: string;
  key: string;
  name: string;
  description: string | null;
};

type PackageFeature = {
  featureId: string;
  enabled: boolean;
  limit: number | null;
  feature: FeatureOption;
};

type PackagePlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  lifetimePrice: number | null;
  gracePeriodDays: number;
  enabled: boolean;
  featured: boolean;
  displayOrder: number;
  features: PackageFeature[];
  _count: {
    subscriptions: number;
  };
};

type PackageDraft = Omit<PackagePlan, "_count" | "features"> & {
  features: Array<{
    featureId: string;
    enabled: boolean;
    limit: number | null;
  }>;
  _count: {
    subscriptions: number;
  };
};

export function PackageCatalog({ plans: initialPlans, features }: { plans: PackagePlan[]; features: FeatureOption[] }) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
  const [draft, setDraft] = useState<PackageDraft | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PackagePlan | null>(null);
  const [draggedPlanId, setDraggedPlanId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const orderedPlans = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);

  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  function openCreateDialog() {
    setIsCreating(true);
    setDraft({
      id: "",
      name: "New package",
      description: "Package description for the public pricing card.",
      monthlyPrice: 0,
      annualPrice: 0,
      lifetimePrice: 0,
      gracePeriodDays: 0,
      enabled: true,
      featured: false,
      displayOrder: plans.length + 1,
      features: features.map((feature) => ({ featureId: feature.id, enabled: false, limit: null })),
      _count: {
        subscriptions: 0
      }
    });
  }

  function openEditDialog(plan: PackagePlan) {
    setIsCreating(false);
    setDraft({
      ...plan,
      features: features.map((feature) => {
        const access = plan.features.find((item) => item.featureId === feature.id);

        return {
          featureId: feature.id,
          enabled: access?.enabled ?? false,
          limit: access?.limit ?? null
        };
      })
    });
  }

  function closeEditor() {
    setDraft(null);
    setIsCreating(false);
  }

  function saveDraft() {
    if (!draft) return;

    startTransition(async () => {
      try {
        if (isCreating) {
          await createPlanPackage(toPlanInput(draft));
          router.refresh();
        } else {
          await savePlanPackage(toPlanInput(draft));
          setPlans((current) => current.map((plan) => (plan.id === draft.id ? mergeDraftIntoPlan(plan, draft, features) : plan)));
        }

        setIsCreating(false);
        setDraft(null);
        toast.success(isCreating ? "Package created." : "Package saved.");
      } catch {
        toast.error("Could not save package. Check your local database connection.");
      }
    });
  }

  function deletePlan(plan: PackagePlan) {
    if (plan._count.subscriptions > 0) {
      toast.error("This package has subscriptions, so it cannot be deleted. Disable it instead.");
      return;
    }

    setDeleteTarget(plan);
  }

  function confirmDeletePlan() {
    if (!deleteTarget) return;

    startTransition(async () => {
      try {
        await deletePlanPackage(deleteTarget.id);
        setPlans((current) => current.filter((item) => item.id !== deleteTarget.id));
        toast.success("Package deleted.");
        setDeleteTarget(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not delete package.");
      }
    });
  }

  function updateFeature(featureId: string, value: { enabled?: boolean; limit?: number | null }) {
    setDraft((current) =>
      current
        ? {
            ...current,
            features: current.features.map((feature) => (feature.featureId === featureId ? { ...feature, ...value } : feature))
          }
        : current
    );
  }

  function reorderPlans(activeId: string, targetId: string) {
    if (activeId === targetId) return;

    const currentOrder = orderedPlans.map((plan) => plan.id);
    const activeIndex = currentOrder.indexOf(activeId);
    const targetIndex = currentOrder.indexOf(targetId);

    if (activeIndex < 0 || targetIndex < 0) return;

    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeId);

    setPlans((current) =>
      current.map((plan) => ({
        ...plan,
        displayOrder: currentOrder.indexOf(plan.id) + 1
      }))
    );
  }

  function saveOrder() {
    startTransition(async () => {
      try {
        await Promise.all(orderedPlans.map((plan) => savePlanPackage(toPlanInput(planToDraft(plan)))));
        toast.success("Package order saved.");
      } catch {
        toast.error("Could not save package order. Check your local database connection.");
      }
    });
  }

  return (
    <AdminPanel
      title="Package Catalog"
      icon={BadgeDollarSign}
      actions={
        <>
          <div className="sticky bottom-4 z-20 flex justify-end">
            <Button type="button" onClick={saveOrder} disabled={isPending} className="h-11 gap-2 bg-slate-950 px-6 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              {isPending ? "Saving\u2026" : "Save order"}
            </Button>
          </div>
          <AdminAddButton onClick={openCreateDialog}>
            Add package
          </AdminAddButton>
        </>
      }
    >
      <AdminRecordGrid className="lg:grid-cols-3">
        {orderedPlans.map((plan) => {
          const enabledFeatures = plan.features.filter((feature) => feature.enabled);

          return (
            <AdminRecordCard
              key={plan.id}
              draggable
              onDragStart={() => setDraggedPlanId(plan.id)}
              onDragEnd={() => setDraggedPlanId(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedPlanId) {
                  reorderPlans(draggedPlanId, plan.id);
                }
                setDraggedPlanId(null);
              }}
              className={draggedPlanId === plan.id ? "border-primary bg-primary/5 opacity-70" : "hover:border-slate-400"}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{plan.name}</h3>
                    {plan.featured ? <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">Featured</span> : null}
                    {!plan.enabled ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">Hidden</span> : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{plan._count.subscriptions} subscriptions</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <AdminDragHandle />
                  <AdminIconButton icon={Pencil} label={`Edit ${plan.name}`} tooltip={`Edit ${plan.name}`} onClick={() => openEditDialog(plan)} />
                  <AdminIconButton icon={Trash2} label={`Delete ${plan.name}`} tooltip={plan._count.subscriptions > 0 ? "Packages with subscriptions cannot be deleted" : `Delete ${plan.name}`} tone="danger" disabled={isPending || plan._count.subscriptions > 0} onClick={() => deletePlan(plan)} />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description || "No public description set."}</p>

              <div className="mt-6 grid gap-3 text-sm">
                <AdminInfoRow label="Monthly" value={formatPrice(plan.monthlyPrice)} />
                <AdminInfoRow label="Annual" value={formatPrice(plan.annualPrice)} />
                <AdminInfoRow label="Lifetime" value={formatPrice(plan.lifetimePrice)} />
                <AdminInfoRow label="Grace period" value={`${plan.gracePeriodDays} day${plan.gracePeriodDays === 1 ? "" : "s"}`} />
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-sm font-semibold text-slate-950">Features</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {enabledFeatures.length ? (
                    enabledFeatures.map((access) => (
                      <p key={access.featureId} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                        <span>
                          {access.feature.name}
                          {access.limit === null ? "" : ` (${access.limit})`}
                        </span>
                      </p>
                    ))
                  ) : (
                    <p>No features enabled.</p>
                  )}
                </div>
              </div>
            </AdminRecordCard>
          );
        })}
      </AdminRecordGrid>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && closeEditor()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {draft ? (
            <>
              <DialogHeader>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-primary">{isCreating ? "Add package" : "Edit package"}</p>
                <DialogTitle className="font-display text-3xl font-black tracking-[-0.04em]">{draft.name}</DialogTitle>
              </DialogHeader>

              <div className="grid gap-5">
              <div className="grid gap-4">
                <Label className="block text-sm font-medium text-slate-700">
                  Package name
                  <Input value={draft.name} onChange={(event) => setDraft((current) => (current ? { ...current, name: event.target.value } : current))} placeholder="Package name" className="mt-2 h-11" />
                </Label>
              </div>
              <Label className="block text-sm font-medium text-slate-700">
                Public pricing description
                <Textarea value={draft.description} onChange={(event) => setDraft((current) => (current ? { ...current, description: event.target.value } : current))} placeholder="What's included in this plan" className="mt-2 min-h-24 resize-y" />
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <PriceInput label="Monthly price" value={draft.monthlyPrice} onChange={(monthlyPrice) => setDraft((current) => (current ? { ...current, monthlyPrice } : current))} />
                <PriceInput label="Annual price" value={draft.annualPrice} onChange={(annualPrice) => setDraft((current) => (current ? { ...current, annualPrice } : current))} />
                <PriceInput label="Lifetime price" value={draft.lifetimePrice} onChange={(lifetimePrice) => setDraft((current) => (current ? { ...current, lifetimePrice } : current))} />
              </div>
              <PriceInput label="Grace period after missed renewal (days)" value={draft.gracePeriodDays} onChange={(gracePeriodDays) => setDraft((current) => (current ? { ...current, gracePeriodDays: gracePeriodDays ?? 0 } : current))} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Label className="flex items-center gap-2 border border-slate-200 p-3 text-sm font-medium">
                  <Checkbox checked={draft.enabled} onCheckedChange={(checked) => setDraft((current) => (current ? { ...current, enabled: checked === true } : current))} />
                  Enabled
                </Label>
                <Label className="flex items-center gap-2 border border-slate-200 p-3 text-sm font-medium">
                  <Checkbox checked={draft.featured} onCheckedChange={(checked) => setDraft((current) => (current ? { ...current, featured: checked === true } : current))} />
                  Featured on pricing
                </Label>
              </div>
              <section className="border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h4 className="font-semibold text-slate-950">Package features</h4>
                  <p className="mt-1 text-sm text-slate-500">Enable features and set an optional numeric limit. Leave limit empty for unlimited.</p>
                </div>
                <div className="divide-y divide-slate-200">
                  {sortedFeatures(features).map((feature) => {
                    const access = draft.features.find((item) => item.featureId === feature.id) ?? { featureId: feature.id, enabled: false, limit: null };
                    const isBooleanOnly = booleanOnlyFeatures.has(feature.key);

                    return (
                      <div key={feature.id} className="grid gap-3 p-4 md:grid-cols-[1fr_120px] md:items-center">
                        <Label className="flex items-start gap-3 text-sm">
                          <Checkbox checked={access.enabled} onCheckedChange={(checked) => updateFeature(feature.id, { enabled: checked === true, ...(isBooleanOnly ? { limit: null } : {}) })} className="mt-1" />
                          <span>
                            <span className="block font-semibold text-slate-950">{feature.name}</span>
                            {feature.description ? <span className="mt-1 block text-xs text-slate-500">{feature.description}</span> : null}
                          </span>
                        </Label>
                        {isBooleanOnly ? (
                          <span className="text-center text-xs text-slate-400">—</span>
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            value={access.limit ?? ""}
                            onChange={(event) => updateFeature(feature.id, { limit: event.target.value === "" ? null : Number(event.target.value) })}
                            placeholder="Unlimited"
                            className="h-10"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeEditor}>Cancel</Button>
                <Button type="button" onClick={saveDraft} disabled={isPending} className="bg-slate-950 text-white hover:bg-primary/90">
                  {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                  {isPending ? "Saving\u2026" : isCreating ? "Create package" : "Save package"}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete package?"}
        body="This can only be done for packages with no subscription history."
        pending={isPending}
        onConfirm={confirmDeletePlan}
      />
    </AdminPanel>
  );
}

function toPlanInput(draft: PackageDraft) {
  return {
    id: draft.id,
    name: draft.name,
    description: draft.description,
    monthlyPrice: draft.monthlyPrice,
    annualPrice: draft.annualPrice,
    lifetimePrice: draft.lifetimePrice,
    gracePeriodDays: draft.gracePeriodDays,
    enabled: draft.enabled,
    featured: draft.featured,
    displayOrder: draft.displayOrder,
    features: draft.features
  };
}

function planToDraft(plan: PackagePlan): PackageDraft {
  return {
    ...plan,
    features: plan.features.map((access) => ({
      featureId: access.featureId,
      enabled: access.enabled,
      limit: access.limit
    })),
    _count: plan._count
  };
}

function mergeDraftIntoPlan(plan: PackagePlan, draft: PackageDraft, features: FeatureOption[]): PackagePlan {
  return {
    ...plan,
    ...draft,
    features: draft.features.map((access) => ({
      ...access,
      feature: features.find((feature) => feature.id === access.featureId) ?? {
        id: access.featureId,
        key: access.featureId,
        name: "Unknown feature",
        description: null
      }
    }))
  };
}

function PriceInput({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return (
    <Label className="block text-sm font-medium text-slate-700">
      {label}
      <Input
        type="number"
        min={0}
        value={value ?? 0}
        onChange={(event) => onChange(Number(event.target.value))}
        placeholder="0"
        className="mt-2 h-11"
      />
    </Label>
  );
}

function sortedFeatures(features: FeatureOption[]) {
  return [...features].sort((a, b) => {
    const ai = featureDisplayOrder.indexOf(a.key);
    const bi = featureDisplayOrder.indexOf(b.key);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

function formatPrice(value: number | null) {
  if (!value) {
    return "Free";
  }

  return `$${Math.round(value / 100).toLocaleString("en-US")}`;
}
