import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import prisma from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/api-utils";
import { ZodError } from "zod";
import { loginRatelimit, getClientIp, checkRateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP address
    const ip = getClientIp(request);
    const rateLimitResponse = await checkRateLimit(loginRatelimit, ip);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();

    // Validate input
    const { username, password } = adminLoginSchema.parse(body);

    // Find user
    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      return errorResponse("Invalid username or password", 401);
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return errorResponse("Invalid username or password", 401);
    }

    // Create session
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    session.userId = user.id;
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();

    return successResponse({ message: "Login successful" });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    console.error("Login error:", error);
    return serverErrorResponse();
  }
}
