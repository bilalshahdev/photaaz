import { notFound } from "next/navigation";
import { BookOpenText, FileText } from "lucide-react";
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
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Blogs</p>
          <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.05em]">Manage journal posts.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Blog publishing is ready for the dashboard surface. The next pass can add the editor and rich content blocks.
          </p>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <BookOpenText className="size-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-8 font-display text-3xl font-black tracking-[-0.04em]">Posts</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{data.blogs.length} posts created.</p>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <FileText className="size-6 text-teal-700" aria-hidden="true" />
            <h2 className="mt-8 font-display text-3xl font-black tracking-[-0.04em]">Published Pages</h2>
            <div className="mt-4 space-y-2">
              {data.pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm">
                  <span>{page.title}</span>
                  <span className={page.published ? "text-teal-700" : "text-slate-500"}>{page.published ? "Published" : "Draft"}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
