import { notFound } from "next/navigation";
import { CheckCircle2, ClipboardList, Globe2, ShieldCheck } from "lucide-react";
import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
  CustomerPanel,
  CustomerStatusPill
} from "@/components/customer/customer-dashboard-ui";
import { customerPath } from "@/config/routes";
import { getCustomerSettingsView } from "@/services/tenant/customer-dashboard-data";

type CustomerDomainPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CustomerDomainPage({ params }: CustomerDomainPageProps) {
  const { slug } = await params;
  const data = await getCustomerSettingsView(slug);

  if (!data) {
    notFound();
  }

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Domain"
        title="Public website address."
        body="Your portfolio always has a free Photaaz address. One custom domain can be connected later when you are ready."
      />

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <CustomerPanel title="Current address" icon={Globe2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AddressCard
              title="Free Photaaz address"
              value={`${data.slug}.photaaz.com`}
              body={`Local preview: ${customerPath(data.slug)}`}
              active={!data.domain}
            />
            <AddressCard
              title="Custom domain"
              value={data.domain?.hostname ?? "Not connected yet"}
              body={data.domain ? `Status: ${formatDomainStatus(data.domain.status)}` : data.canUseCustomDomain ? "Included in your plan. You can request setup when ready." : "Upgrade to a plan that includes custom domain support."}
              active={Boolean(data.domain)}
            />
          </div>
        </CustomerPanel>

        <CustomerPanel title="How custom domain setup works" icon={ClipboardList}>
          <ol className="grid gap-3 text-sm leading-6 text-slate-600">
            <DomainStep title="1. Send your domain name" body="Example: yourstudio.com. The domain should already be purchased from any registrar." />
            <DomainStep title="2. Add the DNS records" body="Photaaz admin will provide the exact CNAME/A record values for your registrar." />
            <DomainStep title="3. Wait for verification" body="DNS can verify quickly, but sometimes it takes a few hours depending on the registrar." />
            <DomainStep title="4. Go live" body="Once verified, visitors can open the portfolio from the custom domain." />
          </ol>
        </CustomerPanel>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <CustomerPanel title="Domain status" icon={ShieldCheck}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-3xl font-black tracking-[-0.04em] text-slate-950">
                {data.domain ? formatDomainStatus(data.domain.status) : "Using free address"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {data.domain
                  ? "Custom domain status is controlled by DNS verification and admin approval."
                  : data.canUseCustomDomain
                    ? "The free address is enough to publish now. Request your custom domain when ready."
                    : "The free address is available on every plan. Custom domain setup is unlocked on paid plans."}
              </p>
            </div>
            <CustomerStatusPill active={Boolean(data.domain)} activeLabel={data.domain?.status ?? "CUSTOM"} inactiveLabel="FREE" />
          </div>
        </CustomerPanel>

        <CustomerPanel title="Important rule" icon={CheckCircle2}>
          <p className="text-sm leading-6 text-slate-600">
            Each portfolio has one primary custom domain. After it is verified, changing it should be requested through admin so SEO, redirects, and analytics stay clean.
          </p>
        </CustomerPanel>
      </section>
    </CustomerDashboardPage>
  );
}

function AddressCard({ title, value, body, active }: { title: string; value: string; body: string; active: boolean }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        <CustomerStatusPill active={active} activeLabel="Active" inactiveLabel="Standby" />
      </div>
      <p className="mt-4 break-words font-display text-2xl font-black tracking-[-0.04em] text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}

function DomainStep({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-1">{body}</p>
    </li>
  );
}

function formatDomainStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
