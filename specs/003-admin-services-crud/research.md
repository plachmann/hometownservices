# Research: Admin Services CRUD

**Feature Branch**: `003-admin-services-crud`
**Date**: 2026-01-12
**Purpose**: Document technical decisions and patterns for implementing CRUD functionality

## Existing Infrastructure

### Authentication Pattern

**Decision**: Use existing `requireAdmin()` helper from `src/lib/require-admin.ts`

**Rationale**: The codebase already has a consistent pattern for admin authentication:
```typescript
const admin = await requireAdmin();
if (!admin) {
  return unauthorizedResponse();
}
```

**Alternatives considered**:
- Middleware-based auth: Rejected because current pattern is consistent across all admin routes
- Higher-order function wrapper: Available as `withAdminAuth()` but explicit pattern is clearer

### Validation Pattern

**Decision**: Use existing Zod schemas from `src/lib/validations.ts`

**Rationale**: Schemas for `serviceSchema` and `categorySchema` already exist with appropriate validation rules:
- Service: name (1-100 chars), description (10-2000 chars), imageUrl (optional URL), isSubcontracted (boolean), categoryId (UUID), displayOrder (optional int)
- Category: name (1-100 chars), description (optional, max 500 chars), displayOrder (optional int)

**Alternatives considered**:
- Create separate validation file: Rejected because existing file is comprehensive
- Inline validation: Rejected per constitution (Zod required for external input)

### API Response Pattern

**Decision**: Use existing `ApiResponse` type and helpers from `src/lib/api-utils.ts`

**Rationale**: Consistent JSON response structure across all API routes:
```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**Alternatives considered**: None - standard pattern must be followed

## Design Decisions

### Slug Generation

**Decision**: Auto-generate slug from name using `slugify` utility; allow manual override

**Rationale**:
- Slugs must be unique (database constraint)
- Auto-generation reduces user friction
- Manual override allows SEO-friendly customization

**Implementation**: Create `generateSlug()` utility that:
1. Converts to lowercase
2. Replaces spaces with hyphens
3. Removes special characters
4. Appends number if duplicate exists

**Alternatives considered**:
- Require manual slug entry: Rejected - increases friction without benefit
- Generate UUID-based slugs: Rejected - not SEO-friendly

### Reordering Mechanism

**Decision**: Use up/down arrow buttons with `displayOrder` field updates

**Rationale**:
- Simpler implementation than drag-and-drop
- Works reliably across devices (including mobile)
- Database already has `displayOrder` field on both entities

**Implementation**:
- Each item shows up/down buttons (disabled at boundaries)
- Click triggers API call to swap `displayOrder` values with adjacent item
- Batch update for bulk reordering (future enhancement)

**Alternatives considered**:
- Drag-and-drop with @dnd-kit: Rejected for MVP - adds complexity and dependency
- Inline number input: Rejected - poor UX for relative ordering

### Delete Behavior

**Decision**: Soft warning for services with inquiries; hard block for categories with services

**Rationale**:
- Services can be deleted even with inquiries (inquiries remain, service reference becomes null)
- Categories cannot be deleted if services exist (foreign key constraint)
- Clear warning prevents accidental data loss

**Implementation**:
- Check `_count.inquiries` before service delete - show warning if > 0
- Check `_count.services` before category delete - block if > 0 with message to reassign

**Alternatives considered**:
- Cascade delete: Rejected - would delete valuable inquiry data
- Soft delete: Rejected for MVP - adds complexity without clear benefit

### Form UI Pattern

**Decision**: Modal dialogs for Create/Edit; inline for quick actions (delete, reorder)

**Rationale**:
- Modals prevent accidental navigation away from partially filled forms
- Keep user in context of list view
- Consistent with modern admin panel patterns

**Implementation**:
- Add shadcn/ui Dialog component (needs installation)
- Reuse form layout for both Create and Edit
- Toast notifications for success/error feedback

**Alternatives considered**:
- Separate pages for forms: Rejected - disrupts workflow for quick edits
- Inline editing: Rejected - too complex for multi-field entities

## Components Required

### New shadcn/ui Components Needed

| Component | Purpose |
|-----------|---------|
| Dialog | Modal for Create/Edit forms |
| Select | Category dropdown in service form |
| AlertDialog | Delete confirmation |
| Toast | Success/error notifications |

**Installation commands**:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add alert-dialog
npx shadcn@latest add toast
```

### Custom Components

| Component | Purpose | Location |
|-----------|---------|----------|
| ServiceForm | Create/Edit service modal | `src/components/admin/ServiceForm.tsx` |
| CategoryForm | Create/Edit category modal | `src/components/admin/CategoryForm.tsx` |
| DeleteConfirmDialog | Reusable delete confirmation | `src/components/admin/DeleteConfirmDialog.tsx` |
| ServiceList | Interactive list with actions | `src/components/admin/ServiceList.tsx` |
| CategoryManager | Category CRUD interface | `src/components/admin/CategoryManager.tsx` |

## API Endpoints

### Services API (`/api/admin/services`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/admin/services | List all services with categories |
| POST | /api/admin/services | Create new service |
| PUT | /api/admin/services/[id] | Update existing service |
| DELETE | /api/admin/services/[id] | Delete service |
| PATCH | /api/admin/services/[id]/order | Update display order |

### Categories API (`/api/admin/categories`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/admin/categories | List all categories |
| POST | /api/admin/categories | Create new category |
| PUT | /api/admin/categories/[id] | Update existing category |
| DELETE | /api/admin/categories/[id] | Delete category (if empty) |
| PATCH | /api/admin/categories/[id]/order | Update display order |

## Performance Considerations

- Use Prisma `include` to fetch services with categories in single query
- Use `select` to limit fields when only counts needed
- Client-side state management with React `useState` for optimistic updates
- Invalidate and refetch after mutations (no complex caching)

## Security Checklist

- [x] All routes require `requireAdmin()` check
- [x] Input validated with Zod schemas
- [x] Prisma parameterized queries (no raw SQL)
- [x] Rate limiting already in place on admin routes
- [x] CSRF protection via SameSite cookies (iron-session default)
