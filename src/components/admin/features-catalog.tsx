"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Save, Trash2, Wrench } from "lucide-react";
import { deleteFeature, saveFeature } from "@/app/admin/actions";
import { AdminTable, AdminTableEmptyRow } from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminConfirmDialog, AdminIconButton, AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, LocalizedTextarea, type AdminLocaleOption } from "@/components/admin/localized-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LocalizedString } from "@/services/platform/platform-data";

type FeatureItem = {
  id: string;
  key: string;
  name: LocalizedString;
  description: LocalizedString | null;
  _count: {
    plans: number;
  };
};

type FeatureDraft = {
  id?: string;
  key: string;
  name: LocalizedString;
  description: LocalizedString;
};

const emptyDraft: FeatureDraft = {
  key: "",
  name: "",
  description: ""
};

export function FeaturesCatalog({ features: initialFeatures, locales }: { features: FeatureItem[]; locales: AdminLocaleOption[] }) {
  const [features, setFeatures] = useState(initialFeatures);
  const [draft, setDraft] = useState<FeatureDraft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeatureItem | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFeatures(initialFeatures);
  }, [initialFeatures]);

  function openCreateDialog() {
    setDraft(emptyDraft);
  }

  function openEditDialog(feature: FeatureItem) {
    setDraft({
      id: feature.id,
      key: feature.key,
      name: feature.name,
      description: feature.description ?? ""
    });
  }

  function saveDraft() {
    if (!draft) return;

    startTransition(async () => {
      try {
        await saveFeature(draft);
        toast.success(draft.id ? "Feature saved." : "Feature created.");
        setDraft(null);
      } catch {
        toast.error("Could not save feature. Make sure the key is unique.");
      }
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      try {
        await deleteFeature(deleteTarget.id);
        setFeatures((current) => current.filter((feature) => feature.id !== deleteTarget.id));
        toast.success("Feature deleted.");
        setDeleteTarget(null);
      } catch {
        toast.error("Could not delete feature. Remove it from packages first.");
      }
    });
  }

  return (
    <AdminPanel
      title="Feature Library"
      icon={Wrench}
      actions={
        <AdminAddButton onClick={openCreateDialog}>
          Add feature
        </AdminAddButton>
      }
    >
      <AdminTable>
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="p-4 font-semibold">Feature</th>
              <th className="p-4 font-semibold">Key</th>
              <th className="p-4 font-semibold">Packages</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {features.map((feature) => (
              <tr key={feature.id} className="align-middle transition hover:bg-slate-50/70">
                <td className="p-4">
                  <p className="font-semibold text-slate-950">{displayLocalized(feature.name)}</p>
                  <p className="mt-1 text-sm text-slate-500">{displayLocalized(feature.description) || "No description."}</p>
                </td>
                <td className="p-4 font-mono text-xs text-slate-500">{feature.key}</td>
                <td className="p-4 text-slate-600">{feature._count.plans}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <AdminIconButton icon={Pencil} label={`Edit ${displayLocalized(feature.name)}`} tooltip={`Edit ${displayLocalized(feature.name)}`} onClick={() => openEditDialog(feature)} />
                    <AdminIconButton icon={Trash2} label={`Delete ${displayLocalized(feature.name)}`} tooltip={feature._count.plans > 0 ? "Feature is linked to packages" : `Delete ${displayLocalized(feature.name)}`} tone="danger" disabled={feature._count.plans > 0} onClick={() => setDeleteTarget(feature)} />
                  </div>
                </td>
              </tr>
            ))}
            {features.length === 0 ? (
              <AdminTableEmptyRow colSpan={4}>No features yet. Add the first feature to use it in packages.</AdminTableEmptyRow>
            ) : null}
          </tbody>
      </AdminTable>

      <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-w-xl">
          {draft ? (
            <>
              <DialogHeader>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-primary">{draft.id ? "Edit feature" : "Add feature"}</p>
                <DialogTitle className="font-display text-3xl font-black tracking-[-0.04em]">{displayLocalized(draft.name) || "Feature"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <LocalizedInput label="Name" value={draft.name} locales={locales} onChange={(name) => setDraft((current) => (current ? { ...current, name } : current))} placeholder="Feature name" />
                <Label className="block text-sm font-medium text-slate-700">
                  Key
                  <Input value={draft.key} onChange={(event) => setDraft((current) => (current ? { ...current, key: event.target.value.trim().toLowerCase() } : current))} placeholder="photos.total" className="mt-2 h-11 font-mono" />
                </Label>
                <LocalizedTextarea label="Description" value={draft.description} locales={locales} onChange={(description) => setDraft((current) => (current ? { ...current, description } : current))} placeholder="What this feature does" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
                <Button type="button" onClick={saveDraft} disabled={isPending} className="bg-slate-950 text-white hover:bg-primary/90">
                  {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                  {isPending ? "Saving\u2026" : "Save feature"}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${displayLocalized(deleteTarget.name)}?` : "Delete feature?"}
        body="This feature will no longer be available for future package configuration."
        pending={isPending}
        onConfirm={confirmDelete}
      />
    </AdminPanel>
  );
}

function displayLocalized(value: LocalizedString | null | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.en || Object.values(value).find(Boolean) || "";
}
