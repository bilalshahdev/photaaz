"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { deleteCustomerBlogPost } from "@/actions/customer-blog-actions";
import { CustomerIconLink, CustomerIconButton } from "@/components/customer/customer-dashboard-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { customerDashboardPath, customerPath } from "@/config/routes";

type CustomerBlogActionsProps = {
  tenantSlug: string;
  blog: {
    id: string;
    slug: string;
    title: string;
    isPublic: boolean;
  };
};

export function CustomerBlogActions({ tenantSlug, blog }: CustomerBlogActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {blog.isPublic ? (
        <CustomerIconLink
          href={customerPath(tenantSlug, `/blog/${blog.slug}`)}
          icon={ExternalLink}
          label={`View ${blog.title}`}
          tooltip="View public post"
        />
      ) : null}
      <CustomerIconLink
        href={customerDashboardPath(tenantSlug, `/blogs/${blog.id}`)}
        icon={Pencil}
        label={`Edit ${blog.title}`}
        tooltip="Edit blog"
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <CustomerIconButton icon={Trash2} label={`Delete ${blog.title}`} tooltip="Delete blog" tone="danger" />
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete blog?</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-6 text-slate-600">
            This will permanently remove “{blog.title}” from the dashboard and public website.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form action={deleteCustomerBlogPost}>
              <input type="hidden" name="tenantSlug" value={tenantSlug} />
              <input type="hidden" name="blogId" value={blog.id} />
              <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
                Delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
