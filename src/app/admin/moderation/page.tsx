import Image from "next/image";
import { BookOpenText, ShieldAlert } from "lucide-react";
import { z } from "zod";
import { updateBlogModeration, updatePhotoModeration } from "@/app/admin/actions";
import { AdminPage, AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminModerationPage() {
  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 60,
    include: {
      tenant: {
        select: {
          name: true,
          slug: true
        }
      },
      category: {
        include: {
          parent: true
        }
      }
    }
  });
  const blogs = await prisma.blogPost.findMany({
    where: {
      moderationStatus: {
        in: ["PENDING", "REJECTED"]
      }
    },
    orderBy: {
      updatedAt: "desc"
    },
    take: 40,
    include: {
      tenant: {
        select: {
          name: true,
          slug: true
        }
      },
      category: {
        include: {
          parent: true
        }
      }
    }
  });

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Moderation"
        title="Review uploaded photos."
        body="Approve, reject, or flag customer uploads before they appear on public portfolio pages."
      />

      <AdminPanel icon={BookOpenText} title="Blog review queue" className="mb-5">
        {blogs.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {blogs.map((blog) => (
              <article key={blog.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={statusClass(blog.moderationStatus)}>{blog.moderationStatus}</span>
                    <h2 className="mt-4 font-semibold text-slate-950">{blog.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {blog.tenant.name} / {blog.tenant.slug} / {blog.slug}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {blog.category?.parent ? `${blog.category.parent.name} / ${blog.category.name}` : blog.category?.name ?? "No related category"}
                    </p>
                  </div>
                </div>
                {blog.excerpt ? <p className="mt-4 text-sm leading-6 text-slate-600">{blog.excerpt}</p> : null}
                {blog.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <form action={moderateBlog.bind(null, blog.id)} className="mt-4 grid gap-3">
                  <Textarea name="moderationNote" defaultValue={blog.moderationNote ?? ""} placeholder="Moderation note" className="min-h-20 text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <Button name="status" value="APPROVED" className="h-10 bg-teal-700 px-3 text-sm font-semibold text-white hover:bg-teal-800">
                      Approve
                    </Button>
                    <Button name="status" value="REJECTED" className="h-10 bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-700">
                      Reject
                    </Button>
                  </div>
                </form>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">No blog posts waiting for review.</p>
        )}
      </AdminPanel>

      <AdminPanel icon={ShieldAlert} title="Recent uploads">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image src={photo.secureUrl} alt={photo.alt} fill className="object-cover" />
                <span className={`absolute right-3 top-3 ${statusClass(photo.moderationStatus)}`}>{photo.moderationStatus}</span>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <h2 className="font-semibold text-slate-950">{photo.title ?? photo.alt}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {photo.tenant.name} / {photo.tenant.slug}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {photo.category?.parent ? `${photo.category.parent.name} / ${photo.category.name}` : photo.category?.name ?? "No category"}
                  </p>
                </div>

                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                  <p>Rights confirmed: {photo.rightsConfirmed ? "Yes" : "No"}</p>
                  <p>Accepted: {photo.rightsAcceptedAt ? photo.rightsAcceptedAt.toLocaleString() : "Not recorded"}</p>
                  <p>User agent: {photo.uploadUserAgent ?? "Not recorded"}</p>
                </div>

                <form action={moderatePhoto.bind(null, photo.id)} className="grid gap-3">
                  <Textarea name="moderationNote" defaultValue={photo.moderationNote ?? ""} placeholder="Moderation note" className="min-h-20 text-sm" />
                  <div className="grid grid-cols-3 gap-2">
                    <Button name="status" value="APPROVED" className="h-10 bg-teal-700 px-3 text-sm font-semibold text-white hover:bg-teal-800">
                      Approve
                    </Button>
                    <Button name="status" value="FLAGGED" className="h-10 bg-amber-500 px-3 text-sm font-semibold text-white hover:bg-amber-600">
                      Flag
                    </Button>
                    <Button name="status" value="REJECTED" className="h-10 bg-red-600 px-3 text-sm font-semibold text-white hover:bg-red-700">
                      Reject
                    </Button>
                  </div>
                </form>
              </div>
            </article>
          ))}
        </div>
      </AdminPanel>
    </AdminPage>
  );
}

async function moderatePhoto(photoId: string, formData: FormData) {
  "use server";
  const status = z.enum(["PENDING", "APPROVED", "REJECTED", "FLAGGED"]).parse(String(formData.get("status")));

  await updatePhotoModeration({
    photoId,
    status,
    moderationNote: String(formData.get("moderationNote") ?? "")
  });
}

async function moderateBlog(blogId: string, formData: FormData) {
  "use server";
  const status = z.enum(["APPROVED", "REJECTED"]).parse(String(formData.get("status")));

  await updateBlogModeration({
    blogId,
    status,
    moderationNote: String(formData.get("moderationNote") ?? "")
  });
}

function statusClass(status: string) {
  const base = "inline-flex rounded-full px-3 py-1 text-xs font-semibold";
  switch (status) {
    case "APPROVED":
      return `${base} bg-teal-50 text-teal-800`;
    case "REJECTED":
      return `${base} bg-red-50 text-red-700`;
    case "FLAGGED":
      return `${base} bg-amber-50 text-amber-800`;
    default:
      return `${base} bg-slate-950 text-white`;
  }
}
