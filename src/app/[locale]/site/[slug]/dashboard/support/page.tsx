import { notFound } from "next/navigation";
import { LifeBuoy, Mail, Phone } from "lucide-react";
import { updateTenantInquiryStatus } from "@/actions/tenant-inquiry-actions";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel
} from "@/components/customer/customer-dashboard-ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCustomerVisitorSupportView } from "@/services/tenant/customer-dashboard-data";

type CustomerSupportPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerSupportPage({ params }: CustomerSupportPageProps) {
  const { slug } = await params;
  const data = await getCustomerVisitorSupportView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
        <CustomerDashboardHeader
          eyebrow="Visitor Support"
          title="Website inquiries."
          body="Messages sent by visitors from your public portfolio contact form."
        />

        <CustomerPanel title={`${data.inquiries.length} visitor inquiries`} icon={LifeBuoy}>
          {data.inquiries.length ? (
            <div className="grid gap-4">
              {data.inquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-950">{inquiry.subject || "Portfolio inquiry"}</h2>
                      <p className="mt-1 text-sm text-slate-600">{inquiry.name}</p>
                    </div>
                    <span className={getInquiryBadgeClass(inquiry.status)}>{inquiry.status}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <a href={`mailto:${inquiry.email}`} className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800">
                      <Mail className="size-4" aria-hidden="true" />
                      {inquiry.email}
                    </a>
                    {inquiry.phone ? (
                      <a href={`tel:${inquiry.phone}`} className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800">
                        <Phone className="size-4" aria-hidden="true" />
                        {inquiry.phone}
                      </a>
                    ) : null}
                  </div>

                  <p className="mt-4 whitespace-pre-line rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                    {inquiry.message}
                  </p>

                  <form action={updateTenantInquiryStatus} className="mt-4 flex flex-col gap-2 sm:max-w-sm sm:flex-row">
                    <input type="hidden" name="tenantSlug" value={slug} />
                    <input type="hidden" name="inquiryId" value={inquiry.id} />
                    <Select name="status" defaultValue={inquiry.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Replied">Replied</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="submit">Save</Button>
                  </form>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <LifeBuoy className="mx-auto size-8 text-slate-400" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-950">No visitor inquiries yet.</p>
              <p className="mt-1 text-sm text-slate-500">Public contact form submissions will appear here.</p>
            </div>
          )}
        </CustomerPanel>
    </CustomerDashboardPage>
  );
}

function getInquiryBadgeClass(status: string) {
  switch (status) {
    case "Closed":
      return "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600";
    case "Replied":
      return "rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800";
    default:
      return "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
  }
}
