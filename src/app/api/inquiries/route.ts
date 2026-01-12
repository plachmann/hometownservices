import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyCaptcha } from "@/lib/captcha";
import { contactInquirySchema } from "@/lib/validations";
import {
  successResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-utils";
import { ZodError } from "zod";
import { contactRatelimit, getClientIp, checkRateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP address (3 submissions per hour)
    const ip = getClientIp(request);
    const rateLimitResponse = await checkRateLimit(contactRatelimit, ip);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate input
    const validatedData = contactInquirySchema.parse(body);

    // Verify CAPTCHA
    const captchaResult = await verifyCaptcha(validatedData.captchaToken);
    if (!captchaResult.success) {
      return errorResponse(captchaResult.error || "CAPTCHA verification failed");
    }

    // Validate service ID if provided
    if (validatedData.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: validatedData.serviceId },
      });
      if (!service) {
        return errorResponse("Invalid service selected");
      }
    }

    // Create inquiry
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        serviceId: validatedData.serviceId || null,
        message: validatedData.message,
      },
    });

    return successResponse({ id: inquiry.id }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    console.error("Error creating inquiry:", error);
    return serverErrorResponse();
  }
}
