import { notFound } from "next/navigation";
import { BookOpenText } from "lucide-react";
import { CustomerBlogActions } from "@/components/customer/customer-blog-actions";
import {
  CustomerAddButton,
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerEmptyState,
  CustomerPanel,
  CustomerRecordCard,
  CustomerStatusPill
} from "@/components/customer/customer-dashboard-ui";
import { customerDashboardPath } from "@/config/routes";
import { getCustomerContentView } from "@/services/tenant/customer-dashboard-data";

type CustomerBlogsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerBlogsPage({ params }: CustomerBlogsPageProps) {
  const { slug } = await params;
  const data = await getCustomerContentView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Blogs"
        title="Manage journal posts."
        body="Publish stories, shoot notes, and SEO-friendly articles for your public portfolio."
      />

      <section className="mt-5">
          <CustomerPanel
            title={`${data.blogs.length} posts`}
            icon={BookOpenText}
            actions={
              <CustomerAddButton href={customerDashboardPath(slug, "/blogs/new")}>Add blog</CustomerAddButton>
            }
          >
            {data.blogs.length ? (
              <div className="grid gap-3">
                {data.blogs.map((blog) => (
                  <CustomerRecordCard key={blog.id} className="min-h-0 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-slate-950">{blog.title}</h2>
                        <p className="mt-1 text-sm text-slate-500">/{blog.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CustomerStatusPill
                          active={blog.moderationStatus === "APPROVED"}
                          activeLabel="Approved"
                          inactiveLabel={blog.moderationStatus === "PENDING" ? "In review" : blog.moderationStatus === "REJECTED" ? "Rejected" : "Draft"}
                          inactiveClassName={
                            blog.moderationStatus === "REJECTED"
                              ? "bg-red-50 text-red-700"
                              : blog.moderationStatus === "PENDING"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-800"
                          }
                        />
                        <CustomerBlogActions
                          tenantSlug={slug}
                          blog={{
                            id: blog.id,
                            slug: blog.slug,
                            title: blog.title,
                            isPublic: blog.moderationStatus === "APPROVED" && Boolean(blog.publishedAt)
                          }}
                        />
                      </div>
                    </div>
                    {blog.excerpt ? <p className="mt-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p> : null}
                  </CustomerRecordCard>
                ))}
              </div>
            ) : (
              <CustomerEmptyState
                title="No blog posts yet."
                body="Create the first story from your portfolio dashboard."
              />
            )}
          </CustomerPanel>
        </section>
    </CustomerDashboardPage>
  );
}
