import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { unauthorizedResponse } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { direction } = body;

    if (!direction || !["up", "down"].includes(direction)) {
      return NextResponse.json(
        { success: false, error: "Invalid direction" },
        { status: 400 }
      );
    }

    // Get the category
    const category = await prisma.serviceCategory.findUnique({
      where: { id },
      select: { id: true, displayOrder: true },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Get all categories ordered by displayOrder
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, displayOrder: true },
    });

    const currentIndex = categories.findIndex((c) => c.id === id);

    // Check bounds
    if (direction === "up" && currentIndex === 0) {
      return NextResponse.json(
        { success: false, error: "Category is already at the top" },
        { status: 400 }
      );
    }

    if (direction === "down" && currentIndex === categories.length - 1) {
      return NextResponse.json(
        { success: false, error: "Category is already at the bottom" },
        { status: 400 }
      );
    }

    // Get the adjacent category to swap with
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapCategory = categories[swapIndex];

    // Swap displayOrder values
    await prisma.$transaction([
      prisma.serviceCategory.update({
        where: { id: category.id },
        data: { displayOrder: swapCategory.displayOrder },
      }),
      prisma.serviceCategory.update({
        where: { id: swapCategory.id },
        data: { displayOrder: category.displayOrder },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder category" },
      { status: 500 }
    );
  }
}
