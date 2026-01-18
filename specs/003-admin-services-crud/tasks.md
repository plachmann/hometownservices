# Tasks: Admin Services CRUD

**Input**: Design documents from `/specs/003-admin-services-crud/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this feature (not explicitly requested in spec)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Using Next.js App Router structure:
- **Pages**: `src/app/`
- **API Routes**: `src/app/api/`
- **Components**: `src/components/`
- **Utilities**: `src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install required dependencies and create shared utilities

- [x] T001 Install shadcn/ui Dialog component: `npx shadcn@latest add dialog`
- [x] T002 [P] Install shadcn/ui Select component: `npx shadcn@latest add select`
- [x] T003 [P] Install shadcn/ui AlertDialog component: `npx shadcn@latest add alert-dialog`
- [x] T004 [P] Install shadcn/ui Toast component: `npx shadcn@latest add toast`
- [x] T005 Create slug utility with generateSlug() and ensureUniqueSlug() functions in `src/lib/slug.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API infrastructure that ALL user stories depend on

**Warning**: No user story work can begin until this phase is complete

- [x] T006 Create Services list API (GET) in `src/app/api/admin/services/route.ts` - returns services grouped by category
- [x] T007 Create Categories list API (GET) in `src/app/api/admin/categories/route.ts` - returns all categories with service counts
- [x] T008 Create DeleteConfirmDialog reusable component in `src/components/admin/DeleteConfirmDialog.tsx`
- [x] T009 Setup Toaster provider in admin layout `src/app/admin/(dashboard)/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create New Service (Priority: P1) MVP

**Goal**: Admins can create new services via a form with validation and auto-slug generation

**Independent Test**: Login to admin, click "Add Service", fill form, verify service appears in list and on public site

### Implementation for User Story 1

- [x] T010 [US1] Add POST handler to Services API for creating services in `src/app/api/admin/services/route.ts`
- [x] T011 [US1] Create ServiceForm component with all fields (name, description, category, imageUrl, isSubcontracted) in `src/components/admin/ServiceForm.tsx`
- [x] T012 [US1] Add auto-slug generation to ServiceForm that updates as user types name in `src/components/admin/ServiceForm.tsx`
- [x] T013 [US1] Create ServiceList component with "Add Service" button and category-grouped display in `src/components/admin/ServiceList.tsx`
- [x] T014 [US1] Update admin services page to use ServiceList component and handle create dialog in `src/app/admin/(dashboard)/services/page.tsx`
- [x] T015 [US1] Add toast notifications for successful service creation in `src/app/admin/(dashboard)/services/page.tsx`

**Checkpoint**: User Story 1 complete - admins can create services via UI

---

## Phase 4: User Story 2 - Edit Existing Service (Priority: P1)

**Goal**: Admins can edit any field of an existing service with pre-populated form

**Independent Test**: Click Edit on a service, modify fields, save, verify changes persist on refresh

### Implementation for User Story 2

- [x] T016 [US2] Create Service by ID API route with GET handler in `src/app/api/admin/services/[id]/route.ts`
- [x] T017 [US2] Add PUT handler to Service by ID API for updates in `src/app/api/admin/services/[id]/route.ts`
- [x] T018 [US2] Extend ServiceForm to accept initial data for edit mode in `src/components/admin/ServiceForm.tsx`
- [x] T019 [US2] Add Edit button to each service row in ServiceList in `src/components/admin/ServiceList.tsx`
- [x] T020 [US2] Implement edit dialog flow with pre-populated form in `src/app/admin/(dashboard)/services/page.tsx`
- [x] T021 [US2] Add optimistic UI update for service edits in `src/app/admin/(dashboard)/services/page.tsx`

**Checkpoint**: User Stories 1 & 2 complete - admins can create and edit services

---

## Phase 5: User Story 3 - Delete Service (Priority: P2)

**Goal**: Admins can delete services with confirmation dialog and inquiry warning

**Independent Test**: Click Delete on a service, confirm in dialog, verify service removed from list

### Implementation for User Story 3

- [x] T022 [US3] Add DELETE handler to Service by ID API with inquiry count check in `src/app/api/admin/services/[id]/route.ts`
- [x] T023 [US3] Add Delete button to each service row in ServiceList in `src/components/admin/ServiceList.tsx`
- [x] T024 [US3] Implement delete confirmation dialog with inquiry warning in `src/app/admin/(dashboard)/services/page.tsx`
- [x] T025 [US3] Add optimistic UI update for service deletion in `src/app/admin/(dashboard)/services/page.tsx`

**Checkpoint**: User Story 3 complete - admins can delete services with confirmation

---

## Phase 6: User Story 4 - Manage Service Categories (Priority: P2)

**Goal**: Admins can create, edit, and delete categories with protection for non-empty categories

**Independent Test**: Click "Manage Categories", create new category, edit name, delete empty category

### Implementation for User Story 4

- [x] T026 [US4] Add POST handler to Categories API for creating categories in `src/app/api/admin/categories/route.ts`
- [x] T027 [US4] Create Category by ID API route with GET, PUT handlers in `src/app/api/admin/categories/[id]/route.ts`
- [x] T028 [US4] Add DELETE handler to Category by ID API with service count check in `src/app/api/admin/categories/[id]/route.ts`
- [x] T029 [US4] Create CategoryForm component for create/edit in `src/components/admin/CategoryForm.tsx`
- [x] T030 [US4] Create CategoryManager component with list and CRUD actions in `src/components/admin/CategoryManager.tsx`
- [x] T031 [US4] Add "Manage Categories" button and dialog to services page in `src/app/admin/(dashboard)/services/page.tsx`
- [x] T032 [US4] Implement category delete protection (block if has services) in `src/components/admin/CategoryManager.tsx`

**Checkpoint**: User Story 4 complete - admins can manage categories

---

## Phase 7: User Story 5 - Reorder Services and Categories (Priority: P3)

**Goal**: Admins can change display order of services and categories using up/down controls

**Independent Test**: Click up/down arrows on a service, verify order changes, refresh and confirm persistence

### Implementation for User Story 5

- [x] T033 [US5] Create Service Order API route with PATCH handler in `src/app/api/admin/services/[id]/order/route.ts`
- [x] T034 [US5] Create Category Order API route with PATCH handler in `src/app/api/admin/categories/[id]/order/route.ts`
- [x] T035 [US5] Add up/down order buttons to ServiceList with boundary detection in `src/components/admin/ServiceList.tsx`
- [x] T036 [US5] Add up/down order buttons to CategoryManager with boundary detection in `src/components/admin/CategoryManager.tsx`
- [x] T037 [US5] Implement order swap logic with optimistic UI updates in `src/app/admin/(dashboard)/services/page.tsx`

**Checkpoint**: User Story 5 complete - admins can reorder services and categories

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T038 [P] Add loading states to all API operations in `src/app/admin/(dashboard)/services/page.tsx`
- [x] T039 [P] Add error boundary for graceful error handling in `src/app/admin/(dashboard)/services/page.tsx`
- [x] T040 Verify all forms have accessible labels and keyboard navigation
- [x] T041 Run manual testing checklist from quickstart.md
- [x] T042 Verify changes appear correctly on public services pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on T001-T005 (shadcn components and slug utility)
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Priority | Can Start After | Dependencies on Other Stories |
|-------|----------|-----------------|-------------------------------|
| US1 - Create Service | P1 | Phase 2 | None |
| US2 - Edit Service | P1 | Phase 2 | Shares ServiceForm with US1 |
| US3 - Delete Service | P2 | Phase 2 | Shares ServiceList with US1 |
| US4 - Manage Categories | P2 | Phase 2 | None (independent) |
| US5 - Reorder | P3 | Phase 2 | Uses ServiceList and CategoryManager |

### Within Each User Story

1. API routes before components
2. Form components before list integration
3. Core functionality before optimistic updates
4. Complete story before moving to next priority

### Parallel Opportunities

**Phase 1 - All parallel**:
```
T001, T002, T003, T004 (shadcn installs)
```

**Phase 2 - Partially parallel**:
```
T006, T007 (API routes - parallel)
T008 (DeleteConfirmDialog - parallel with above)
T009 depends on T004 (Toast)
```

**After Phase 2 - User stories can run in parallel if team capacity allows**

---

## Parallel Example: User Story 1

```bash
# These tasks must be sequential (dependency chain):
T010 (POST API) → T011 (ServiceForm) → T012 (auto-slug) → T013 (ServiceList) → T014 (Page integration) → T015 (Toast)
```

## Parallel Example: User Story 4 (Independent)

```bash
# US4 can run in parallel with US1/US2/US3 since it only touches category-related files
T026-T032 (Category management) - no conflicts with service tasks
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (install components)
2. Complete Phase 2: Foundational (API scaffolding)
3. Complete Phase 3: User Story 1 - Create Service
4. Complete Phase 4: User Story 2 - Edit Service
5. **STOP and VALIDATE**: Test create and edit independently
6. Deploy/demo if ready - basic service management working

### Incremental Delivery

1. **MVP**: Setup + Foundational + US1 + US2 → Create & Edit services
2. **+Delete**: Add US3 → Full service CRUD
3. **+Categories**: Add US4 → Category management
4. **+Reordering**: Add US5 → Display order control
5. **Polish**: Phase 8 → Production-ready

### Task Count Summary

| Phase | Task Count |
|-------|------------|
| Phase 1: Setup | 5 |
| Phase 2: Foundational | 4 |
| Phase 3: US1 Create | 6 |
| Phase 4: US2 Edit | 6 |
| Phase 5: US3 Delete | 4 |
| Phase 6: US4 Categories | 7 |
| Phase 7: US5 Reorder | 5 |
| Phase 8: Polish | 5 |
| **Total** | **42** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing Zod schemas in `src/lib/validations.ts` are ready to use (serviceSchema, categorySchema)
- Existing auth helpers in `src/lib/require-admin.ts` are ready to use
