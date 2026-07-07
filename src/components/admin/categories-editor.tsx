"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Edit3, ImageIcon, Plus, Save, Tags, Trash2 } from "lucide-react";
import { savePhotographyTypes } from "@/app/admin/actions";
import {
  AdminDragHandle,
  AdminEmptyState,
  AdminRecordCard,
  AdminRecordGrid,
  AdminStatusMessage,
  AdminStatusPill
} from "@/components/admin/admin-crud-ui";
import { AdminAddButton, AdminConfirmDialog, AdminIconButton, AdminPanel } from "@/components/admin/admin-ui";
import { LocalizedInput, type AdminLocaleOption } from "@/components/admin/localized-fields";
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
import { Tooltip } from "@/components/ui/tooltip";
import type { LocalizedString, PlatformPhotographyTypeView } from "@/services/platform/platform-data";

type CategoryDialogMode =
  | { type: "add-category" }
  | { type: "add-subcategory"; parentSlug: string }
  | { type: "edit"; slug: string };

type CategoryDraft = {
  name: LocalizedString;
  image: string;
  enabled: boolean;
  categorySeed: boolean;
};

const emptyDraft: CategoryDraft = {
  name: { en: "" },
  image: "",
  enabled: true,
  categorySeed: true
};

export function CategoriesEditor({ initialTypes, locales }: { initialTypes: PlatformPhotographyTypeView[]; locales: AdminLocaleOption[] }) {
  const [types, setTypes] = useState(initialTypes);
  const [message, setMessage] = useState("");
  const [draggedTypeSlug, setDraggedTypeSlug] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<CategoryDialogMode | null>(null);
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<PlatformPhotographyTypeView | null>(null);
  const [isPending, startTransition] = useTransition();
  const parentTypes = types.filter((type) => !type.parentSlug).sort((a, b) => a.displayOrder - b.displayOrder);

  function save() {
    startTransition(async () => {
      setMessage("");

      try {
        await savePhotographyTypes(types);
        setMessage("Categories saved.");
      } catch {
        setMessage("Could not save categories. Check your local database connection.");
      }
    });
  }

  function openAddCategoryDialog() {
    setDialogMode({ type: "add-category" });
    setDraft(emptyDraft);
  }

  function openAddSubcategoryDialog(parentSlug: string) {
    setDialogMode({ type: "add-subcategory", parentSlug });
    setDraft(emptyDraft);
  }

  function openEditDialog(type: PlatformPhotographyTypeView) {
    setDialogMode({ type: "edit", slug: type.slug });
    setDraft({
      name: type.name,
      image: type.image,
      enabled: type.enabled,
      categorySeed: type.categorySeed
    });
  }

  function closeDialog() {
    setDialogMode(null);
    setDraft(emptyDraft);
  }

  function saveDialog() {
    if (!dialogMode) return;

    if (dialogMode.type === "edit") {
      setTypes((current) => current.map((type) => (type.slug === dialogMode.slug ? { ...type, ...draft } : type)));
      closeDialog();
      return;
    }

    const parentSlug = dialogMode.type === "add-subcategory" ? dialogMode.parentSlug : null;
    const scopedOrder = types.filter((type) => (type.parentSlug ?? null) === parentSlug).length + 1;
    const slugBase = parentSlug ? `${parentSlug}-${slugify(draft.name)}` : slugify(draft.name);

    setTypes((current) => [
      ...current,
      {
        name: draft.name,
        slug: uniqueSlug(slugBase, current),
        image: draft.image,
        parentSlug,
        enabled: draft.enabled,
        categorySeed: draft.categorySeed,
        displayOrder: scopedOrder,
        children: []
      }
    ]);
    closeDialog();
  }

  function deleteType(target: PlatformPhotographyTypeView) {
    setTypes((current) => current.filter((type) => type.slug !== target.slug && type.parentSlug !== target.slug));
    setDeleteTarget(null);
  }

  function reorderTypes(activeSlug: string, targetSlug: string, parentSlug: string | null) {
    if (activeSlug === targetSlug) return;

    const scopedTypes = types
      .filter((type) => (type.parentSlug ?? null) === parentSlug)
      .sort((first, second) => first.displayOrder - second.displayOrder);
    const currentOrder = scopedTypes.map((type) => type.slug);
    const activeIndex = currentOrder.indexOf(activeSlug);
    const targetIndex = currentOrder.indexOf(targetSlug);

    if (activeIndex < 0 || targetIndex < 0) return;

    currentOrder.splice(activeIndex, 1);
    currentOrder.splice(targetIndex, 0, activeSlug);

    setTypes((current) =>
      current.map((type) =>
        (type.parentSlug ?? null) === parentSlug
          ? {
              ...type,
              displayOrder: currentOrder.indexOf(type.slug) + 1
            }
          : type
      )
    );
  }

  return (
    <>
      <AdminPanel
        title="Category Library"
        icon={Tags}
        actions={
          <>
            <AdminAddButton onClick={openAddCategoryDialog}>
              Add category
            </AdminAddButton>
            <Button type="button" onClick={save} disabled={isPending} className="bg-slate-950 text-white hover:bg-teal-800">
              <Save className="size-4" aria-hidden="true" />
              {isPending ? "Saving" : "Save categories"}
            </Button>
          </>
        }
      >
        <AdminStatusMessage>{message}</AdminStatusMessage>
        <AdminRecordGrid>
          {parentTypes.map((type) => {
            const children = types.filter((item) => item.parentSlug === type.slug).sort((a, b) => a.displayOrder - b.displayOrder);

            return (
              <AdminRecordCard
                key={type.slug}
                draggable
                onDragStart={() => setDraggedTypeSlug(type.slug)}
                onDragEnd={() => setDraggedTypeSlug(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedTypeSlug) {
                    reorderTypes(draggedTypeSlug, type.slug, null);
                  }
                  setDraggedTypeSlug(null);
                }}
                className={draggedTypeSlug === type.slug ? "border-teal-500 bg-teal-50/40 opacity-70" : "hover:border-slate-400"}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Category</p>
                    <h2 className="mt-1 truncate font-display text-2xl font-black tracking-[-0.04em] text-slate-950">{previewText(type.name)}</h2>
                    <p className="mt-1 font-mono text-xs text-slate-500">{type.slug}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Tooltip content="Drag category">
                      <AdminDragHandle label="Drag category" />
                    </Tooltip>
                    <AdminIconButton icon={Edit3} label={`Edit ${previewText(type.name)}`} tooltip="Edit category" onClick={() => openEditDialog(type)} className="size-8" />
                    <AdminIconButton icon={Trash2} label={`Delete ${previewText(type.name)}`} tooltip="Delete category" tone="danger" onClick={() => setDeleteTarget(type)} className="size-8" />
                    <Tooltip content="Add subcategory">
                      <Button type="button" size="sm" onClick={() => openAddSubcategoryDialog(type.slug)} className="size-8 bg-slate-950 p-0 text-white hover:bg-teal-800" aria-label={`Add subcategory under ${previewText(type.name)}`}>
                        <Plus className="size-4" aria-hidden="true" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <CategoryImage image={type.image} label={previewText(type.name)} className="mt-4 aspect-[16/9] w-full" />
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                  <AdminStatusPill active={type.enabled} activeLabel="Enabled" inactiveLabel="Hidden" />
                  <AdminStatusPill active={type.categorySeed} activeLabel="Seed" inactiveLabel="Custom only" />
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                    {children.length ? "Requires subcategory" : "Direct photos allowed"}
                  </span>
                </div>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-sm font-semibold text-slate-900">Subcategories</p>
                  <div className="mt-3 grid gap-2">
                    {children.map((child) => (
                      <div
                        key={child.slug}
                        draggable
                        onDragStart={(event) => {
                          event.stopPropagation();
                          setDraggedTypeSlug(child.slug);
                        }}
                        onDragEnd={() => setDraggedTypeSlug(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (draggedTypeSlug) {
                            reorderTypes(draggedTypeSlug, child.slug, type.slug);
                          }
                          setDraggedTypeSlug(null);
                        }}
                        className={`flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 transition ${
                          draggedTypeSlug === child.slug ? "border-teal-500 bg-teal-50/50 opacity-70" : "hover:border-slate-300"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-nav text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700">Subcategory</p>
                          <p className="truncate text-sm font-semibold text-slate-900">{previewText(child.name)}</p>
                          <p className="truncate font-mono text-xs text-slate-500">{child.slug}</p>
                        </div>
                        <CategoryImage image={child.image} label={previewText(child.name)} className="hidden h-12 w-16 shrink-0 sm:block" />
                        <div className="flex shrink-0 items-center gap-1">
                          <AdminDragHandle label="Drag subcategory" className="border-transparent" />
                          <AdminIconButton icon={Edit3} label={`Edit ${previewText(child.name)}`} onClick={() => openEditDialog(child)} className="size-8 border-transparent" />
                          <AdminIconButton icon={Trash2} label={`Delete ${previewText(child.name)}`} tone="danger" onClick={() => setDeleteTarget(child)} className="size-8 border-transparent" />
                        </div>
                      </div>
                    ))}
                    {children.length === 0 ? <AdminEmptyState title="No subcategories yet." className="p-3 text-left" /> : null}
                  </div>
                </div>
              </AdminRecordCard>
            );
          })}
        </AdminRecordGrid>
      </AdminPanel>

      <Dialog open={Boolean(dialogMode)} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[88vh] max-w-xl overflow-y-auto">
          {dialogMode ? (
            <>
              <DialogHeader>
                <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Category</p>
                <DialogTitle>{dialogTitle(dialogMode)}</DialogTitle>
                <p className="text-sm text-slate-500">{dialogDescription(dialogMode, types)}</p>
              </DialogHeader>
              <div className="grid gap-5">
              <LocalizedInput locales={locales} label="Name" value={draft.name} onChange={(name) => setDraft((current) => ({ ...current, name }))} />
              <Label className="text-sm font-medium text-slate-700">
                Photo URL
                <Input value={draft.image} onChange={(event) => setDraft((current) => ({ ...current, image: event.target.value }))} placeholder="https://..." className="mt-2 h-11" />
              </Label>
              <CategoryImage image={draft.image} label={previewText(draft.name) || "Category preview"} className="aspect-[16/9] w-full" />
              {dialogMode.type === "edit" ? <ReadOnlyField label="Slug" value={dialogMode.slug} /> : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <Label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-700">
                  <Checkbox checked={draft.enabled} onCheckedChange={(checked) => setDraft((current) => ({ ...current, enabled: checked === true }))} />
                  Enabled
                </Label>
                <Label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-700">
                  <Checkbox checked={draft.categorySeed} onCheckedChange={(checked) => setDraft((current) => ({ ...current, categorySeed: checked === true }))} />
                  Available as seed category
                </Label>
              </div>
              </div>
              <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="button" onClick={saveDialog} className="bg-slate-950 text-white hover:bg-teal-800">
                {dialogMode.type === "edit" ? "Update" : "Add"}
              </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${previewText(deleteTarget.name)}?` : "Delete category?"}
        body={deleteTarget?.parentSlug ? "This subcategory will be removed from the category library. Click save categories after this to persist the change." : "This category and its subcategories will be removed from the category library. Click save categories after this to persist the change."}
        onConfirm={() => deleteTarget && deleteType(deleteTarget)}
      />
    </>
  );
}

function CategoryImage({ image, label, className = "" }: { image: string; label: string; className?: string }) {
  if (!image) {
    return (
      <div className={`flex items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400 ${className}`}>
        <ImageIcon className="size-5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-md border border-slate-200 bg-slate-100 ${className}`}>
      <Image src={image} alt={label} fill unoptimized className="object-cover" />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Label className="text-sm font-medium text-slate-700">
      {label}
      <Input value={value} readOnly className="mt-2 h-11 bg-slate-50 text-slate-500" />
    </Label>
  );
}

function dialogTitle(mode: CategoryDialogMode) {
  if (mode.type === "edit") return "Edit category";
  return mode.type === "add-subcategory" ? "Add subcategory" : "Add category";
}

function dialogDescription(mode: CategoryDialogMode, types: PlatformPhotographyTypeView[]) {
  if (mode.type === "add-category") return "Type: Category. It can contain direct photos only when it has no subcategories.";
  if (mode.type === "add-subcategory") {
    const parent = types.find((type) => type.slug === mode.parentSlug);
    return `Type: Subcategory. Parent category: ${parent ? previewText(parent.name) : mode.parentSlug}.`;
  }

  const current = types.find((type) => type.slug === mode.slug);

  if (current?.parentSlug) {
    const parent = types.find((type) => type.slug === current.parentSlug);
    return `Type: Subcategory. Parent category: ${parent ? previewText(parent.name) : current.parentSlug}.`;
  }

  return "Type: Category. Subcategories can only belong to a category.";
}

function slugify(value: LocalizedString) {
  return (
    previewText(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

function previewText(value: LocalizedString) {
  return typeof value === "string" ? value : value.en ?? Object.values(value).find(Boolean) ?? "";
}

function uniqueSlug(baseSlug: string, types: PlatformPhotographyTypeView[]) {
  const existingSlugs = new Set(types.map((type) => type.slug));
  let slug = baseSlug;
  let index = 2;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}
