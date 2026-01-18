import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { unauthorizedResponse } from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validations";
import { generateSlug, ensureUniqueSlug } from "@/lib/slug";

/**
 * GET /api/admin/services/[id]
 * Get a single service by ID
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
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { inquiries: true },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/services/[id]
 * Update an existing service
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
    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

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

    // Generate slug if name changed
    let slug = existingService.slug;
    if (name !== existingService.name) {
      const existingSlugs = await prisma.service.findMany({
        where: { id: { not: id } },
        select: { slug: true },
      });
      slug = ensureUniqueSlug(
        generateSlug(name),
        existingSlugs.map((s) => s.slug)
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl: imageUrl || null,
        isSubcontracted,
        categoryId,
        displayOrder: displayOrder ?? existingService.displayOrder,
      },
      include: {
        category: true,
        _count: {
          select: { inquiries: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update service" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/services/[id]
 * Delete a service
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
    // Check if service exists and get inquiry count
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { inquiries: true },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Unlink inquiries from this service (set serviceId to null)
    if (service._count.inquiries > 0) {
      await prisma.contactInquiry.updateMany({
        where: { serviceId: id },
        data: { serviceId: null },
      });
    }

    // Delete the service
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: {
        hasInquiries: service._count.inquiries > 0,
        inquiryCount: service._count.inquiries,
      },
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
