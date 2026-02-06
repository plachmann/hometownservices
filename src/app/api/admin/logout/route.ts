import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    // Destroy session completely
    session.destroy();

    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return serverErrorResponse();
  }
}
