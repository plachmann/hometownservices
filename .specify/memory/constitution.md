<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0 (Initial configuration)

Modified Principles:
- [PRINCIPLE_1_NAME] → I. Type Safety
- [PRINCIPLE_2_NAME] → II. Simplicity First
- [PRINCIPLE_3_NAME] → III. Security by Default
- [PRINCIPLE_4_NAME] → IV. Performance Awareness
- [PRINCIPLE_5_NAME] → V. Accessibility

Added Sections:
- Technology Standards (replaces [SECTION_2_NAME])
- Development Workflow (replaces [SECTION_3_NAME])
- Complete Governance rules

Removed Sections:
- None (template fully configured)

Templates Requiring Updates:
- ✅ plan-template.md - Constitution Check section aligns with principles
- ✅ spec-template.md - User stories support accessibility/performance criteria
- ✅ tasks-template.md - Task organization compatible with principles

Follow-up TODOs:
- None
-->

# Hometown Services Constitution

## Core Principles

### I. Type Safety

All code MUST be written in TypeScript with strict mode enabled. Type inference is preferred
where unambiguous; explicit types are REQUIRED for function signatures, API boundaries, and
exported interfaces.

- No `any` types except when interfacing with untyped third-party libraries (must be isolated)
- Prisma-generated types MUST be used for database entities
- Zod schemas MUST validate all external input (API requests, form submissions)
- Runtime type errors indicate a bug in type definitions, not just bad input

**Rationale**: TypeScript catches errors at compile time, reducing runtime failures and improving
maintainability. Strict typing is especially important for a business website where form
submissions and database operations must be reliable.

### II. Simplicity First

Prefer simple, readable solutions over clever or over-engineered ones. Every abstraction MUST
justify its existence with a clear, immediate benefit.

- Use established libraries (Next.js, Prisma, shadcn/ui) rather than custom implementations
- Avoid premature optimization; measure before optimizing
- One way to do things: follow Next.js App Router conventions consistently
- No wrapper abstractions unless they reduce code by 50%+ or add critical functionality
- Feature flags and complex configuration systems are out of scope for MVP

**Rationale**: A services listing website should be maintainable by a small team or solo developer.
Complexity increases maintenance burden and bug surface area without proportional benefit.

### III. Security by Default

Security controls MUST be built into the architecture, not bolted on afterward.

- All admin routes MUST require authentication (iron-session)
- Contact forms MUST include CAPTCHA verification
- Database queries MUST use parameterized queries (Prisma handles this)
- Sensitive data (passwords) MUST be hashed with bcrypt (cost factor ≥ 12)
- Environment variables MUST NOT be committed; use .env.example as template
- HTTPS MUST be enforced in production (Vercel default)

**Rationale**: A public website with admin functionality and contact forms is a target for
automated attacks. Security must be non-negotiable from day one.

### IV. Performance Awareness

Pages MUST load in under 3 seconds on standard broadband. Performance should be considered
during implementation, not as an afterthought.

- Use Next.js Image component for automatic image optimization
- Implement loading states for async operations
- Prefer server components; use client components only when interactivity required
- Database queries SHOULD include only necessary fields (Prisma select)
- Third-party scripts (CAPTCHA, analytics) MUST load asynchronously

**Rationale**: Page load speed directly impacts user engagement and SEO. A slow services
website loses potential customers.

### V. Accessibility

The website MUST be usable by people with disabilities. Accessibility is a requirement,
not an enhancement.

- All interactive elements MUST be keyboard navigable
- Images MUST have meaningful alt text
- Form fields MUST have associated labels
- Color contrast MUST meet WCAG 2.1 AA standards
- The site MUST be usable without JavaScript for core content (progressive enhancement)

**Rationale**: Accessibility ensures the widest possible audience can access services.
It's also a legal requirement in many jurisdictions.

## Technology Standards

The following technology choices are locked for this project:

| Layer | Technology | Justification |
|-------|------------|---------------|
| Framework | Next.js 14 (App Router) | Modern React with SSR, optimal for Vercel |
| Language | TypeScript 5.x | Type safety principle |
| Database | PostgreSQL via Prisma | Reliable, typed ORM |
| Styling | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| Auth | iron-session | Simple, secure session management |
| Maps | React-Leaflet + OpenStreetMap | Free, no API key required |
| Search | Fuse.js | Client-side fuzzy search |
| Testing | Vitest + React Testing Library | Fast, React-focused testing |
| Hosting | Vercel | Optimized for Next.js |

Deviations from this stack require documented justification and constitution amendment.

## Development Workflow

### Code Changes

1. All changes MUST be made on feature branches (never direct to main)
2. Pull requests MUST be created for all changes
3. PRs MUST include a description of what changed and why
4. PRs SHOULD include relevant test coverage for new functionality
5. Self-review is acceptable for solo development; team projects require peer review

### Testing Guidelines

Testing is RECOMMENDED but not mandatory for MVP. When tests are written:

- Unit tests for utility functions and complex logic
- Integration tests for API routes
- Component tests for interactive UI elements
- E2E tests are optional but valuable for critical user flows

### Deployment

1. Merging to main triggers automatic deployment to Vercel
2. Preview deployments are created for all PRs
3. Production issues SHOULD be fixed via hotfix branch, not direct commits
4. Database migrations MUST be reviewed before deployment

## Governance

This constitution establishes the development standards for Hometown Services. All code
contributions MUST comply with these principles.

**Amendment Process**:
1. Propose change with rationale
2. Document impact on existing code
3. Update version number (MAJOR for breaking changes, MINOR for additions, PATCH for clarifications)
4. Update LAST_AMENDED_DATE

**Compliance**:
- PR reviews SHOULD verify principle compliance
- The `/speckit.analyze` command validates artifacts against constitution
- Violations MUST be documented in Complexity Tracking section of plan.md if proceeding anyway

**Version**: 1.0.0 | **Ratified**: 2026-01-05 | **Last Amended**: 2026-01-05
