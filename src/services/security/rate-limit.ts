import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export class RateLimitError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many requests. Please wait and try again.");
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function enforceRateLimit(input: {
  scope: string;
  identity: string;
  limit: number;
  windowSeconds: number;
}) {
  const now = Date.now();
  const windowMs = input.windowSeconds * 1000;
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs);
  const expiresAt = new Date(windowStartMs + windowMs * 2);
  const bucketKey = createHash("sha256")
    .update(`${input.scope}:${input.identity}:${windowStartMs}`)
    .digest("hex");

  try {
    await prisma.securityRateLimitBucket.create({
      data: { bucketKey, scope: input.scope, hits: 1, windowStart, expiresAt },
    });
  } catch (error) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
    const updated = await prisma.securityRateLimitBucket.updateMany({
      where: { bucketKey, hits: { lt: input.limit } },
      data: { hits: { increment: 1 } },
    });
    if (updated.count === 0) {
      throw new RateLimitError(Math.max(1, Math.ceil((windowStartMs + windowMs - now) / 1000)));
    }
  }

  if (Math.random() < 0.01) {
    void prisma.securityRateLimitBucket.deleteMany({ where: { expiresAt: { lt: new Date(now) } } }).catch(() => undefined);
  }
}

export function getRequestIdentity(requestHeaders: Headers) {
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || requestHeaders.get("x-real-ip") || "unknown";
}

export async function enforceServerActionRateLimit(scope: string, limit: number, windowSeconds: number) {
  const requestHeaders = await headers();
  return enforceRateLimit({ scope, identity: getRequestIdentity(requestHeaders), limit, windowSeconds });
}
