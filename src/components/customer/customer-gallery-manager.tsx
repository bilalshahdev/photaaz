"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Eye, Images, Trash2 } from "lucide-react";
import { createCustomerGallery, deleteCustomerGallery, updateCustomerGallery } from "@/actions/customer-gallery-actions";
import {
  CustomerAddButton,
  CustomerConfirmDialog,
  CustomerEmptyState,
  CustomerIconButton,
  CustomerIconLink,
  CustomerPanel,
  CustomerRecordCard,
  CustomerRecordGrid,
  CustomerStatusPill
} from "@/components/customer/customer-dashboard-ui";
import { CheckboxField, SelectField, TextareaField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { customerDashboardPath } from "@/config/routes";

type GalleryCategoryOption = {
  id: string;
  label: string;
};

type GalleryRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category?: string;
  categoryId: string | null;
  featured: boolean;
  published: boolean;
  photoCount: number;
  coverImage?: string;
};

type CustomerGalleryManagerProps = {
  tenantSlug: string;
  galleries: GalleryRecord[];
  categories: GalleryCategoryOption[];
};

export function CustomerGalleryManager({ tenantSlug, galleries, categories }: CustomerGalleryManagerProps) {
  return (
    <CustomerPanel
      title={`${galleries.length} galleries`}
      icon={Images}
      actions={<GalleryDialog tenantSlug={tenantSlug} categories={categories} />}
    >
      {galleries.length ? (
        <CustomerRecordGrid>
          {galleries.map((gallery) => (
            <CustomerRecordCard key={gallery.id} className="overflow-hidden p-0">
              <div className="relative aspect-[16/10] bg-slate-100">
                {gallery.coverImage ? (
                  <Image src={gallery.coverImage} alt={gallery.title} fill sizes="(min-width: 1280px) 28vw, (min-width: 640px) 42vw, 90vw" className="object-cover" />
                ) : (
                  <Images className="absolute left-5 top-5 size-6 text-slate-400" aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-3xl font-black tracking-[-0.04em] text-slate-950">{gallery.title}</h2>
                    <p className="mt-1 truncate text-sm text-slate-500">/{gallery.slug}</p>
                  </div>
                  <CustomerStatusPill active={gallery.published} activeLabel="Published" inactiveLabel="Draft" />
                </div>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{gallery.description ?? "No description yet."}</p>
                {gallery.category ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">{gallery.category}</p> : null}
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
                  <span className="font-medium text-slate-950">{gallery.photoCount} photos</span>
                  {gallery.featured ? <span className="font-semibold text-teal-700">Featured</span> : <span className="text-slate-400">Not featured</span>}
                </div>
                <div className="mt-auto flex justify-end gap-2 pt-4">
                  <CustomerIconLink href={customerDashboardPath(tenantSlug, `/galleries/${gallery.slug}`)} icon={Eye} label={`Open ${gallery.title}`} tooltip="Open gallery" />
                  <GalleryDialog tenantSlug={tenantSlug} categories={categories} gallery={gallery} />
                  <DeleteGalleryDialog tenantSlug={tenantSlug} gallery={gallery} />
                </div>
              </div>
            </CustomerRecordCard>
          ))}
        </CustomerRecordGrid>
      ) : (
        <CustomerEmptyState title="No galleries yet." body="Create a gallery after uploading photos, then group selected photos into it." />
      )}
    </CustomerPanel>
  );
}

function GalleryDialog({
  tenantSlug,
  categories,
  gallery
}: {
  tenantSlug: string;
  categories: GalleryCategoryOption[];
  gallery?: GalleryRecord;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const action = gallery ? updateCustomerGallery : createCustomerGallery;

  function submit(formData: FormData) {
    startTransition(async () => {
      await action(formData);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {gallery ? (
          <CustomerIconButton icon={Edit2} label={`Edit ${gallery.title}`} tooltip="Edit gallery" />
        ) : (
          <CustomerAddButton>Add gallery</CustomerAddButton>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gallery ? "Edit gallery" : "Add gallery"}</DialogTitle>
        </DialogHeader>
        <form action={submit} className="grid gap-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          {gallery ? <input type="hidden" name="galleryId" value={gallery.id} /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="title" required minLength={2} label="Gallery title" defaultValue={gallery?.title} placeholder="Wedding highlights" />
            <TextField name="slug" label="Slug" defaultValue={gallery?.slug} placeholder="wedding-highlights" />
          </div>
          <SelectField
            name="categoryId"
            label="Category"
            placeholder="No category"
            defaultValue={gallery?.categoryId ?? "none"}
            options={[
              { label: "No category", value: "none" },
              ...categories.map((category) => ({
                label: category.label,
                value: category.id
              }))
            ]}
          />
          <TextareaField name="description" label="Description" defaultValue={gallery?.description ?? ""} placeholder="Short story for this gallery." />
          <div className="grid gap-3 sm:grid-cols-2">
            <CheckboxField name="published" defaultChecked={gallery?.published} label="Published" description="Show this gallery on the public website." />
            <CheckboxField name="featured" defaultChecked={gallery?.featured} label="Featured" description="Highlight this gallery in featured sections." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving" : gallery ? "Save gallery" : "Create gallery"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteGalleryDialog({ tenantSlug, gallery }: { tenantSlug: string; gallery: GalleryRecord }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <CustomerIconButton icon={Trash2} label={`Delete ${gallery.title}`} tooltip="Delete gallery" tone="danger" onClick={() => setOpen(true)} />
      <CustomerConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Delete ${gallery.title}?`}
        body="This removes the gallery only. Photos inside it stay in the photo library and can be assigned again later."
        confirmLabel="Delete"
        pending={isPending}
        onConfirm={() => {
          const formData = new FormData();
          formData.set("tenantSlug", tenantSlug);
          formData.set("galleryId", gallery.id);
          startTransition(async () => {
            await deleteCustomerGallery(formData);
            setOpen(false);
            router.refresh();
          });
        }}
      />
    </>
  );
}
