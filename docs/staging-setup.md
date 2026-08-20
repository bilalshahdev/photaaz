# Photaaz staging setup

Staging is required before the first production release because Photaaz combines multi-tenant authorization, plan limits, direct Cloudinary uploads, email, custom-domain routing, and Paddle webhooks. Vercel Preview alone is not isolated staging unless its environment variables point to separate resources.

## 1. Create isolated resources

1. Create a separate Supabase project for staging. Copy its pooled PostgreSQL URL to `DATABASE_URL`. Enable backups or take a restorable snapshot before destructive tests.
2. Use Paddle Sandbox. Create sandbox products/prices for Plus monthly, Pro monthly, and Ownership. Configure a sandbox webhook for `https://YOUR-STAGING-HOST/api/paddle/webhook` and copy that endpoint's signing secret.
3. Use either a separate Cloudinary cloud or the existing cloud with `CLOUDINARY_ROOT_FOLDER=photaaz` and `CLOUDINARY_ENVIRONMENT_FOLDER=staging`. Never reuse `production`.
4. Use a Resend testing sender/domain and a controlled QA inbox. Never send staging mail to customer lists.
5. Create a Vercel project named `photaaz-staging` (recommended) or a protected staging branch/domain. Set an HTTPS hostname and staging root domain.

Copy `.env.staging.example` values into Vercel's staging project. Generate new auth, admin, webhook, database, email, and storage secrets; do not copy production secrets.

## 2. Validate configuration

Export/download the staging variables to an ignored local file, then run:

```powershell
npm run staging:check -- .env.staging.local
```

The check intentionally fails for production Paddle mode, non-HTTPS app/auth URLs, a non-staging Cloudinary folder, missing integrations, weak auth secrets, and obvious production references.

After configuring Vercel, deploy the exact commit being tested. Record its commit SHA and deployment URL in `docs/staging-evidence.csv`.

## 3. QA personas

Create these as separate Better Auth users/tenants in the staging database only:

| Persona | State | Purpose |
|---|---|---|
| qa-admin | Super admin | Admin authorization, themes, packages, platform content |
| qa-free | Free | Free limits: 50 photos, 1 hero, 3 categories, 3 galleries, 3 blogs, no premium themes |
| qa-plus | Plus ACTIVE | 300 photos, 3 heroes, 10 categories/galleries/blogs, 2 premium themes |
| qa-pro | Pro ACTIVE | 5,000 photos, 5 heroes, 20 categories, 50 galleries/blogs, 5 premium themes, watermark |
| qa-owner | Ownership ACTIVE | Unlimited limits and lifetime behavior |
| qa-grace | Plus or Pro PAST_DUE | Grace-period access |
| qa-expired | Paid plan EXPIRED | Safe fallback to Free effective limits without deleting content |
| qa-attacker | Ordinary user owning another tenant | Cross-tenant denial tests |

Use unique inbox aliases and generated passwords. Do not store persona passwords in Git or the evidence CSV.

## 4. Minimum release evidence

Run `npm test`, `npm run lint`, and `npm run build` against the release commit. Then execute the rows in `docs/staging-evidence.csv` manually or through browser tests. For uploads, test the exact limit and the next item (for example Free photo 50 succeeds and 51 is rejected). For webhook replay, send the same Paddle event twice and prove subscription state changes only once.

Evidence may contain screenshots, HTTP status/body with secrets redacted, Paddle event IDs, Cloudinary public IDs under `photaaz/staging`, and relevant database row IDs. Never capture tokens, cookies, passwords, service-role keys, customer data, or full signed upload payloads.

Before release, restore the staging database snapshot once, rerun the smoke cases, close severity-1/2 defects, and perform a controlled production smoke test with a dedicated internal tenant.
