# Implementation Plan: Hometown Services Website

**Branch**: `001-hometown-services-site` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hometown-services-site/spec.md`

## Summary

Build a public-facing services listing website for hometownservices.net with admin content management. The site displays 18+ home services organized by category, provides fuzzy search, a contact form with CAPTCHA, and an interactive service area map showing radius coverage. Built with Next.js 14 App Router, PostgreSQL via Prisma, and deployed to Vercel.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20.x LTS
**Primary Dependencies**: Next.js 14 (App Router), Prisma ORM, Tailwind CSS, shadcn/ui, React-Leaflet, Fuse.js, iron-session
**Storage**: PostgreSQL (Vercel Postgres or Neon recommended for Vercel deployment)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (Vercel hosting), responsive for mobile/desktop
**Project Type**: Web application (fullstack Next.js)
**Performance Goals**: 95% of page loads < 3 seconds, search results < 1 second
**Constraints**: OpenStreetMap only (no paid map services), CAPTCHA required for forms
**Scale/Scope**: ~18 services, single admin user, low-medium traffic expected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | PASS | TypeScript strict mode, Prisma types, Zod validation |
| II. Simplicity First | PASS | Using established libraries (Next.js, Prisma, shadcn/ui) |
| III. Security by Default | PASS | iron-session auth, CAPTCHA on forms, bcrypt passwords |
| IV. Performance Awareness | PASS | Next.js Image, server components, <3s load target |
| V. Accessibility | PASS | ARIA labels, keyboard nav, WCAG 2.1 AA compliance tasks |

## Project Structure

### Documentation (this feature)

```text
specs/001-hometown-services-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API specs)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/                      # Next.js App Router
│   ├── (public)/             # Public route group
│   │   ├── page.tsx          # Homepage
│   │   ├── services/         # Service pages
│   │   │   ├── page.tsx      # All services
│   │   │   └── [slug]/       # Individual service
│   │   ├── contact/          # Contact form
│   │   └── service-area/     # Map page
│   ├── admin/                # Admin route group
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── services/         # Service management
│   │   ├── inquiries/        # View inquiries
│   │   ├── settings/         # Service area config
│   │   └── login/            # Admin login
│   ├── api/                  # API routes
│   │   ├── services/         # Service CRUD
│   │   ├── categories/       # Category CRUD
│   │   ├── inquiries/        # Contact form submissions
│   │   ├── settings/         # Service area settings
│   │   └── auth/             # Login/logout
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Shared components
│   ├── ui/                   # shadcn/ui components
│   ├── layout/               # Header, Footer, Nav
│   ├── services/             # Service cards, lists
│   ├── search/               # Search bar, results
│   ├── contact/              # Contact form
│   └── map/                  # Service area map
├── lib/                      # Utilities
│   ├── prisma.ts             # Prisma client
│   ├── auth.ts               # iron-session config
│   ├── search.ts             # Fuse.js config
│   └── captcha.ts            # CAPTCHA verification
└── types/                    # TypeScript types

prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Initial data (services, categories)

tests/
├── unit/                     # Unit tests
├── integration/              # API route tests
└── e2e/                      # End-to-end tests (optional)

public/
├── images/                   # Service images
└── favicon.ico
```

**Structure Decision**: Next.js 14 App Router with route groups for public and admin sections. All source code in `src/` directory for clean imports. Prisma schema at root level per convention.

## Complexity Tracking

No constitution violations to justify. Architecture follows standard Next.js patterns with minimal complexity.
