"use client";

import { useEffect, useState, useTransition } from "react";
import { Pencil, Trash2, Wrench } from "lucide-react";
import { deleteFeature, saveFeature } from "@/app/admin/actions";
import { AdminStatusMessage, AdminTable, AdminTableEmptyRow } from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminConfirmDialog, AdminIconButton, AdminPanel } from "@/components/admin/admin-ui";
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
import { Textarea } from "@/components/ui/textarea";

type FeatureItem = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  _count: {
    plans: number;
  };
};

type FeatureDraft = {
  id?: string;
  key: string;
  name: string;
  description: string;
};

const emptyDraft: FeatureDraft = {
  key: "",
  name: "",
  description: ""
};

export function FeaturesCatalog({ features: initialFeatures }: { features: FeatureItem[] }) {
  const [features, setFeatures] = useState(initialFeatures);
  const [draft, setDraft] = useState<FeatureDraft | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FeatureItem | null>(null);
  const [message, setMessage] = useState("");
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
      setMessage("");

      try {
        await saveFeature(draft);
        setMessage(draft.id ? "Feature saved." : "Feature created.");
        setDraft(null);
      } catch {
        setMessage("Could not save feature. Make sure the key is unique.");
      }
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      setMessage("");

      try {
        await deleteFeature(deleteTarget.id);
        setFeatures((current) => current.filter((feature) => feature.id !== deleteTarget.id));
        setMessage("Feature deleted.");
        setDeleteTarget(null);
      } catch {
        setMessage("Could not delete feature. Remove it from packages first.");
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
      <AdminStatusMessage>{message}</AdminStatusMessage>
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
                  <p className="font-semibold text-slate-950">{feature.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{feature.description || "No description."}</p>
                </td>
                <td className="p-4 font-mono text-xs text-slate-500">{feature.key}</td>
                <td className="p-4 text-slate-600">{feature._count.plans}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <AdminIconButton icon={Pencil} label={`Edit ${feature.name}`} tooltip={`Edit ${feature.name}`} onClick={() => openEditDialog(feature)} />
                    <AdminIconButton icon={Trash2} label={`Delete ${feature.name}`} tooltip={feature._count.plans > 0 ? "Feature is linked to packages" : `Delete ${feature.name}`} tone="danger" disabled={feature._count.plans > 0} onClick={() => setDeleteTarget(feature)} />
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
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{draft.id ? "Edit feature" : "Add feature"}</p>
                <DialogTitle className="font-display text-3xl font-black tracking-[-0.04em]">{draft.name || "Feature"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <Label className="block text-sm font-medium text-slate-700">
                  Name
                  <Input value={draft.name} onChange={(event) => setDraft((current) => (current ? { ...current, name: event.target.value } : current))} className="mt-2 h-11" />
                </Label>
                <Label className="block text-sm font-medium text-slate-700">
                  Key
                  <Input value={draft.key} onChange={(event) => setDraft((current) => (current ? { ...current, key: event.target.value.trim().toLowerCase() } : current))} placeholder="photos.total" className="mt-2 h-11 font-mono" />
                </Label>
                <Label className="block text-sm font-medium text-slate-700">
                  Description
                  <Textarea value={draft.description} onChange={(event) => setDraft((current) => (current ? { ...current, description: event.target.value } : current))} className="mt-2 min-h-24 resize-y" />
                </Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
                <Button type="button" onClick={saveDraft} disabled={isPending}>{isPending ? "Saving" : "Save feature"}</Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete feature?"}
        body="This feature will no longer be available for future package configuration."
        pending={isPending}
        onConfirm={confirmDelete}
      />
    </AdminPanel>
  );
}
