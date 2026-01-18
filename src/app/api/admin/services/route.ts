import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { unauthorizedResponse } from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validations";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

/**
 * GET /api/admin/services
 * Returns all services grouped by category
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
        services: {
          orderBy: { displayOrder: "asc" },
          include: {
            _count: {
              select: { inquiries: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/services
 * Create a new service
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, description, imageUrl, isSubcontracted, categoryId, displayOrder } = result.data;

    // Verify category exists
    const category = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const existingSlugs = await prisma.service.findMany({
      select: { slug: true },
    });
    const slug = ensureUniqueSlug(
      generateSlug(name),
      existingSlugs.map((s) => s.slug)
    );

    // Get max display order if not provided
    let order = displayOrder ?? 0;
    if (order === 0) {
      const maxOrder = await prisma.service.aggregate({
        where: { categoryId },
        _max: { displayOrder: true },
      });
      order = (maxOrder._max.displayOrder ?? 0) + 1;
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        imageUrl: imageUrl || null,
        isSubcontracted,
        categoryId,
        displayOrder: order,
      },
      include: {
        category: true,
        _count: {
          select: { inquiries: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
