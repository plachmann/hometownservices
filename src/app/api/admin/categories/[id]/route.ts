import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { unauthorizedResponse } from "@/lib/api-utils";
import { categorySchema } from "@/lib/validations";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

/**
 * GET /api/admin/categories/[id]
 * Get a single category by ID with service count
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  try {
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/categories/[id]
 * Update an existing category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  try {
    // Check if category exists
    const existingCategory = await prisma.serviceCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, displayOrder } = result.data;

    // Generate slug if name changed
    let slug = existingCategory.slug;
    if (name !== existingCategory.name) {
      const existingSlugs = await prisma.serviceCategory.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      });
      slug = ensureUniqueSlug(
        generateSlug(name),
        existingSlugs.map((c) => c.slug)
      );
    }

    const category = await prisma.serviceCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        displayOrder: displayOrder ?? existingCategory.displayOrder,
      },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category (only if empty)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  const { id } = await params;

  try {
    // Check if category exists and get service count
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Block deletion if category has services
    if (category._count.services > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category with ${category._count.services} service(s). Please reassign or delete the services first.`,
          serviceCount: category._count.services,
        },
        { status: 400 }
      );
    }

    // Check if this is the last category
    const categoryCount = await prisma.serviceCategory.count();
    if (categoryCount <= 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete the last category. At least one category must exist.",
        },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.serviceCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
