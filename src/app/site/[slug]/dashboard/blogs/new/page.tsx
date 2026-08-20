import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenText } from "lucide-react";
import {
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { CustomerBlogEditor } from "@/components/customer/customer-blog-editor";
import { customerDashboardPath } from "@/config/routes";
import { getCustomerBlogEditorView } from "@/services/tenant/customer-dashboard-data";

type NewCustomerBlogPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewCustomerBlogPage({ params }: NewCustomerBlogPageProps) {
  const { slug } = await params;
  const data = await getCustomerBlogEditorView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
        <Link href={customerDashboardPath(slug, "/blogs")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-700">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to blogs
        </Link>

        <CustomerPanel title="New Blog" icon={BookOpenText} className="mt-4">
          <div className="flex items-start gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">New Blog</p>
              <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Write a journal post.</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Create shoot stories, travel notes, behind-the-scenes updates, and SEO-friendly articles for the public portfolio.
              </p>
            </div>
          </div>
        </CustomerPanel>

        <section className="mt-5">
          <CustomerBlogEditor tenantSlug={slug} blogCategories={data.blogCategories} relatedCategories={data.relatedCategories} photos={data.photos} />
        </section>
    </CustomerDashboardPage>
  );
}
