import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, serverErrorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    const where = categorySlug
      ? { category: { slug: categorySlug } }
      : undefined;

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { category: { displayOrder: "asc" } },
        { displayOrder: "asc" },
      ],
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return serverErrorResponse();
  }
}
