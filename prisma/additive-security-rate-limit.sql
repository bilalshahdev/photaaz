-- Safe additive migration for existing Photaaz databases.
-- Run once against staging, then production, before deploying the rate-limited build.
CREATE TABLE IF NOT EXISTS "SecurityRateLimitBucket" (
  "id" TEXT NOT NULL,
  "bucketKey" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "hits" INTEGER NOT NULL DEFAULT 1,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SecurityRateLimitBucket_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SecurityRateLimitBucket_bucketKey_key"
  ON "SecurityRateLimitBucket"("bucketKey");
CREATE INDEX IF NOT EXISTS "SecurityRateLimitBucket_expiresAt_idx"
  ON "SecurityRateLimitBucket"("expiresAt");
CREATE INDEX IF NOT EXISTS "SecurityRateLimitBucket_scope_windowStart_idx"
  ON "SecurityRateLimitBucket"("scope", "windowStart");
