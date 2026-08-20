import { redirect } from "next/navigation";
import { PaddleCheckoutLauncher } from "@/components/paddle/paddle-checkout-launcher";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

type PaddleCheckoutPageProps = {
  searchParams?: Promise<{
    _ptxn?: string;
    transactionId?: string;
    returnTo?: string;
  }>;
};

export default async function PaddleCheckoutPage({ searchParams }: PaddleCheckoutPageProps) {
  const query = await searchParams;

  if (query?._ptxn) {
    const params = new URLSearchParams({
      _ptxn: query._ptxn
    });

    if (query.returnTo) {
      params.set("returnTo", query.returnTo);
    }

    redirect(`/checkout/paddle/return?${params.toString()}`);
  }

  return (
    <PaddleCheckoutLauncher
      transactionId={query?.transactionId}
      returnTo={query?.returnTo}
      clientToken={env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN}
      environment={env.PADDLE_ENVIRONMENT}
    />
  );
}
