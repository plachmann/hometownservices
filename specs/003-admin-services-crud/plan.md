# Implementation Plan: Admin Services CRUD

**Branch**: `003-admin-services-crud` | **Date**: 2026-01-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-admin-services-crud/spec.md`

## Summary

Add full CRUD (Create, Read, Update, Delete) functionality to the `/admin/services` page, enabling admins to manage services and categories directly through the UI without database access. Implementation uses existing Next.js App Router patterns, Prisma ORM, and shadcn/ui components. Includes reordering capabilities and proper data integrity checks for related entities.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: Next.js 14 (App Router), Prisma ORM, shadcn/ui, Zod, iron-session
**Storage**: PostgreSQL via Prisma (existing schema for Service, ServiceCategory)
**Testing**: Vitest + React Testing Library (recommended, not mandatory for MVP)
**Target Platform**: Web (Vercel deployment)
**Project Type**: Web application (Next.js full-stack)
**Performance Goals**: All CRUD operations complete within 2 seconds; page load under 3 seconds
**Constraints**: Must use existing authentication (iron-session); no schema changes required
**Scale/Scope**: Single admin user; ~50-100 services across ~10 categories typical

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | PASS | Using TypeScript strict mode, Prisma types, Zod validation for all inputs |
| II. Simplicity First | PASS | Using existing shadcn/ui components, no new abstractions; standard CRUD patterns |
| III. Security by Default | PASS | All admin routes require iron-session auth; Zod validates input; Prisma parameterized queries |
| IV. Performance Awareness | PASS | Server components for initial load; client components only for interactive forms |
| V. Accessibility | PASS | shadcn/ui provides accessible components; forms will have proper labels |

**Technology Standards Compliance**: All technologies match constitution stack (Next.js 14, TypeScript, Prisma, Tailwind, shadcn/ui, iron-session).

**Gate Status**: PASSED - No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-services-crud/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── admin/
│   │   └── (dashboard)/
│   │       └── services/
│   │           └── page.tsx        # Enhanced with CRUD UI
│   └── api/
│       └── admin/
│           ├── services/
│           │   └── route.ts        # NEW: Services CRUD API
│           └── categories/
│               └── route.ts        # NEW: Categories CRUD API
├── components/
│   └── admin/
│       ├── ServiceForm.tsx         # NEW: Create/Edit form
│       ├── ServiceList.tsx         # NEW: Interactive list
│       ├── CategoryManager.tsx     # NEW: Category CRUD
│       └── DeleteConfirmDialog.tsx # NEW: Confirmation modal
└── lib/
    └── validations/
        └── admin.ts                # NEW: Zod schemas for admin forms
```

**Structure Decision**: Using existing Next.js App Router structure. New components go in `src/components/admin/`, new API routes in `src/app/api/admin/`. No new directories needed at root level.

## Complexity Tracking

> No constitution violations to justify. Implementation follows standard patterns.

*No entries required.*
