# Quickstart: Admin Services CRUD

**Feature Branch**: `003-admin-services-crud`
**Date**: 2026-01-12

## Prerequisites

Ensure your development environment is set up:

```bash
# Install dependencies (if not already done)
npm install

# Database should be running with existing schema
npx prisma db push

# Seed data (if needed)
npm run db:seed
```

## Required shadcn/ui Components

Install additional UI components needed for this feature:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add alert-dialog
npx shadcn@latest add toast
```

## Implementation Order

### Phase 1: API Routes (Backend)

1. **Create slug utility** (`src/lib/slug.ts`)
   - `generateSlug(name: string): string`
   - `ensureUniqueSlug(slug: string, existingSlugs: string[]): string`

2. **Services API** (`src/app/api/admin/services/route.ts`)
   - GET: List all services with categories
   - POST: Create new service with slug generation

3. **Service by ID API** (`src/app/api/admin/services/[id]/route.ts`)
   - GET: Fetch single service
   - PUT: Update service
   - DELETE: Delete service (check inquiries first)

4. **Service Order API** (`src/app/api/admin/services/[id]/order/route.ts`)
   - PATCH: Move service up/down

5. **Categories API** (`src/app/api/admin/categories/route.ts`)
   - GET: List all categories with counts
   - POST: Create new category

6. **Category by ID API** (`src/app/api/admin/categories/[id]/route.ts`)
   - GET: Fetch single category
   - PUT: Update category
   - DELETE: Delete category (block if has services)

7. **Category Order API** (`src/app/api/admin/categories/[id]/order/route.ts`)
   - PATCH: Move category up/down

### Phase 2: Components (Frontend)

1. **DeleteConfirmDialog** (`src/components/admin/DeleteConfirmDialog.tsx`)
   - Reusable confirmation modal
   - Props: title, description, onConfirm, onCancel

2. **ServiceForm** (`src/components/admin/ServiceForm.tsx`)
   - Form for create/edit service
   - Category dropdown using Select component
   - Auto-slug generation from name

3. **CategoryForm** (`src/components/admin/CategoryForm.tsx`)
   - Form for create/edit category
   - Simpler than ServiceForm

4. **ServiceList** (`src/components/admin/ServiceList.tsx`)
   - Interactive list with edit/delete/reorder actions
   - Grouped by category

5. **CategoryManager** (`src/components/admin/CategoryManager.tsx`)
   - Modal/drawer for managing categories
   - List with CRUD actions

### Phase 3: Page Integration

1. **Update services page** (`src/app/admin/(dashboard)/services/page.tsx`)
   - Convert to client component (for interactivity)
   - Add "Add Service" button
   - Add "Manage Categories" button
   - Integrate ServiceList component
   - Add toast notifications

## Key Patterns

### Authentication Check

```typescript
import { requireAdmin, unauthorizedResponse } from "@/lib/require-admin";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }
  // ... handler logic
}
```

### Zod Validation

```typescript
import { serviceSchema } from "@/lib/validations";

const body = await request.json();
const result = serviceSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { success: false, error: result.error.errors[0].message },
    { status: 400 }
  );
}
```

### API Response Format

```typescript
// Success
return NextResponse.json({ success: true, data: service }, { status: 201 });

// Error
return NextResponse.json(
  { success: false, error: "Service not found" },
  { status: 404 }
);
```

### Optimistic UI Updates

```typescript
// In component
const [services, setServices] = useState(initialServices);

const handleDelete = async (id: string) => {
  // Optimistically remove from UI
  setServices(prev => prev.filter(s => s.id !== id));

  const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    // Revert on error
    setServices(initialServices);
    toast.error("Failed to delete service");
  }
};
```

## Testing the Feature

1. **Manual Testing Checklist**:
   - [ ] Create a new service with all fields
   - [ ] Edit an existing service
   - [ ] Delete a service without inquiries
   - [ ] Delete a service with inquiries (warning shown)
   - [ ] Create a new category
   - [ ] Edit a category name
   - [ ] Try to delete category with services (should be blocked)
   - [ ] Delete an empty category
   - [ ] Reorder services within a category
   - [ ] Reorder categories
   - [ ] Verify changes appear on public site

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Navigate to admin**:
   - Go to `http://localhost:3000/admin/login`
   - Login with admin credentials
   - Navigate to Services page

## Common Issues

### "Slug already exists" error
- The generated slug conflicts with an existing one
- Either modify the name or manually specify a different slug

### Cannot delete category
- The category has services assigned
- Reassign services to another category first

### Form validation errors not showing
- Ensure Zod error messages are being passed to form state
- Check that Input components have proper error prop handling
