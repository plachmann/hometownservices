# Tasks: Hometown Services Website

**Input**: Design documents from `/specs/001-hometown-services-site/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-spec.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Next.js 14 structure

- [x] T001 Initialize Next.js 14 project with TypeScript, Tailwind CSS, App Router, and src directory
- [x] T002 Install core dependencies: @prisma/client, iron-session, fuse.js, react-leaflet, leaflet, bcryptjs, zod
- [x] T003 Install dev dependencies: prisma, @types/bcryptjs, @types/leaflet, vitest, @testing-library/react
- [x] T004 [P] Initialize shadcn/ui and add base components (button, card, input, form, label)
- [x] T005 [P] Create environment template file .env.example with all required variables
- [x] T006 [P] Configure TypeScript paths in tsconfig.json for @/* imports
- [x] T007 [P] Setup Vitest configuration in vitest.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database, auth, and shared infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup

- [ ] T008 Initialize Prisma with PostgreSQL provider in prisma/schema.prisma
- [ ] T009 Define ServiceCategory model in prisma/schema.prisma per data-model.md
- [ ] T010 Define Service model with category relation in prisma/schema.prisma
- [ ] T011 Define ContactInquiry model with InquiryStatus enum in prisma/schema.prisma
- [ ] T012 Define AdminUser model in prisma/schema.prisma
- [ ] T013 Define SiteSettings singleton model in prisma/schema.prisma
- [ ] T014 Run prisma migrate dev to create initial migration
- [ ] T015 Create Prisma client singleton in src/lib/prisma.ts

### Seed Data

- [ ] T016 Create seed script prisma/seed.ts with 5 categories per data-model.md
- [ ] T017 Add 18 services to seed script organized by category per data-model.md
- [ ] T018 Add default SiteSettings to seed script with placeholder coordinates
- [ ] T019 Add initial admin user creation to seed script (from env vars)
- [ ] T020 Configure seed command in package.json

### Shared Libraries

- [ ] T021 [P] Create iron-session configuration in src/lib/auth.ts with SessionData type
- [ ] T022 [P] Create CAPTCHA verification helper in src/lib/captcha.ts
- [ ] T023 [P] Create Fuse.js search configuration in src/lib/search.ts
- [ ] T024 [P] Create slug generation utility in src/lib/utils.ts
- [ ] T025 [P] Create Zod validation schemas in src/lib/validations.ts

### Layout Components

- [ ] T026 [P] Create Header component with navigation in src/components/layout/Header.tsx
- [ ] T027 [P] Create Footer component in src/components/layout/Footer.tsx displaying company contact info (name, phone, email, address) from SiteSettings
- [ ] T028 [P] Create mobile-responsive Navigation component in src/components/layout/Navigation.tsx
- [ ] T029 Update root layout src/app/layout.tsx with Header, Footer, and metadata

### API Infrastructure

- [ ] T030 Create API response helpers in src/lib/api-utils.ts
- [ ] T031 Create admin auth middleware helper in src/lib/require-admin.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse Available Services (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse all services organized by category from homepage

**Independent Test**: Visit homepage → see categories → click category → see services → click service → see details

### API Routes for US1

- [ ] T032 [P] [US1] Implement GET /api/categories route in src/app/api/categories/route.ts
- [ ] T033 [P] [US1] Implement GET /api/services route in src/app/api/services/route.ts
- [ ] T034 [US1] Implement GET /api/services/[slug] route in src/app/api/services/[slug]/route.ts

### Components for US1

- [ ] T035 [P] [US1] Create ServiceCard component in src/components/services/ServiceCard.tsx
- [ ] T036 [P] [US1] Create ServiceList component in src/components/services/ServiceList.tsx
- [ ] T037 [P] [US1] Create CategoryCard component in src/components/services/CategoryCard.tsx
- [ ] T038 [P] [US1] Create CategoryGrid component in src/components/services/CategoryGrid.tsx

### Pages for US1

- [ ] T039 [US1] Create homepage with category overview in src/app/(public)/page.tsx
- [ ] T040 [US1] Create all services page in src/app/(public)/services/page.tsx
- [ ] T041 [US1] Create service detail page in src/app/(public)/services/[slug]/page.tsx
- [ ] T042 [US1] Create category filter view on services page (query param handling)

### Styling for US1

- [ ] T043 [US1] Add responsive styling for service cards (mobile/tablet/desktop)
- [ ] T044 [US1] Add loading states and skeletons for service pages

**Checkpoint**: User Story 1 complete - visitors can browse all services by category

---

## Phase 4: User Story 2 - Search for Specific Services (Priority: P2)

**Goal**: Visitors can search for services with fuzzy matching

**Independent Test**: Type "deck" in search → see Deck Construction result → type "bathroom" → see related services

### Components for US2

- [ ] T045 [P] [US2] Create SearchBar component in src/components/search/SearchBar.tsx
- [ ] T046 [P] [US2] Create SearchResults component in src/components/search/SearchResults.tsx
- [ ] T047 [US2] Create SearchProvider context in src/components/search/SearchProvider.tsx

### Integration for US2

- [ ] T048 [US2] Add SearchBar to Header component for global search access
- [ ] T049 [US2] Implement client-side Fuse.js search in SearchProvider
- [ ] T050 [US2] Add keyboard navigation to search results (arrow keys, enter)
- [ ] T051 [US2] Add "No results found" state with suggestions

### Edge Cases for US2

- [ ] T052 [US2] Handle empty search query gracefully
- [ ] T053 [US2] Add search result highlighting for matched terms

**Checkpoint**: User Story 2 complete - search works independently of other features

---

## Phase 5: User Story 3 - Contact for Service Inquiry (Priority: P2)

**Goal**: Visitors can submit contact inquiries with CAPTCHA protection

**Independent Test**: Go to contact page → fill form → complete CAPTCHA → submit → see confirmation

### API Routes for US3

- [ ] T054 [US3] Implement POST /api/inquiries route in src/app/api/inquiries/route.ts
- [ ] T055 [US3] Add CAPTCHA verification to inquiry submission
- [ ] T056 [US3] Add rate limiting to prevent spam (optional basic implementation)

### Components for US3

- [ ] T057 [P] [US3] Create ContactForm component in src/components/contact/ContactForm.tsx
- [ ] T058 [P] [US3] Create CaptchaWidget component in src/components/contact/CaptchaWidget.tsx
- [ ] T059 [P] [US3] Create SuccessMessage component in src/components/contact/SuccessMessage.tsx

### Pages for US3

- [ ] T060 [US3] Create contact page in src/app/(public)/contact/page.tsx
- [ ] T061 [US3] Add service selector dropdown to contact form (pre-select from service page)
- [ ] T062 [US3] Add "Request Quote" button to ServiceCard linking to contact form

### Validation for US3

- [ ] T063 [US3] Implement client-side form validation with Zod
- [ ] T064 [US3] Add inline error messages for invalid fields
- [ ] T065 [US3] Add form submission loading state

**Checkpoint**: User Story 3 complete - contact form works independently

---

## Phase 6: User Story 4 - View Service Area (Priority: P3)

**Goal**: Visitors can see service coverage area on interactive map

**Independent Test**: Navigate to service area → see map with radius circle → zoom/pan works → fallback shows if map fails

### API Routes for US4

- [ ] T066 [US4] Implement GET /api/settings/public route in src/app/api/settings/public/route.ts

### Components for US4

- [ ] T067 [US4] Create ServiceAreaMap component in src/components/map/ServiceAreaMap.tsx (dynamic import)
- [ ] T068 [US4] Create MapFallback component in src/components/map/MapFallback.tsx
- [ ] T069 [US4] Add Leaflet CSS import to root layout

### Pages for US4

- [ ] T070 [US4] Create service area page in src/app/(public)/service-area/page.tsx
- [ ] T071 [US4] Add radius circle overlay to map showing coverage area
- [ ] T072 [US4] Add service area summary text below map

### Error Handling for US4

- [ ] T073 [US4] Implement map loading error boundary with MapFallback
- [ ] T074 [US4] Add loading spinner while map tiles load

**Checkpoint**: User Story 4 complete - map displays independently

---

## Phase 7: User Story 5 - Admin Manages Services (Priority: P3)

**Goal**: Admin can login and manage services, categories, inquiries, and settings

**Independent Test**: Login as admin → see dashboard → add service → edit service → delete service → view inquiries → update settings

### Auth Routes for US5

- [ ] T075 [P] [US5] Implement POST /api/auth/login route in src/app/api/auth/login/route.ts
- [ ] T076 [P] [US5] Implement POST /api/auth/logout route in src/app/api/auth/logout/route.ts
- [ ] T077 [P] [US5] Implement GET /api/auth/me route in src/app/api/auth/me/route.ts

### Admin Service Routes for US5

- [ ] T078 [P] [US5] Implement GET /api/admin/services route in src/app/api/admin/services/route.ts
- [ ] T079 [US5] Implement POST /api/admin/services route in src/app/api/admin/services/route.ts
- [ ] T080 [P] [US5] Implement PUT /api/admin/services/[id] route in src/app/api/admin/services/[id]/route.ts
- [ ] T081 [US5] Implement DELETE /api/admin/services/[id] route in src/app/api/admin/services/[id]/route.ts

### Admin Category Routes for US5

- [ ] T082 [P] [US5] Implement GET/POST /api/admin/categories routes in src/app/api/admin/categories/route.ts
- [ ] T083 [US5] Implement PUT/DELETE /api/admin/categories/[id] routes in src/app/api/admin/categories/[id]/route.ts

### Admin Inquiry Routes for US5

- [ ] T084 [P] [US5] Implement GET /api/admin/inquiries route in src/app/api/admin/inquiries/route.ts
- [ ] T085 [US5] Implement PATCH /api/admin/inquiries/[id] route in src/app/api/admin/inquiries/[id]/route.ts

### Admin Settings Routes for US5

- [ ] T086 [US5] Implement GET/PUT /api/admin/settings routes in src/app/api/admin/settings/route.ts

### Admin Components for US5

- [ ] T087 [P] [US5] Create AdminLayout component in src/components/admin/AdminLayout.tsx
- [ ] T088 [P] [US5] Create AdminSidebar component in src/components/admin/AdminSidebar.tsx
- [ ] T089 [P] [US5] Create ServiceForm component in src/components/admin/ServiceForm.tsx
- [ ] T090 [P] [US5] Create CategoryForm component in src/components/admin/CategoryForm.tsx
- [ ] T091 [P] [US5] Create InquiryList component in src/components/admin/InquiryList.tsx
- [ ] T092 [P] [US5] Create SettingsForm component in src/components/admin/SettingsForm.tsx
- [ ] T093 [P] [US5] Create DeleteConfirmDialog component in src/components/admin/DeleteConfirmDialog.tsx

### Admin Pages for US5

- [ ] T094 [US5] Create admin login page in src/app/admin/login/page.tsx
- [ ] T095 [US5] Create admin dashboard page in src/app/admin/page.tsx
- [ ] T096 [US5] Create admin services list page in src/app/admin/services/page.tsx
- [ ] T097 [US5] Create admin service create page in src/app/admin/services/new/page.tsx
- [ ] T098 [US5] Create admin service edit page in src/app/admin/services/[id]/edit/page.tsx
- [ ] T099 [US5] Create admin categories page in src/app/admin/categories/page.tsx
- [ ] T100 [US5] Create admin inquiries page in src/app/admin/inquiries/page.tsx
- [ ] T101 [US5] Create admin settings page in src/app/admin/settings/page.tsx

### Admin Auth Protection for US5

- [ ] T102 [US5] Create admin middleware in src/middleware.ts for /admin routes
- [ ] T103 [US5] Add auth check to all admin pages (redirect to login if not authenticated)

**Checkpoint**: User Story 5 complete - full admin functionality works

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### About Page

- [ ] T104 [P] Create about page in src/app/(public)/about/page.tsx with company info

### SEO & Meta

- [ ] T105 [P] Add meta tags and Open Graph data to all public pages
- [ ] T106 [P] Create favicon and add to public/favicon.ico
- [ ] T107 [P] Add robots.txt to public/robots.txt

### Performance

- [ ] T108 Optimize images with Next.js Image component across all pages
- [ ] T109 Add loading.tsx files for route segments
- [ ] T110 Verify page load times meet < 3 second target

### Accessibility

- [ ] T111 Add ARIA labels to interactive elements
- [ ] T112 Verify keyboard navigation works across all pages
- [ ] T113 Test with screen reader and fix issues

### Final Validation

- [ ] T114 Run through quickstart.md setup steps to verify documentation
- [ ] T115 Test all user story acceptance scenarios manually
- [ ] T116 Verify mobile responsiveness on multiple device sizes

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──────────────────────────────────────────────┐
                                                              │
Phase 2 (Foundational) ◄──────────────────────────────────────┘
    │
    ├──► Phase 3 (US1: Browse Services) 🎯 MVP
    │         │
    │         ├──► Phase 4 (US2: Search) [depends on services data]
    │         │
    │         ├──► Phase 5 (US3: Contact) [can use service selector]
    │         │
    │         └──► Phase 6 (US4: Service Area) [independent]
    │
    └──► Phase 7 (US5: Admin) [can start after Phase 2]
                │
                ▼
         Phase 8 (Polish) [after desired stories complete]
```

### User Story Independence

| Story | Can Start After | Depends On |
|-------|----------------|------------|
| US1 (Browse) | Phase 2 | None |
| US2 (Search) | Phase 2 | US1 data/components |
| US3 (Contact) | Phase 2 | US1 for service selector (optional) |
| US4 (Map) | Phase 2 | None |
| US5 (Admin) | Phase 2 | None |

### Parallel Opportunities by Phase

**Phase 1**: T004, T005, T006, T007 can all run in parallel

**Phase 2**:
- T021-T025 (libraries) in parallel
- T026-T028 (layout components) in parallel

**Phase 3 (US1)**:
- T032, T033 (API routes) in parallel
- T035-T038 (components) in parallel

**Phase 4 (US2)**:
- T045, T046 (components) in parallel

**Phase 5 (US3)**:
- T057, T058, T059 (components) in parallel

**Phase 7 (US5)**:
- T075-T077 (auth routes) in parallel
- T078, T080, T082, T084 (GET routes) in parallel
- T087-T093 (admin components) in parallel

---

## Parallel Example: Phase 3 (US1) Components

```bash
# These tasks can all run in parallel:
T035: Create ServiceCard component in src/components/services/ServiceCard.tsx
T036: Create ServiceList component in src/components/services/ServiceList.tsx
T037: Create CategoryCard component in src/components/services/CategoryCard.tsx
T038: Create CategoryGrid component in src/components/services/CategoryGrid.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T031)
3. Complete Phase 3: User Story 1 (T032-T044)
4. **STOP and VALIDATE**:
   - Can you browse categories on homepage?
   - Can you see all services?
   - Can you view individual service details?
5. Deploy MVP to Vercel

### Recommended Full Implementation Order

1. **Setup** → **Foundational** → **US1 (Browse)** → Deploy MVP
2. Add **US2 (Search)** → Deploy with search
3. Add **US3 (Contact)** → Deploy with contact form
4. Add **US4 (Map)** + **US5 (Admin)** in parallel → Full deploy
5. **Polish** → Production ready

### Task Count Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Phase 1: Setup | 7 | - |
| Phase 2: Foundational | 24 | - |
| Phase 3: US1 Browse | 13 | US1 |
| Phase 4: US2 Search | 9 | US2 |
| Phase 5: US3 Contact | 12 | US3 |
| Phase 6: US4 Map | 9 | US4 |
| Phase 7: US5 Admin | 29 | US5 |
| Phase 8: Polish | 13 | - |
| **TOTAL** | **116** | |

---

## Notes

- All [P] tasks = different files, can run in parallel
- [US#] label tracks which user story each task serves
- Commit after each task or logical group
- Test each user story independently before moving to next
- MVP (US1) provides immediate value with 44 tasks (Setup + Foundational + US1)
