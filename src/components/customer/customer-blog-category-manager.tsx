"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import {
  createCustomerBlogCategory,
  deleteCustomerBlogCategory,
  updateCustomerBlogCategory
} from "@/actions/customer-blog-actions";
import {
  CustomerAddButton,
  CustomerEmptyState,
  CustomerIconButton,
  CustomerPanel,
  CustomerRecordCard
} from "@/components/customer/customer-dashboard-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BlogCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
};

type CustomerBlogCategoryManagerProps = {
  tenantSlug: string;
  categories: BlogCategoryRecord[];
};

export function CustomerBlogCategoryManager({ tenantSlug, categories }: CustomerBlogCategoryManagerProps) {
  return (
    <CustomerPanel title={`${categories.length} blog categories`} icon={Edit2} actions={<CategoryDialog tenantSlug={tenantSlug} />}>
      {categories.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CustomerRecordCard key={category.id} className="min-h-0 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-slate-950">{category.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">/{category.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <CategoryDialog tenantSlug={tenantSlug} category={category} />
                  <DeleteCategoryDialog tenantSlug={tenantSlug} category={category} />
                </div>
              </div>
              {category.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p> : null}
              <p className="mt-4 text-sm font-semibold text-slate-500">{category.postCount} posts</p>
            </CustomerRecordCard>
          ))}
        </div>
      ) : (
        <CustomerEmptyState title="No blog categories yet." body="Create categories like Shoot Stories, Travel Notes, Client Tips, or Behind the Scenes." />
      )}
    </CustomerPanel>
  );
}

function CategoryDialog({ tenantSlug, category }: { tenantSlug: string; category?: BlogCategoryRecord }) {
  const [open, setOpen] = useState(false);
  const action = category ? updateCustomerBlogCategory : createCustomerBlogCategory;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {category ? (
          <CustomerIconButton icon={Edit2} label={`Edit ${category.name}`} tooltip="Edit category" />
        ) : (
          <CustomerAddButton>Add category</CustomerAddButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit blog category" : "Add blog category"}</DialogTitle>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          {category ? <input type="hidden" name="categoryId" value={category.id} /> : null}
          <div className="grid gap-2">
            <Label htmlFor={`blog-category-name-${category?.id ?? "new"}`}>Name</Label>
            <Input id={`blog-category-name-${category?.id ?? "new"}`} name="name" defaultValue={category?.name} required minLength={2} placeholder="Shoot Stories" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`blog-category-slug-${category?.id ?? "new"}`}>Slug</Label>
            <Input id={`blog-category-slug-${category?.id ?? "new"}`} name="slug" defaultValue={category?.slug} placeholder="shoot-stories" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`blog-category-description-${category?.id ?? "new"}`}>Description</Label>
            <Textarea id={`blog-category-description-${category?.id ?? "new"}`} name="description" defaultValue={category?.description} className="min-h-24" placeholder="Short note about this editorial category." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{category ? "Save category" : "Create category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCategoryDialog({ tenantSlug, category }: { tenantSlug: string; category: BlogCategoryRecord }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomerIconButton icon={Trash2} label={`Delete ${category.name}`} tooltip="Delete category" tone="danger" />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete blog category?</DialogTitle>
        </DialogHeader>
        <p className="text-sm leading-6 text-slate-600">
          Posts in “{category.name}” will remain, but they will no longer have this blog category.
        </p>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <form action={deleteCustomerBlogCategory}>
            <input type="hidden" name="tenantSlug" value={tenantSlug} />
            <input type="hidden" name="categoryId" value={category.id} />
            <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
