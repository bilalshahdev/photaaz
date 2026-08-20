import Image from "next/image";
import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { CategoriesEditor } from "@/components/admin/categories-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reviewCategoryRequest } from "@/app/admin/actions";
import { getAdminCategoryRequests, getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getPlatformPhotographyTypes, type LocalizedString } from "@/services/platform/platform-data";

export default async function AdminCategoriesPage() {
  const [types, requests, locales] = await Promise.all([getPlatformPhotographyTypes(), getAdminCategoryRequests(), getTranslationLocaleConfig()]);

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Categories"
        title="Manage categories and subcategories."
        body="Control the shared photography taxonomy. If a category has subcategories, customers must choose one of those subcategories when uploading photos."
      />
      <section className="mb-6 rounded-lg border border-slate-300 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-primary">Review Queue</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-[-0.04em]">Category requests</h2>
          </div>
          <p className="text-sm text-slate-500">{requests.filter((request) => request.status === "PENDING").length} pending</p>
        </div>
        <div className="mt-5 grid gap-3">
          {requests.length ? (
            requests.map((request) => (
              <article key={request.id} className="grid gap-4 rounded-md border border-slate-200 p-4 lg:grid-cols-[1fr_0.72fr]">
                <div className="flex gap-4">
                  <RequestThumbnail image={request.image} label={request.name} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-950">{request.name}</h3>
                      <span className={getRequestBadgeClass(request.status)}>{request.status}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Requested by {request.tenant.name} (/{request.tenant.slug}) - {request.parentType ? displayLocalized(request.parentType.name) : "Standalone category"} - Plan {request.tenant.subscription?.plan ? displayLocalized(request.tenant.subscription.plan.name) : "Free"}
                    </p>
                    {request.note ? <p className="mt-2 text-sm leading-6 text-slate-500">Client note: {request.note}</p> : null}
                    {request.adminNote ? <p className="mt-2 text-sm leading-6 text-slate-500">Admin note: {request.adminNote}</p> : null}
                  </div>
                </div>
                <form
                  action={async (formData) => {
                    "use server";
                    await reviewCategoryRequest({
                      id: request.id,
                      status: String(formData.get("status")) as "APPROVED" | "REJECTED",
                      adminNote: String(formData.get("adminNote") ?? "")
                    });
                  }}
                  className="grid gap-2 sm:grid-cols-[1fr_auto_auto]"
                >
                  <Input name="adminNote" placeholder="Admin note" defaultValue={request.adminNote ?? ""} />
                  <Button name="status" value="APPROVED" disabled={request.status !== "PENDING"} className="h-10 bg-primary font-nav text-xs uppercase tracking-[0.16em] hover:bg-primary/90">
                    Approve
                  </Button>
                  <Button name="status" value="REJECTED" variant="outline" disabled={request.status !== "PENDING"} className="h-10 font-nav text-xs uppercase tracking-[0.16em]">
                    Reject
                  </Button>
                </form>
              </article>
            ))
          ) : (
            <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No category requests yet.</p>
          )}
        </div>
      </section>
      <CategoriesEditor initialTypes={types} locales={locales.filter((locale) => locale.enabled)} />
    </AdminPage>
  );
}

function RequestThumbnail({ image, label }: { image: string; label: string }) {
  if (!image) {
    return <div className="hidden size-20 shrink-0 rounded-md border border-dashed border-slate-300 bg-slate-50 sm:block" />;
  }

  return (
    <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50 sm:block">
      <Image src={image} alt={`${label} thumbnail`} fill sizes="80px" className="object-cover" />
    </div>
  );
}

function getRequestBadgeClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary";
    case "REJECTED":
      return "rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700";
    default:
      return "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
  }
}

function displayLocalized(value: LocalizedString) {
  if (typeof value === "string") return value;
  return value.en || Object.values(value).find(Boolean) || "";
}
