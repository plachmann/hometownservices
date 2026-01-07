import prisma from "@/lib/prisma";
import { successResponse, notFoundResponse, serverErrorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      return notFoundResponse("Site settings");
    }

    // Return only public-safe data (exclude sensitive info if any)
    return successResponse({
      serviceAreaLat: Number(settings.serviceAreaLat),
      serviceAreaLng: Number(settings.serviceAreaLng),
      serviceAreaMiles: settings.serviceAreaMiles,
      companyName: settings.companyName,
      companyPhone: settings.companyPhone,
      companyEmail: settings.companyEmail,
      companyAddress: settings.companyAddress,
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return serverErrorResponse();
  }
}
