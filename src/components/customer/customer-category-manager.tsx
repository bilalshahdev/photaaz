"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { ChevronDown, Eye, FolderPlus, FolderTree, ImageIcon, Link2, PlusCircle, Trash2 } from "lucide-react";
import { linkCustomerCategory, unlinkCustomerCategory } from "@/actions/customer-category-actions";
import { requestCustomerCategory } from "@/app/site/[slug]/dashboard/galleries/photo-actions";
import { AdminTable, AdminTableEmptyRow } from "@/components/admin/admin-crud-ui";
import {
  CustomerAddButton,
  CustomerConfirmDialog,
  CustomerEmptyState,
  CustomerIconButton,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { ImageDropField, SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { DirectUploadForm } from "@/components/forms/direct-upload-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { customerDashboardPath } from "@/config/routes";

type LinkedCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  albumCount: number;
  photoCount: number;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
    albumCount: number;
    photoCount: number;
  }>;
};

type AvailableCategory = {
  slug: string;
  name: string;
  image: string;
  linked: boolean;
  children: Array<{
    slug: string;
    name: string;
    image: string;
    linked: boolean;
  }>;
};

type ParentCategoryOption = {
  slug: string;
  name: string;
};

type CategoryRequest = {
  id: string;
  name: string;
  status: string;
  image: string;
  parentName?: string;
  adminNote?: string | null;
};

type CustomerCategoryManagerProps = {
  tenantSlug: string;
  categories: LinkedCategory[];
  availableCategories: AvailableCategory[];
  canRequestCustomCategories: boolean;
  categoryRequestLimit: number | null;
  parentCategoryOptions: ParentCategoryOption[];
  requests: CategoryRequest[];
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image: string;
  type: "Category" | "Subcategory";
  parentName: string;
  albumCount: number;
  photoCount: number;
};

export function CustomerCategoryManager({
  tenantSlug,
  categories,
  availableCategories,
  canRequestCustomCategories,
  categoryRequestLimit,
  parentCategoryOptions,
  requests
}: CustomerCategoryManagerProps) {
  const [isAvailableOpen, setIsAvailableOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<CategoryRow | null>(null);
  const [isUnlinking, startUnlinkTransition] = useTransition();
  const rows = useMemo(() => flattenCategoryRows(categories), [categories]);

  function confirmUnlink() {
    if (!unlinkTarget) return;

    const formData = new FormData();
    formData.set("tenantSlug", tenantSlug);
    formData.set("categoryId", unlinkTarget.id);

    startUnlinkTransition(async () => {
      await unlinkCustomerCategory(formData);
      setUnlinkTarget(null);
    });
  }

  return (
    <>
      <div className="grid gap-5">
        <CustomerPanel
          title="Linked categories"
          icon={FolderTree}
          actions={
            <CustomerAddButton onClick={() => setIsAvailableOpen(true)} icon={FolderPlus}>
              Add from available
            </CustomerAddButton>
          }
        >
          <AdminTable minWidth="880px">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Parent</th>
                <th className="px-4 py-3 text-right font-semibold">Galleries</th>
                <th className="px-4 py-3 text-right font-semibold">Photos</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.length ? (
                rows.map((row) => (
                  <tr key={row.id} className="align-middle">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <CategoryThumb image={row.image} label={row.name} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-950">{row.name}</p>
                          <p className="truncate font-mono text-xs text-slate-400">{row.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{row.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.parentName || "-"}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{row.albumCount}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">{row.photoCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm" className="size-9 bg-white p-0" aria-label={`Open ${row.name}`}>
                          <Link href={customerDashboardPath(tenantSlug, `/categories/${row.slug}`)}>
                            <Eye className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <CustomerIconButton icon={Trash2} label={`Delink ${row.name}`} tooltip="Delink" tone="danger" onClick={() => setUnlinkTarget(row)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <AdminTableEmptyRow colSpan={6}>No linked categories yet.</AdminTableEmptyRow>
              )}
            </tbody>
          </AdminTable>
        </CustomerPanel>

        <div className="grid gap-5 xl:grid-cols-2">
          <CustomerPanel
            title="Category requests"
            icon={PlusCircle}
            actions={
              <CustomerAddButton onClick={() => setIsRequestOpen(true)} disabled={!canRequestCustomCategories}>
                Request new
              </CustomerAddButton>
            }
          >
            <RequestLimitNotice canRequest={canRequestCustomCategories} limit={categoryRequestLimit} />
          </CustomerPanel>

          <CustomerPanel title="Recent requests" icon={FolderTree}>
            <RequestList requests={requests} />
          </CustomerPanel>
        </div>
      </div>

      <AvailableCategoriesDialog
        tenantSlug={tenantSlug}
        open={isAvailableOpen}
        onOpenChange={setIsAvailableOpen}
        categories={availableCategories}
      />
      <RequestCategoryDialog
        tenantSlug={tenantSlug}
        open={isRequestOpen}
        onOpenChange={setIsRequestOpen}
        disabled={!canRequestCustomCategories}
        parentCategoryOptions={parentCategoryOptions}
      />
      <CustomerConfirmDialog
        open={Boolean(unlinkTarget)}
        onOpenChange={(open) => !open && setUnlinkTarget(null)}
        title={unlinkTarget ? `Delink ${unlinkTarget.name}?` : "Delink category?"}
        body="This removes the category from this customer dashboard. Existing photos and galleries will become uncategorized instead of being deleted."
        confirmLabel="Delink"
        pending={isUnlinking}
        onConfirm={confirmUnlink}
      />
    </>
  );
}

function AvailableCategoriesDialog({
  tenantSlug,
  open,
  onOpenChange,
  categories
}: {
  tenantSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: AvailableCategory[];
}) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  function toggleGroup(slug: string) {
    setExpandedGroups((current) => ({
      ...current,
      [slug]: !current[slug]
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add from available categories</DialogTitle>
        </DialogHeader>
        {categories.length ? (
          <div className="grid gap-3">
            {categories.map((category) => {
              const hasChildren = category.children.length > 0;
              const isExpanded = expandedGroups[category.slug] ?? hasChildren;
              const linkedChildren = category.children.filter((child) => child.linked).length;

              return (
                <article key={category.slug} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <CategoryThumb image={category.image} label={category.name} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-950">{category.name}</p>
                      {hasChildren ? <p className="text-xs text-slate-500">{category.children.length} subcategories</p> : null}
                    </div>
                    {hasChildren ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 gap-2 bg-white"
                        onClick={() => toggleGroup(category.slug)}
                      >
                        <ChevronDown className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
                        {linkedChildren ? `${linkedChildren}/${category.children.length} linked` : "View"}
                      </Button>
                    ) : (
                      <LinkCategoryButton tenantSlug={tenantSlug} platformSlug={category.slug} disabled={category.linked}>
                        {category.linked ? "Linked" : "Add"}
                      </LinkCategoryButton>
                    )}
                  </div>

                  {hasChildren && isExpanded ? (
                    <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
                      {category.children.map((child) => (
                        <div key={child.slug} className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-2 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                          <div className="flex items-center gap-3">
                            <CategoryThumb image={child.image} label={child.name} small />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">{child.name}</p>
                            </div>
                          </div>
                          <span className="hidden text-xs font-medium text-slate-500 sm:block">{category.name}</span>
                          <LinkCategoryButton tenantSlug={tenantSlug} platformSlug={child.slug} disabled={child.linked}>
                            {child.linked ? "Linked" : "Add"}
                          </LinkCategoryButton>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <CustomerEmptyState title="No available categories." body="Ask the super admin to enable photography categories first." />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LinkCategoryButton({
  tenantSlug,
  platformSlug,
  disabled,
  children
}: {
  tenantSlug: string;
  platformSlug: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  function submit() {
    const formData = new FormData();
    formData.set("tenantSlug", tenantSlug);
    formData.set("platformSlug", platformSlug);

    startTransition(async () => {
      await linkCustomerCategory(formData);
    });
  }

  return (
    <Button type="button" size="sm" onClick={submit} disabled={disabled || isPending} className="min-w-20">
      <Link2 className="size-4" aria-hidden="true" />
      {isPending ? "Adding" : children}
    </Button>
  );
}

function RequestCategoryDialog({
  tenantSlug,
  open,
  onOpenChange,
  disabled,
  parentCategoryOptions
}: {
  tenantSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  parentCategoryOptions: ParentCategoryOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      await requestCustomerCategory(formData);
      formRef.current?.reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request new category</DialogTitle>
        </DialogHeader>
        <DirectUploadForm formRef={formRef} action={submit} className="grid gap-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <SelectField
            name="parentSlug"
            disabled={disabled}
            label="Category group"
            placeholder="Standalone category"
            options={[
              { label: "Standalone category", value: "none" },
              ...parentCategoryOptions.map((category) => ({
                label: category.name,
                value: category.slug
              }))
            ]}
          />
          <TextField name="name" required minLength={2} disabled={disabled} label="Category name" placeholder="Category name" />
          <ImageDropField name="imageFile" label="Suggested thumbnail" disabled={disabled} uploadArea="categories" />
          <TextareaField name="note" disabled={disabled} label="Note" placeholder="Why do you need it?" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={disabled || isPending}>
              {isPending ? "Sending" : "Send request"}
            </Button>
          </DialogFooter>
        </DirectUploadForm>
      </DialogContent>
    </Dialog>
  );
}

function RequestLimitNotice({ canRequest, limit }: { canRequest: boolean; limit: number | null }) {
  if (!canRequest) {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
        Custom category requests are not enabled for your current package.
      </p>
    );
  }

  if (limit == null) {
    return (
      <p className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-900">
        Your package allows unlimited category requests.
      </p>
    );
  }

  return (
    <p className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-teal-900">
      Your package allows {limit} category request{limit === 1 ? "" : "s"}.
    </p>
  );
}

function RequestList({ requests }: { requests: CategoryRequest[] }) {
  if (!requests.length) {
    return <CustomerEmptyState title="No category requests yet." body="Requests you send for approval will appear here." />;
  }

  return (
    <div className="grid gap-2">
      {requests.map((request) => (
        <article key={request.id} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <CategoryThumb image={request.image} label={request.name} small />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-medium text-slate-950">{request.name}</span>
              <span className={getRequestBadgeClass(request.status)}>{request.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{request.parentName ? `Under ${request.parentName}` : "Parent category"}</p>
            {request.adminNote ? <p className="mt-2 text-xs text-slate-500">Admin note: {request.adminNote}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function CategoryThumb({ image, label, small = false }: { image: string; label: string; small?: boolean }) {
  const sizeClassName = small ? "size-10" : "size-12";

  if (!image) {
    return (
      <div className={`flex ${sizeClassName} shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-slate-400`}>
        <ImageIcon className="size-4" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClassName} shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white`}>
      <Image src={image} alt={`${label} thumbnail`} fill sizes={small ? "40px" : "48px"} className="object-cover" />
    </div>
  );
}

function flattenCategoryRows(categories: LinkedCategory[]): CategoryRow[] {
  return categories.flatMap((category) => [
    {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      type: "Category" as const,
      parentName: "",
      albumCount: category.albumCount,
      photoCount: category.photoCount
    },
    ...category.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      image: child.image,
      type: "Subcategory" as const,
      parentName: category.name,
      albumCount: child.albumCount,
      photoCount: child.photoCount
    }))
  ]);
}

function getRequestBadgeClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "rounded-full bg-teal-50 px-2.5 py-1 text-[0.65rem] font-semibold text-teal-800";
    case "REJECTED":
      return "rounded-full bg-red-50 px-2.5 py-1 text-[0.65rem] font-semibold text-red-700";
    default:
      return "rounded-full bg-amber-50 px-2.5 py-1 text-[0.65rem] font-semibold text-amber-800";
  }
}
