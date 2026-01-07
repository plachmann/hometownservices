# Data Model: Hometown Services Website

**Date**: 2026-01-05
**Feature**: 001-hometown-services-site

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│ ServiceCategory │       │    AdminUser    │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ name            │       │ username        │
│ slug            │       │ passwordHash    │
│ description     │       │ createdAt       │
│ displayOrder    │       │ updatedAt       │
│ createdAt       │       └─────────────────┘
│ updatedAt       │
└────────┬────────┘
         │ 1
         │
         │ *
┌────────┴────────┐       ┌─────────────────┐
│     Service     │       │ ContactInquiry  │
├─────────────────┤       ├─────────────────┤
│ id              │       │ id              │
│ name            │       │ name            │
│ slug            │       │ email           │
│ description     │       │ phone           │
│ imageUrl        │       │ serviceId (FK)  │──┐
│ isSubcontracted │       │ message         │  │
│ categoryId (FK) │       │ status          │  │
│ displayOrder    │       │ createdAt       │  │
│ createdAt       │       │ updatedAt       │  │
│ updatedAt       │       └─────────────────┘  │
└─────────────────┘                            │
         ▲                                     │
         └─────────────────────────────────────┘

┌─────────────────┐
│   SiteSettings  │  (singleton - one row)
├─────────────────┤
│ id              │
│ serviceAreaLat  │
│ serviceAreaLng  │
│ serviceAreaMiles│
│ companyName     │
│ companyPhone    │
│ companyEmail    │
│ companyAddress  │
│ updatedAt       │
└─────────────────┘
```

## Entities

### ServiceCategory

Groups related services for navigation and display.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| name | String | Required, max 100 | Display name (e.g., "Construction & Contracting") |
| slug | String | Required, unique, max 100 | URL-safe identifier (e.g., "construction-contracting") |
| description | String | Optional, max 500 | Brief description for category pages |
| displayOrder | Integer | Required, default 0 | Sort order for display |
| createdAt | DateTime | Auto-set | Record creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Validation Rules**:
- `slug` must be lowercase, alphanumeric with hyphens only
- `displayOrder` must be non-negative

### Service

Individual services offered by the company.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| name | String | Required, max 100 | Service name (e.g., "Deck Construction") |
| slug | String | Required, unique, max 100 | URL-safe identifier |
| description | Text | Required | Full description for service page |
| imageUrl | String | Optional, max 500 | Path or URL to service image |
| isSubcontracted | Boolean | Required, default false | Whether service is subcontracted |
| categoryId | UUID | FK to ServiceCategory | Parent category |
| displayOrder | Integer | Required, default 0 | Sort order within category |
| createdAt | DateTime | Auto-set | Record creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Validation Rules**:
- `slug` must be lowercase, alphanumeric with hyphens only
- `categoryId` must reference existing category
- `imageUrl` if provided must be valid URL or path format

**Relationships**:
- Belongs to one ServiceCategory (required)

### ContactInquiry

Customer inquiries submitted via contact form.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| name | String | Required, max 100 | Customer name |
| email | String | Required, max 255 | Customer email address |
| phone | String | Optional, max 20 | Customer phone number |
| serviceId | UUID | FK to Service, optional | Service of interest (if specified) |
| message | Text | Required, min 10 chars | Inquiry message |
| status | Enum | Required, default 'NEW' | NEW, READ, RESPONDED, ARCHIVED |
| createdAt | DateTime | Auto-set | Submission timestamp |
| updatedAt | DateTime | Auto-update | Last status change |

**Validation Rules**:
- `email` must be valid email format
- `phone` if provided must be valid phone format
- `message` minimum 10 characters to prevent spam

**Relationships**:
- Optionally references one Service

**State Transitions**:
```
NEW → READ → RESPONDED → ARCHIVED
         ↘→ ARCHIVED
```

### AdminUser

Admin users for content management.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique identifier |
| username | String | Required, unique, max 50 | Login username |
| passwordHash | String | Required | Bcrypt-hashed password |
| createdAt | DateTime | Auto-set | Account creation timestamp |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Validation Rules**:
- `username` alphanumeric, 3-50 characters
- Password (pre-hash) minimum 8 characters

**Security Notes**:
- Passwords stored as bcrypt hashes (cost factor 12)
- Never return passwordHash in API responses

### SiteSettings

Singleton table for global site configuration.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, fixed value | Single row identifier |
| serviceAreaLat | Decimal | Required, -90 to 90 | Service area center latitude |
| serviceAreaLng | Decimal | Required, -180 to 180 | Service area center longitude |
| serviceAreaMiles | Integer | Required, 1-500 | Service radius in miles |
| companyName | String | Required, max 100 | Company display name |
| companyPhone | String | Required, max 20 | Contact phone number |
| companyEmail | String | Required, max 255 | Contact email address |
| companyAddress | Text | Optional | Physical address |
| updatedAt | DateTime | Auto-update | Last modification timestamp |

**Validation Rules**:
- Latitude/longitude must be valid coordinates
- `serviceAreaMiles` must be positive integer between 1-500
- `companyEmail` must be valid email format

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

model ServiceCategory {
  id           String    @id @default(uuid())
  name         String    @db.VarChar(100)
  slug         String    @unique @db.VarChar(100)
  description  String?   @db.VarChar(500)
  displayOrder Int       @default(0)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  services     Service[]

  @@map("service_categories")
}

model Service {
  id              String           @id @default(uuid())
  name            String           @db.VarChar(100)
  slug            String           @unique @db.VarChar(100)
  description     String           @db.Text
  imageUrl        String?          @db.VarChar(500)
  isSubcontracted Boolean          @default(false)
  categoryId      String
  category        ServiceCategory  @relation(fields: [categoryId], references: [id])
  displayOrder    Int              @default(0)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  inquiries       ContactInquiry[]

  @@map("services")
}

enum InquiryStatus {
  NEW
  READ
  RESPONDED
  ARCHIVED
}

model ContactInquiry {
  id        String        @id @default(uuid())
  name      String        @db.VarChar(100)
  email     String        @db.VarChar(255)
  phone     String?       @db.VarChar(20)
  serviceId String?
  service   Service?      @relation(fields: [serviceId], references: [id])
  message   String        @db.Text
  status    InquiryStatus @default(NEW)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  @@map("contact_inquiries")
}

model AdminUser {
  id           String   @id @default(uuid())
  username     String   @unique @db.VarChar(50)
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("admin_users")
}

model SiteSettings {
  id               String   @id @default("singleton")
  serviceAreaLat   Decimal  @db.Decimal(10, 7)
  serviceAreaLng   Decimal  @db.Decimal(10, 7)
  serviceAreaMiles Int
  companyName      String   @db.VarChar(100)
  companyPhone     String   @db.VarChar(20)
  companyEmail     String   @db.VarChar(255)
  companyAddress   String?  @db.Text
  updatedAt        DateTime @updatedAt

  @@map("site_settings")
}
```

## Seed Data

Initial categories and services to be seeded:

```typescript
// Categories
const categories = [
  { name: 'Construction & Contracting', slug: 'construction-contracting', displayOrder: 1 },
  { name: 'Exterior & Roofing', slug: 'exterior-roofing', displayOrder: 2 },
  { name: 'Interior Finishing', slug: 'interior-finishing', displayOrder: 3 },
  { name: 'Mechanical Systems', slug: 'mechanical-systems', displayOrder: 4 },
  { name: 'Outdoor & Specialty', slug: 'outdoor-specialty', displayOrder: 5 },
];

// Services by category
const services = {
  'construction-contracting': [
    { name: 'Project Management', isSubcontracted: false },
    { name: 'Construction Contracting', isSubcontracted: false },
    { name: 'Demolition', isSubcontracted: false },
    { name: 'Framing', isSubcontracted: true },
  ],
  'exterior-roofing': [
    { name: 'Siding', isSubcontracted: true },
    { name: 'Roofing', isSubcontracted: true },
    { name: 'Deck Construction', isSubcontracted: false },
    { name: 'Driveway Installation', isSubcontracted: false },
  ],
  'interior-finishing': [
    { name: 'Flooring', isSubcontracted: false },
    { name: 'Cabinet Installation', isSubcontracted: false },
    { name: 'Trims & Doors', isSubcontracted: false },
    { name: 'Basement Finishing', isSubcontracted: false },
  ],
  'mechanical-systems': [
    { name: 'Plumbing', isSubcontracted: true },
    { name: 'Electrical', isSubcontracted: true },
    { name: 'HVAC', isSubcontracted: true },
  ],
  'outdoor-specialty': [
    { name: 'Lawn Care', isSubcontracted: false },
    { name: 'Fiberglass Pool Installation', isSubcontracted: false },
    { name: 'Maintenance', isSubcontracted: false },
  ],
};
```

## Indexes

```sql
-- Performance indexes (Prisma handles unique indexes automatically)
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_inquiries_created ON contact_inquiries(created_at DESC);
```
