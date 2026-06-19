import { env } from "@/lib/env";

export function getResendConfig() {
  return {
    apiKey: env.RESEND_API_KEY ?? ""
  };
}
