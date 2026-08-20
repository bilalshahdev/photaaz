import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PaddleEnvironment = "sandbox" | "production";

type PaddleProductResponse = {
  data: {
    id: string;
  };
};

type PaddlePriceResponse = {
  data: {
    id: string;
  };
};

const environment = parseEnvironment(process.env.PADDLE_ENVIRONMENT);
const apiKey = process.env.PADDLE_API_KEY;
const apiBaseUrl = environment === "production" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";

async function main() {
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY is missing. Add your Paddle sandbox key to .env first.");
  }

  const plans = await prisma.plan.findMany({
    where: {
      enabled: true
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
  });

  for (const plan of plans) {
    const hasPaidPrice = Boolean(
      (plan.monthlyPrice && plan.monthlyPrice > 0) ||
        (plan.annualPrice && plan.annualPrice > 0) ||
        (plan.lifetimePrice && plan.lifetimePrice > 0)
    );

    if (!hasPaidPrice) {
      console.log(`Skipping ${plan.name}: no paid price.`);
      continue;
    }

    const productId =
      plan.paddleProductId ||
      (await createProduct({
        name: `Photaaz ${plan.name}`,
        description: plan.description || `Photaaz ${plan.name} portfolio package.`
      }));

    const monthlyPriceId =
      plan.paddleMonthlyPriceId ||
      (plan.monthlyPrice && plan.monthlyPrice > 0
        ? await createPrice({
            productId,
            amount: plan.monthlyPrice,
            name: "Monthly",
            description: `${plan.name} monthly subscription`,
            billingCycle: { interval: "month", frequency: 1 }
          })
        : null);

    const annualPriceId =
      plan.paddleAnnualPriceId ||
      (plan.annualPrice && plan.annualPrice > 0
        ? await createPrice({
            productId,
            amount: plan.annualPrice,
            name: "Annual",
            description: `${plan.name} annual subscription`,
            billingCycle: { interval: "year", frequency: 1 }
          })
        : null);

    const lifetimePriceId =
      plan.paddleLifetimePriceId ||
      (plan.lifetimePrice && plan.lifetimePrice > 0
        ? await createPrice({
            productId,
            amount: plan.lifetimePrice,
            name: "Ownership",
            description: `${plan.name} one-time ownership`,
            billingCycle: null
          })
        : null);

    await prisma.plan.update({
      where: { id: plan.id },
      data: {
        currency: "USD",
        paddleProductId: productId,
        paddleMonthlyPriceId: monthlyPriceId,
        paddleAnnualPriceId: annualPriceId,
        paddleLifetimePriceId: lifetimePriceId
      }
    });

    console.log(
      [
        `Configured ${plan.name}`,
        `product=${productId}`,
        monthlyPriceId ? `monthly=${monthlyPriceId}` : null,
        annualPriceId ? `annual=${annualPriceId}` : null,
        lifetimePriceId ? `ownership=${lifetimePriceId}` : null
      ]
        .filter(Boolean)
        .join(" | ")
    );
  }
}

async function createProduct(input: { name: string; description: string }) {
  const response = await paddleRequest<PaddleProductResponse>("/products", {
    name: input.name,
    description: input.description,
    tax_category: "saas",
    custom_data: {
      app: "photaaz"
    }
  });

  return response.data.id;
}

async function createPrice(input: {
  productId: string;
  amount: number;
  name: string;
  description: string;
  billingCycle: { interval: "month" | "year"; frequency: number } | null;
}) {
  const response = await paddleRequest<PaddlePriceResponse>("/prices", {
    product_id: input.productId,
    name: input.name,
    description: input.description,
    billing_cycle: input.billingCycle,
    unit_price: {
      amount: String(input.amount),
      currency_code: "USD"
    },
    quantity: {
      minimum: 1,
      maximum: 1
    },
    custom_data: {
      app: "photaaz"
    }
  });

  return response.data.id;
}

async function paddleRequest<TResponse>(path: string, body: Record<string, unknown>): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Paddle ${path} failed (${response.status}): ${JSON.stringify(payload)}`);
  }

  return payload as TResponse;
}

function parseEnvironment(value: string | undefined): PaddleEnvironment {
  return value === "production" ? "production" : "sandbox";
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
