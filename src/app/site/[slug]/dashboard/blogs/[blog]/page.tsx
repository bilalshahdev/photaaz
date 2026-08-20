import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenText } from "lucide-react";
import {
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { CustomerBlogEditor } from "@/components/customer/customer-blog-editor";
import { customerDashboardPath } from "@/config/routes";
import { getCustomerBlogPostEditorView } from "@/services/tenant/customer-dashboard-data";

type EditCustomerBlogPageProps = {
  params: Promise<{ slug: string; blog: string }>;
};

export default async function EditCustomerBlogPage({ params }: EditCustomerBlogPageProps) {
  const { slug, blog } = await params;
  const data = await getCustomerBlogPostEditorView(slug, blog);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
      <Link href={customerDashboardPath(slug, "/blogs")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to blogs
      </Link>

      <CustomerPanel title="Edit Blog" icon={BookOpenText} className="mt-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Edit Blog</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Update journal post.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Saving a published or reviewed post sends it back for admin review before it appears publicly again.
          </p>
        </div>
      </CustomerPanel>

      <section className="mt-5">
        <CustomerBlogEditor tenantSlug={slug} blogCategories={data.blogCategories} relatedCategories={data.relatedCategories} photos={data.photos} blog={data.blog} />
      </section>
    </CustomerDashboardPage>
  );
}
