import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { siteSettingsSchema } from "@/lib/validations";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/api-utils";
import { ZodError } from "zod";

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    // Validate input
    const validatedData = siteSettingsSchema.parse(body);

    // Update settings
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        serviceAreaLat: validatedData.serviceAreaLat,
        serviceAreaLng: validatedData.serviceAreaLng,
        serviceAreaMiles: validatedData.serviceAreaMiles,
        companyName: validatedData.companyName,
        companyPhone: validatedData.companyPhone,
        companyEmail: validatedData.companyEmail,
        companyAddress: validatedData.companyAddress || null,
      },
      create: {
        id: "singleton",
        serviceAreaLat: validatedData.serviceAreaLat,
        serviceAreaLng: validatedData.serviceAreaLng,
        serviceAreaMiles: validatedData.serviceAreaMiles,
        companyName: validatedData.companyName,
        companyPhone: validatedData.companyPhone,
        companyEmail: validatedData.companyEmail,
        companyAddress: validatedData.companyAddress || null,
      },
    });

    return successResponse(settings);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    console.error("Error updating settings:", error);
    return serverErrorResponse();
  }
}
