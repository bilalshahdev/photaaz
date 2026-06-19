import { redirect } from "next/navigation";
import type { Route } from "next";
import { isReservedSlug } from "@/config/reserved-slugs";

export default async function CustomerLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  if (isReservedSlug(slug)) {
    redirect("/" as Route);
  }

  return <div data-tenant={slug}>{children}</div>;
}
