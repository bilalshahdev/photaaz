import crypto from "node:crypto";

export function verifyPaddleWebhookSignatureWithSecret(
  rawBody: string,
  signatureHeader: string | null,
  secret: string | undefined,
  options: { nowSeconds?: number; toleranceSeconds?: number } = {},
) {
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(signatureHeader.split(";").map((part) => {
    const [key, value] = part.split("=");
    return [key, value];
  }));
  const timestamp = parts.ts;
  const expectedSignature = parts.h1;
  if (!timestamp || !expectedSignature) return false;

  const timestampSeconds = Number(timestamp);
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const toleranceSeconds = options.toleranceSeconds ?? 300;
  if (!Number.isInteger(timestampSeconds) || toleranceSeconds < 0 || Math.abs(nowSeconds - timestampSeconds) > toleranceSeconds) return false;

  const digest = crypto.createHmac("sha256", secret).update(`${timestamp}:${rawBody}`).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(expectedSignature, "hex"));
  } catch {
    return false;
  }
}
