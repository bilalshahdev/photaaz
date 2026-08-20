-- Safe additive migration. Apply to staging, then production, before deploying legal controls.
DO $$ BEGIN CREATE TYPE "LegalRequestType" AS ENUM ('ACCESS','EXPORT','CORRECTION','DELETION','OBJECTION','COPYRIGHT','COUNTER_NOTICE'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "LegalRequestStatus" AS ENUM ('OPEN','VERIFYING','IN_PROGRESS','COMPLETED','REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "LegalAcceptance" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "termsVersion" TEXT NOT NULL, "privacyVersion" TEXT NOT NULL,
  "locale" TEXT NOT NULL, "ipAddressHash" TEXT, "userAgent" TEXT, "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LegalAcceptance_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LegalAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "LegalAcceptance_userId_termsVersion_privacyVersion_key" ON "LegalAcceptance"("userId","termsVersion","privacyVersion");
CREATE INDEX IF NOT EXISTS "LegalAcceptance_acceptedAt_idx" ON "LegalAcceptance"("acceptedAt");

CREATE TABLE IF NOT EXISTS "LegalRequest" (
  "id" TEXT NOT NULL, "userId" TEXT, "type" "LegalRequestType" NOT NULL, "status" "LegalRequestStatus" NOT NULL DEFAULT 'OPEN',
  "email" TEXT NOT NULL, "name" TEXT NOT NULL, "subject" TEXT, "details" TEXT NOT NULL, "declaration" BOOLEAN NOT NULL DEFAULT false,
  "sourceUrl" TEXT, "workDescription" TEXT, "locale" TEXT NOT NULL DEFAULT 'en', "ipAddressHash" TEXT, "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LegalRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LegalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "LegalRequest_type_status_createdAt_idx" ON "LegalRequest"("type","status","createdAt");
CREATE INDEX IF NOT EXISTS "LegalRequest_userId_createdAt_idx" ON "LegalRequest"("userId","createdAt");
