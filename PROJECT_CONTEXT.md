# PhotoFolio Project Context

This file preserves the recovered product context for `bs-photos-hub` so the project direction is not dependent on chat history.

## Recovered Sources

- Original MVP requirements: `C:\Users\DELL\.codex\attachments\9c66fda2-6deb-4433-8087-a08a54369f0e\pasted-text.txt`
- Marketing/onboarding direction update: `C:\Users\DELL\.codex\attachments\a4425d75-11a0-4cff-aa30-cf38d1f113d6\pasted-text.txt`
- Previous Codex session log: `C:\Users\DELL\.codex\sessions\2026\06\11\rollout-2026-06-11T17-48-28-019eb6b9-facd-7961-9f24-3509044ff870.jsonl`

## Product Vision

PhotoFolio is a modern multi-tenant SaaS platform for photographers to create professional, SEO-friendly portfolio websites without coding.

Photographers should be able to:

- Create a portfolio website in minutes
- Upload and manage photos, albums, and galleries
- Publish blogs
- Manage Home, About, Contact, Gallery, and Blog pages
- Customize themes and appearance
- Use a free subdomain
- Connect a custom domain on paid plans
- Upgrade plans to unlock features and limits

The platform should feel photography-first, premium, visual, fast, accessible, and production-ready.

## Core Architecture

- Single deployment, single codebase, single database
- Each customer is a tenant
- Every customer-facing entity must be tenant scoped with `tenantId`
- Public portfolio pages must be SEO-friendly and indexable
- Dashboard areas can use client-side interactivity where appropriate
- Public pages should favor SSR/ISR, route caching, revalidation, and optimized queries
- Avoid hardcoded plan checks; feature access should come from `Feature`, `Plan`, and `PlanFeature`

## Tech Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Shadcn-style UI primitives
- Prisma ORM with Supabase PostgreSQL
- Better Auth
- Cloudinary for media
- Paddle for subscriptions
- Resend for email
- next-intl with route-based English/Urdu marketing URLs and JSON message catalogs; tenant locale remains modeled for future public-site localization
- GSAP and Framer Motion only where purposeful

## Route Philosophy

The application has four separate experiences:

- Marketing site: sells the dream
- Onboarding: creates the account and first website
- Dashboard: manages the photographer website
- Public portfolio: showcases the photographer

Current route direction:

- `/` - marketing website
- `/ur` - Urdu marketing website
- `/sign-up` - account creation
- `/sign-in` - account access
- `/get-started` or `/onboarding` - first tenant setup flow
- `/admin` - super admin dashboard
- `/{slug}` - customer public portfolio site
- `/{slug}/dashboard` - customer dashboard
- `/{slug}/dashboard/theme` - theme preview/customizer

## Marketing Website Direction

The root website must not start with onboarding. It should be a professional marketing website that inspires photographers before asking them to sign up.

Homepage sections:

- Hero section with strong photography-led visual design
- Demo showcase with live-feeling demo websites
- Theme showcase with previews and demos
- Benefits-focused features
- Pricing
- Testimonials/future social proof
- Final CTA

Important product positioning:

- Photographers do not want a marketplace or store builder in the MVP; they want a beautiful portfolio, professional presence, better presentation of their work, and a simple contact path.
- Use benefit language on marketing pages, not technical implementation language.
- Content should be manageable through super admin where practical.

## Onboarding Flow

Onboarding starts only after an intentional CTA such as Start Free, Create Website, or Get Started.

Suggested steps:

1. Create account
2. Choose subdomain
3. Choose theme
4. Add business information
5. Upload first photos
6. Publish website

## Super Admin Scope

Super admin should manage:

- Customers
- Plans
- Coupons
- Announcements and marquees
- Badges and promotional banners
- Themes
- Featured demos
- Homepage content
- Pricing content
- Support messages
- Analytics such as revenue, users, storage, uploads, and subscriptions

## Customer Dashboard Scope

Customer dashboard should manage:

- Profile
- Galleries
- Albums
- Photos
- Blogs
- Pages
- Contact details
- Theme settings
- Domain settings
- Subscription/account settings

## Public Portfolio Scope

Public customer sites should include:

- Home with configurable sections
- Gallery with categories, albums, filtering, search, and pagination
- About
- Contact with form, social links, and business information
- Blog with categories, tags, featured images, and SEO metadata

Visitors should never see internal dashboard/admin routes.

## Theme System

- Themes are code-based React experiences
- Database stores only selected theme and configuration
- Initial themes should include 4-5 options such as Minimal, Wedding, Travel, Cinematic, Dark Portfolio, Street, or Nature
- Theme configuration can include colors, typography, navbar style, gallery style, card style, and footer style

Customer customization should support:

- Primary, secondary, and accent colors
- Heading and body fonts
- Navbar variants
- Gallery variants such as grid and masonry
- Card variants
- Footer variants

## Media Rules

- All uploads use Cloudinary
- Do not store files in the database
- Do not store files on the server
- Store optimized media URLs/metadata in the database
- Support compression, responsive images, WebP, AVIF, and future watermarks

## Localization

- English and Urdu are required from day one
- Future languages may include Arabic
- Localization applies to frontend, dashboard, emails, validation messages, and API responses
- Avoid hardcoded user-facing strings where localization is expected

## SEO Requirements

Every public page should support:

- Meta title
- Meta description
- Open Graph
- Twitter cards
- Canonical URLs
- Sitemap
- Robots.txt

Blogs and public portfolio pages must be optimized for indexing.

## UX And Design Principles

- Photography-focused and visual-first
- Premium, modern, minimal clutter
- Large imagery and strong typography
- Fast interactions
- No layout shift
- No flashing content
- No blocking loaders
- Use skeletons, optimistic updates, and empty states
- Every action should have success and error feedback

Earlier UI direction from the recovered chat:

- Navbar should feel modern, rounded from the sides, and have margin
- Users should clearly be able to see demos and theme previews
- Marketing UI should include locale and dark mode controls

## MVP Success Criteria

A photographer can sign up, create a profile, upload photos, create galleries, publish a website, select/customize a theme, connect a domain on a paid plan, publish blogs, and receive visitors within minutes without technical knowledge.
