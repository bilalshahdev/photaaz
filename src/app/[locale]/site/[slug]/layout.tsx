import { notFound, redirect } from "next/navigation";
import type { Route } from "next";
import { isReservedSlug } from "@/config/reserved-slugs";
import { customerDemos } from "@/data/customer-demos";
import { getCustomerSiteView } from "@/services/tenant/customer-site-data";

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  if (isReservedSlug(slug)) {
    redirect("/" as Route);
  }

  const site = (await getCustomerSiteView(slug)) ?? customerDemos[slug];

  if (!site) {
    notFound();
  }

  return <div data-tenant={slug}>{children}</div>;
}
