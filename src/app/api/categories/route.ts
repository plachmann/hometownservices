import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { services: true },
        },
      },
    });

    return successResponse(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return serverErrorResponse();
  }
}
