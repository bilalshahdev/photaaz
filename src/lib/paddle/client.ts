import { verifyPaddleWebhookSignatureWithSecret } from "@/lib/paddle/webhook-signature";
export { verifyPaddleWebhookSignatureWithSecret } from "@/lib/paddle/webhook-signature";
import { env } from "@/lib/env";

type PaddleTransactionResponse = {
  data?: {
    id?: string;
    checkout?: {
      url?: string;
    };
  };
  error?: {
    detail?: string;
    documentation_url?: string;
  };
};

export type PaddleTransactionData = Record<string, unknown> & {
  id?: string;
  status?: string;
  subscription_id?: string | null;
  customer_id?: string | null;
  custom_data?: Record<string, unknown> | null;
  billing_period_ends_at?: string | null;
  next_billed_at?: string | null;
};

export type PaddleSubscriptionData = Record<string, unknown> & {
  id?: string;
  status?: string;
  customer_id?: string | null;
  custom_data?: Record<string, unknown> | null;
  current_billing_period?: {
    starts_at?: string | null;
    ends_at?: string | null;
  } | null;
  next_billed_at?: string | null;
  cancel_at_period_end?: boolean | null;
};

type PaddleTransactionFetchResponse = {
  data?: PaddleTransactionData;
  error?: {
    detail?: string;
    documentation_url?: string;
  };
};

type PaddleSubscriptionFetchResponse = {
  data?: PaddleSubscriptionData;
  error?: {
    detail?: string;
    documentation_url?: string;
  };
};

export type PaddleBillingInterval = "monthly" | "annual" | "lifetime";

export function getPaddleConfig() {
  return {
    apiKey: env.PADDLE_API_KEY ?? "",
    environment: env.PADDLE_ENVIRONMENT,
    webhookSecret: env.PADDLE_WEBHOOK_SECRET ?? ""
  };
}

export function getPaddleApiBaseUrl() {
  return env.PADDLE_ENVIRONMENT === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
}

export async function createPaddleCheckoutTransaction(input: {
  priceId: string;
  tenantSlug: string;
  planKey: string;
  billingInterval: PaddleBillingInterval;
  customer?: {
    email?: string | null;
    name?: string | null;
  };
  successUrl: string;
}) {
  const apiKey = env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new Error("Paddle API key is not configured.");
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: [
        {
          price_id: input.priceId,
          quantity: 1
        }
      ],
      customer: input.customer?.email
        ? {
            email: input.customer.email,
            name: input.customer.name ?? undefined
          }
        : undefined,
      custom_data: {
        tenantSlug: input.tenantSlug,
        planKey: input.planKey,
        billingInterval: input.billingInterval
      },
      checkout: {
        url: input.successUrl
      }
    })
  });

  const payload = (await response.json().catch(() => null)) as PaddleTransactionResponse | null;

  if (!response.ok) {
    throw new Error(payload?.error?.detail ?? "Could not create Paddle checkout.");
  }

  const checkoutUrl = payload?.data?.checkout?.url;

  if (!payload?.data?.id || !checkoutUrl) {
    throw new Error("Paddle did not return a checkout URL.");
  }

  return {
    transactionId: payload.data.id,
    checkoutUrl
  };
}

export async function getPaddleTransaction(transactionId: string) {
  const apiKey = env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new Error("Paddle API key is not configured.");
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as PaddleTransactionFetchResponse | null;

  if (!response.ok) {
    throw new Error(payload?.error?.detail ?? "Could not verify Paddle transaction.");
  }

  if (!payload?.data?.id) {
    throw new Error("Paddle did not return transaction details.");
  }

  return payload.data;
}

export async function getPaddleSubscription(subscriptionId: string) {
  const apiKey = env.PADDLE_API_KEY;

  if (!apiKey) {
    throw new Error("Paddle API key is not configured.");
  }

  const response = await fetch(`${getPaddleApiBaseUrl()}/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as PaddleSubscriptionFetchResponse | null;

  if (!response.ok) {
    throw new Error(payload?.error?.detail ?? "Could not verify Paddle subscription.");
  }

  if (!payload?.data?.id) {
    throw new Error("Paddle did not return subscription details.");
  }

  return payload.data;
}

export function verifyPaddleWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = env.PADDLE_WEBHOOK_SECRET;

  return verifyPaddleWebhookSignatureWithSecret(rawBody, signatureHeader, secret);
}
