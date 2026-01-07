import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/require-admin";
import { inquiryStatusSchema } from "@/lib/validations";
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/api-utils";
import { ZodError } from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;

    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
      include: {
        service: {
          select: { id: true, name: true },
        },
      },
    });

    if (!inquiry) {
      return notFoundResponse("Inquiry");
    }

    return successResponse(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return serverErrorResponse();
  }
}

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

    // Validate status
    const { status } = inquiryStatusSchema.parse(body);

    // Check if inquiry exists
    const existing = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!existing) {
      return notFoundResponse("Inquiry");
    }

    // Update inquiry
    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    return successResponse(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    console.error("Error updating inquiry:", error);
    return serverErrorResponse();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await params;

    // Check if inquiry exists
    const existing = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!existing) {
      return notFoundResponse("Inquiry");
    }

    // Delete inquiry
    await prisma.contactInquiry.delete({
      where: { id },
    });

    return successResponse({ message: "Inquiry deleted" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return serverErrorResponse();
  }
}
