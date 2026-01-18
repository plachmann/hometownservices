# Data Model: Admin Services CRUD

**Feature Branch**: `003-admin-services-crud`
**Date**: 2026-01-12
**Status**: Using existing Prisma schema (no modifications required)

## Entities

### ServiceCategory

Organizational grouping for related services.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | |
| name | String | Required, max 100 chars | Display name |
| slug | String | Required, unique, max 100 chars | URL-friendly identifier |
| description | String | Optional, max 500 chars | Category description |
| displayOrder | Int | Default: 0 | Controls sort order |
| createdAt | DateTime | Auto-set on create | |
| updatedAt | DateTime | Auto-updated | |

**Relationships**:
- Has many `Service` (one-to-many)

**Validation Rules** (Zod schema exists at `src/lib/validations.ts`):
- `name`: 1-100 characters, required
- `description`: 0-500 characters, optional
- `displayOrder`: non-negative integer, optional (defaults to 0)

### Service

Individual service offering.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, auto-generated | |
| name | String | Required, max 100 chars | Display name |
| slug | String | Required, unique, max 100 chars | URL-friendly identifier |
| description | String | Required, text | Full description |
| imageUrl | String | Optional, max 500 chars | External image URL |
| isSubcontracted | Boolean | Default: false | Shows badge in UI |
| categoryId | UUID | FK to ServiceCategory | Required |
| displayOrder | Int | Default: 0 | Controls sort within category |
| createdAt | DateTime | Auto-set on create | |
| updatedAt | DateTime | Auto-updated | |

**Relationships**:
- Belongs to one `ServiceCategory` (many-to-one)
- Has many `ContactInquiry` (one-to-many, nullable)

**Validation Rules** (Zod schema exists at `src/lib/validations.ts`):
- `name`: 1-100 characters, required
- `description`: 10-2000 characters, required
- `imageUrl`: valid URL format, max 500 chars, optional
- `isSubcontracted`: boolean, required
- `categoryId`: valid UUID, required
- `displayOrder`: non-negative integer, optional (defaults to 0)

### ContactInquiry (Affected by Delete)

Customer contact submissions linked to services.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| serviceId | UUID | FK to Service, nullable | Link to service |

**Delete Impact**:
- When a Service is deleted, `serviceId` becomes null (not cascade delete)
- Inquiry records are preserved for business continuity

## Entity Relationships

```
┌─────────────────┐       ┌─────────────────┐
│ ServiceCategory │       │ ContactInquiry  │
├─────────────────┤       ├─────────────────┤
│ id              │───┐   │ id              │
│ name            │   │   │ serviceId (FK)  │──┐
│ slug            │   │   │ ...             │  │
│ description     │   │   └─────────────────┘  │
│ displayOrder    │   │                        │
└─────────────────┘   │   ┌─────────────────┐  │
                      │   │ Service         │  │
                      │   ├─────────────────┤  │
                      └──▶│ categoryId (FK) │  │
                          │ id              │◀─┘
                          │ name            │
                          │ slug            │
                          │ description     │
                          │ imageUrl        │
                          │ isSubcontracted │
                          │ displayOrder    │
                          └─────────────────┘
```

## Slug Generation

Slugs are auto-generated from names with the following rules:

1. Convert to lowercase
2. Replace spaces and underscores with hyphens
3. Remove non-alphanumeric characters (except hyphens)
4. Collapse multiple hyphens into single hyphen
5. Trim leading/trailing hyphens
6. If duplicate exists, append `-N` where N is incrementing number

**Examples**:
| Input Name | Generated Slug |
|------------|---------------|
| Kitchen Remodeling | kitchen-remodeling |
| HVAC & Cooling | hvac-cooling |
| 24/7 Emergency Service | 247-emergency-service |
| Kitchen Remodeling (2nd) | kitchen-remodeling-2 |

## Database Indexes

Existing indexes (no additions needed):
- `ServiceCategory.slug` - UNIQUE
- `Service.slug` - UNIQUE
- `Service.categoryId` - INDEX (for category lookups)

## Query Patterns

### List Services with Categories
```typescript
prisma.serviceCategory.findMany({
  orderBy: { displayOrder: 'asc' },
  include: {
    services: {
      orderBy: { displayOrder: 'asc' },
    },
  },
});
```

### Check Category Has Services Before Delete
```typescript
prisma.serviceCategory.findUnique({
  where: { id },
  include: {
    _count: { select: { services: true } },
  },
});
```

### Check Service Has Inquiries Before Delete
```typescript
prisma.service.findUnique({
  where: { id },
  include: {
    _count: { select: { inquiries: true } },
  },
});
```

### Swap Display Order (Reordering)
```typescript
// Transaction to swap order of two adjacent items
prisma.$transaction([
  prisma.service.update({
    where: { id: itemAId },
    data: { displayOrder: itemBOrder },
  }),
  prisma.service.update({
    where: { id: itemBId },
    data: { displayOrder: itemAOrder },
  }),
]);
```
