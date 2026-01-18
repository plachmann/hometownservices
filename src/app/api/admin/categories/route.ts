import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { unauthorizedResponse } from "@/lib/api-utils";
import { categorySchema } from "@/lib/validations";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

/**
 * GET /api/admin/categories
 * Returns all categories with service counts
 */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/categories
 * Create a new category
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, displayOrder } = result.data;

    // Generate unique slug
    const existingSlugs = await prisma.serviceCategory.findMany({
      select: { slug: true },
    });
    const slug = ensureUniqueSlug(
      generateSlug(name),
      existingSlugs.map((c) => c.slug)
    );

    // Get max display order if not provided
    let order = displayOrder ?? 0;
    if (order === 0) {
      const maxOrder = await prisma.serviceCategory.aggregate({
        _max: { displayOrder: true },
      });
      order = (maxOrder._max.displayOrder ?? 0) + 1;
    }

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        slug,
        description: description || null,
        displayOrder: order,
      },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
