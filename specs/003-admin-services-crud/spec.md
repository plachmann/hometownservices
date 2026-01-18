# Feature Specification: Admin Services CRUD

**Feature Branch**: `003-admin-services-crud`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "I would like to add CRUD functionality to the /admin/services page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create New Service (Priority: P1)

As an admin, I want to create new services directly from the admin panel so that I can add offerings without editing code or database files.

**Why this priority**: Creating services is the most fundamental CRUD operation. Without the ability to add services, the admin panel cannot grow the service catalog. This is essential for business operations.

**Independent Test**: Can be fully tested by logging into admin, clicking "Add Service", filling out the form, and verifying the new service appears on both the admin list and public site.

**Acceptance Scenarios**:

1. **Given** I am logged in as an admin on the services page, **When** I click "Add Service", **Then** I see a form with fields for name, description, category, subcontracted status, and display order.
2. **Given** I am filling out the new service form, **When** I submit with valid data, **Then** the service is created, I see a success message, and the service appears in the list.
3. **Given** I am filling out the new service form, **When** I submit with missing required fields, **Then** I see validation errors indicating which fields need attention.
4. **Given** I am creating a service, **When** I enter a name, **Then** the system auto-generates a URL-friendly slug (which I can optionally customize).

---

### User Story 2 - Edit Existing Service (Priority: P1)

As an admin, I want to edit existing services so that I can update descriptions, change categories, or correct errors without database access.

**Why this priority**: Editing is equally critical to creating. Business needs change, and admins must be able to update service information quickly. This pairs with Create as core functionality.

**Independent Test**: Can be fully tested by selecting an existing service, modifying fields, saving, and verifying changes persist on refresh and appear on the public site.

**Acceptance Scenarios**:

1. **Given** I am on the services list, **When** I click "Edit" on a service, **Then** I see a form pre-populated with that service's current data.
2. **Given** I am editing a service, **When** I modify fields and save, **Then** the changes are persisted and reflected in the list immediately.
3. **Given** I am editing a service, **When** I change the category, **Then** the service moves to the new category in the organized view.
4. **Given** I am editing a service, **When** I toggle the "subcontracted" flag, **Then** the appropriate badge appears or disappears in the service list.

---

### User Story 3 - Delete Service (Priority: P2)

As an admin, I want to delete services that are no longer offered so that the public site remains accurate and uncluttered.

**Why this priority**: Deletion is important but less frequent than create/edit operations. Requires careful implementation with confirmation to prevent accidental data loss.

**Independent Test**: Can be fully tested by selecting a service, clicking delete, confirming, and verifying the service no longer appears in admin or public views.

**Acceptance Scenarios**:

1. **Given** I am on the services list, **When** I click "Delete" on a service, **Then** I see a confirmation dialog warning about permanent deletion.
2. **Given** I see the delete confirmation dialog, **When** I confirm deletion, **Then** the service is removed from the database and list.
3. **Given** I see the delete confirmation dialog, **When** I cancel, **Then** the service remains unchanged.
4. **Given** a service has associated contact inquiries, **When** I attempt to delete it, **Then** I am warned about the related data and asked to confirm.

---

### User Story 4 - Manage Service Categories (Priority: P2)

As an admin, I want to create, edit, and delete service categories so that I can organize services in a way that makes sense for my business.

**Why this priority**: Categories provide organizational structure. While services can exist without category management, the ability to restructure categories enhances long-term maintainability.

**Independent Test**: Can be fully tested by creating a new category, adding services to it, editing the category name, and deleting an empty category.

**Acceptance Scenarios**:

1. **Given** I am on the services page, **When** I click "Manage Categories", **Then** I see a list of all categories with add/edit/delete options.
2. **Given** I am adding a new category, **When** I provide a name and optional description, **Then** the category is created and available for service assignment.
3. **Given** I am editing a category, **When** I change its name or description, **Then** the changes are reflected throughout the system.
4. **Given** a category has no services, **When** I delete it, **Then** it is removed from the system.
5. **Given** a category has services assigned, **When** I attempt to delete it, **Then** I am prevented or prompted to reassign services first.

---

### User Story 5 - Reorder Services and Categories (Priority: P3)

As an admin, I want to change the display order of services and categories so that I can highlight priority offerings or organize by season/demand.

**Why this priority**: Ordering is a nice-to-have enhancement. The system works without it (uses default ordering), but provides valuable control for presentation.

**Independent Test**: Can be fully tested by dragging services to new positions (or using up/down controls) and verifying the new order persists and displays correctly on the public site.

**Acceptance Scenarios**:

1. **Given** I am viewing services within a category, **When** I drag a service to a new position (or use order controls), **Then** the display order updates.
2. **Given** I am viewing the category list, **When** I reorder categories, **Then** the new order is reflected on the public site.
3. **Given** I have reordered items, **When** I refresh the page, **Then** the new order persists.

---

### Edge Cases

- What happens when creating a service with a name that generates a duplicate slug?
  - System should append a number or show an error prompting for a unique slug
- What happens if an admin tries to delete the last category?
  - System should prevent this to avoid orphaned services
- How does the system handle concurrent edits by multiple admins?
  - Last save wins with timestamp shown; consider optimistic locking for future
- What happens when editing a service that was deleted by another admin?
  - Show error message and refresh the list

## Requirements *(mandatory)*

### Functional Requirements

**Service Management**
- **FR-001**: System MUST allow authenticated admins to create new services with name, description, category, and optional image URL
- **FR-002**: System MUST auto-generate URL-friendly slugs from service names
- **FR-003**: System MUST allow admins to edit all fields of existing services
- **FR-004**: System MUST allow admins to delete services with confirmation
- **FR-005**: System MUST validate that service names are not empty and slugs are unique
- **FR-006**: System MUST display a "subcontracted" indicator that admins can toggle

**Category Management**
- **FR-007**: System MUST allow admins to create new service categories
- **FR-008**: System MUST allow admins to edit category names and descriptions
- **FR-009**: System MUST prevent deletion of categories that contain services (or require reassignment)
- **FR-010**: System MUST validate that category names are not empty and slugs are unique

**Display & Organization**
- **FR-011**: System MUST display services grouped by category in the admin view
- **FR-012**: System MUST allow admins to change the display order of services within categories
- **FR-013**: System MUST allow admins to change the display order of categories
- **FR-014**: System MUST reflect all changes immediately in the admin interface

**Data Integrity**
- **FR-015**: System MUST show a warning before deleting services that have associated contact inquiries
- **FR-016**: System MUST log all create, update, and delete operations for audit purposes

### Key Entities

- **Service**: An offering provided by the business (name, slug, description, image, category, subcontracted flag, display order)
- **ServiceCategory**: A grouping mechanism for related services (name, slug, description, display order)
- **Relationship**: Each Service belongs to exactly one ServiceCategory; a Category can have many Services

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can create a new service in under 60 seconds
- **SC-002**: Admins can edit and save service changes in under 30 seconds
- **SC-003**: All CRUD operations provide immediate visual feedback (success/error within 2 seconds)
- **SC-004**: 100% of form submissions with invalid data display clear, actionable error messages
- **SC-005**: Changes made in admin panel are visible on the public site within 5 seconds of saving
- **SC-006**: Zero accidental deletions due to missing confirmation dialogs
- **SC-007**: Admin can manage full service catalog without needing database access or code changes

## Assumptions

- The existing authentication system (iron-session) will be used for admin access control
- The existing Prisma schema for Service and ServiceCategory will be used without modification
- Image uploads will use URL input (external hosting) rather than file uploads
- The admin interface follows the existing shadcn/ui component library patterns
- Rate limiting on admin routes is already in place from previous implementation
