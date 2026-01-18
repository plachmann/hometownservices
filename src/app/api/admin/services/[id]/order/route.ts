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

    // Get the service and its category
    const service = await prisma.service.findUnique({
      where: { id },
      select: { id: true, displayOrder: true, categoryId: true },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Get all services in the same category ordered by displayOrder
    const servicesInCategory = await prisma.service.findMany({
      where: { categoryId: service.categoryId },
      orderBy: { displayOrder: "asc" },
      select: { id: true, displayOrder: true },
    });

    const currentIndex = servicesInCategory.findIndex((s) => s.id === id);

    // Check bounds
    if (direction === "up" && currentIndex === 0) {
      return NextResponse.json(
        { success: false, error: "Service is already at the top" },
        { status: 400 }
      );
    }

    if (direction === "down" && currentIndex === servicesInCategory.length - 1) {
      return NextResponse.json(
        { success: false, error: "Service is already at the bottom" },
        { status: 400 }
      );
    }

    // Get the adjacent service to swap with
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapService = servicesInCategory[swapIndex];

    // Swap displayOrder values
    await prisma.$transaction([
      prisma.service.update({
        where: { id: service.id },
        data: { displayOrder: swapService.displayOrder },
      }),
      prisma.service.update({
        where: { id: swapService.id },
        data: { displayOrder: service.displayOrder },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordering service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder service" },
      { status: 500 }
    );
  }
}
