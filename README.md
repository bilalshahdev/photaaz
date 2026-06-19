# PhotoFolio SaaS Platform

Modern multi-tenant SaaS foundation for photographers to publish SEO-friendly portfolio websites.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, shadcn-style primitives
- Prisma and Supabase PostgreSQL
- Better Auth-ready auth boundary
- Cloudinary upload boundary
- Paddle subscription boundary
- Resend email boundary
- Marketing localization uses `next-intl`, route-based English/Urdu URLs, and JSON message catalogs in `messages/`; customer locale should be resolved from tenant settings as public-site localization matures.

## Architecture

- Every customer-facing entity is tenant scoped.
- Plan access is modeled through `Feature`, `Plan`, and `PlanFeature`.
- Themes are code-based React experiences; the database stores only theme configuration.
- Public pages are SSR/ISR friendly and include sitemap and robots metadata routes.
- Dashboard modules are organized for profile, galleries, pages, blogs, themes, domains, and subscriptions.
- Platform, super admin, customer public site, and customer dashboard now use separate route trees and layouts.

## Routes

- `/` - platform marketing/home page
- `/ur` - Urdu platform marketing/home page
- `/sign-up` - account creation
- `/sign-in` - account access
- `/get-started` - first tenant setup flow
- `/admin` - super-admin app with sidebar layout
- `/{slug}` - customer public website
- `/{slug}/dashboard` - customer dashboard app with sidebar layout
- `/{slug}/dashboard/theme` - customer theme preview/customizer
- `/api/auth/[...all]` - Better Auth route handler

## Getting Started

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` and integration keys.
3. Install dependencies with `npm install`.
4. Run `npm run prisma:generate`.
5. Apply a migration with `npm run prisma:migrate`.
6. Seed plans, features, and demo tenant data with `npm run db:seed`.
7. Start development with `npm run dev`.
