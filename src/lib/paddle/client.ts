import { env } from "@/lib/env";

export function getPaddleConfig() {
  return {
    apiKey: env.PADDLE_API_KEY ?? "",
    webhookSecret: env.PADDLE_WEBHOOK_SECRET ?? ""
  };
}
