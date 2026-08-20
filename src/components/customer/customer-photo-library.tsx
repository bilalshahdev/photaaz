"use client";

import Image from "next/image";
import { Edit2, ImageIcon, Save, Trash2, UploadCloud } from "lucide-react";
import { createCustomerPhoto, deleteCustomerPhoto, updateCustomerPhoto } from "@/app/site/[slug]/dashboard/galleries/photo-actions";
import { CustomerPhotoCategorySelect, type PhotoCategoryOption } from "@/components/customer/customer-photo-category-select";
import { CustomerAddButton, CustomerEmptyState, CustomerIconButton, CustomerPanel, CustomerRecordCard, CustomerRecordGrid } from "@/components/customer/customer-dashboard-ui";
import { CheckboxField, ImageDropField, SelectField, TextField } from "@/components/forms/form-controls";
import { Button } from "@/components/ui/button";
import { DirectUploadForm } from "@/components/forms/direct-upload-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type PhotoRecord = {
  id: string;
  title: string;
  alt: string;
  image: string;
  status: string;
  categoryId: string | null;
  albumId: string | null;
  category: string;
  gallery: string;
};

type GalleryOption = {
  id: string;
  label: string;
};

type CustomerPhotoLibraryProps = {
  tenantSlug: string;
  categories: PhotoCategoryOption[];
  galleries: GalleryOption[];
  photos: PhotoRecord[];
};

export function CustomerPhotoLibrary({ tenantSlug, categories, galleries, photos }: CustomerPhotoLibraryProps) {
  return (
    <CustomerPanel
      title="Photo library"
      icon={ImageIcon}
      className="mt-5"
      actions={<AddPhotoDialog tenantSlug={tenantSlug} categories={categories} galleries={galleries} />}
    >
      {photos.length ? (
        <CustomerRecordGrid>
          {photos.map((photo) => (
            <CustomerRecordCard key={photo.id} className="overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image src={photo.image} alt={photo.alt} fill sizes="(min-width: 1280px) 28vw, (min-width: 640px) 42vw, 90vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-slate-950">{photo.title}</h2>
                  <span className={getPhotoBadgeClass(photo.status)}>{photo.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{photo.category}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{photo.gallery}</p>
                <div className="mt-auto flex justify-end gap-2 pt-4">
                  <EditPhotoDialog tenantSlug={tenantSlug} categories={categories} galleries={galleries} photo={photo} />
                  <DeletePhotoDialog tenantSlug={tenantSlug} photo={photo} />
                </div>
              </div>
            </CustomerRecordCard>
          ))}
        </CustomerRecordGrid>
      ) : (
        <CustomerEmptyState
          title="No photos uploaded yet."
          body="Use Add photo when you are ready to submit images for review."
        />
      )}
    </CustomerPanel>
  );
}

function AddPhotoDialog({ tenantSlug, categories, galleries }: { tenantSlug: string; categories: PhotoCategoryOption[]; galleries: GalleryOption[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomerAddButton>Add photo</CustomerAddButton>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add photo</DialogTitle>
        </DialogHeader>
        <DirectUploadForm action={createCustomerPhoto} className="grid gap-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <TextField name="title" required minLength={2} label="Photo title" placeholder="Photo title" />
          <CustomerPhotoCategorySelect categories={categories} />
          <GallerySelect galleries={galleries} />
          <ImageDropField name="imageFile" label="Photo file" required uploadArea="photos" />
          <CheckboxField
            name="rightsConfirmed"
            required
            label="I own the rights to this photo"
            description="I have permission to publish it, and it follows Photaaz acceptable-use rules."
            wrapperClassName="border-amber-200 bg-amber-50 text-amber-950"
          />
          <DialogFooter>
            <Button type="submit">
              <UploadCloud className="size-4" aria-hidden="true" />
              Upload for review
            </Button>
          </DialogFooter>
        </DirectUploadForm>
      </DialogContent>
    </Dialog>
  );
}

function EditPhotoDialog({ tenantSlug, categories, galleries, photo }: { tenantSlug: string; categories: PhotoCategoryOption[]; galleries: GalleryOption[]; photo: PhotoRecord }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomerIconButton icon={Edit2} label={`Edit ${photo.title}`} />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit photo</DialogTitle>
        </DialogHeader>
        <form action={updateCustomerPhoto} className="grid gap-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <input type="hidden" name="photoId" value={photo.id} />
          <TextField name="title" defaultValue={photo.title} label="Photo title" />
          <CustomerPhotoCategorySelect categories={categories} defaultValue={photo.categoryId} />
          <GallerySelect galleries={galleries} defaultValue={photo.albumId} />
          <DialogFooter>
            <Button type="submit">
              <Save className="size-4" aria-hidden="true" />
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GallerySelect({ galleries, defaultValue }: { galleries: GalleryOption[]; defaultValue?: string | null }) {
  return (
    <SelectField
      name="albumId"
      label="Gallery"
      placeholder="Not in gallery"
      defaultValue={defaultValue ?? "none"}
      options={[
        { label: "Not in gallery", value: "none" },
        ...galleries.map((gallery) => ({
          label: gallery.label,
          value: gallery.id
        }))
      ]}
    />
  );
}

function DeletePhotoDialog({ tenantSlug, photo }: { tenantSlug: string; photo: PhotoRecord }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomerIconButton icon={Trash2} label={`Delete ${photo.title}`} tone="danger" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete photo?</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-slate-600">
          This will remove <span className="font-semibold text-slate-950">{photo.title}</span> from the library.
        </p>
        <form action={deleteCustomerPhoto}>
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <input type="hidden" name="photoId" value={photo.id} />
          <DialogFooter>
            <Button type="submit" className="bg-red-700 hover:bg-red-800">
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getPhotoBadgeClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "rounded-full bg-teal-50 px-2.5 py-1 text-[0.65rem] font-semibold text-teal-800";
    case "REJECTED":
    case "FLAGGED":
      return "rounded-full bg-red-50 px-2.5 py-1 text-[0.65rem] font-semibold text-red-700";
    default:
      return "rounded-full bg-amber-50 px-2.5 py-1 text-[0.65rem] font-semibold text-amber-800";
  }
}
