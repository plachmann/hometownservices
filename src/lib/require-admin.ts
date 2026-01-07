import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./auth";
import { ApiResponse, unauthorizedResponse } from "./api-utils";
import { NextResponse } from "next/server";

export interface AdminContext {
  userId: string;
  username: string;
}

export type AdminRouteHandler = (
  request: Request,
  context: AdminContext
) => Promise<NextResponse<ApiResponse>>;

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function requireAdmin(): Promise<AdminContext | null> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId || !session.username) {
    return null;
  }

  return {
    userId: session.userId,
    username: session.username,
  };
}

export function withAdminAuth(
  handler: AdminRouteHandler
): (request: Request) => Promise<NextResponse<ApiResponse>> {
  return async (request: Request) => {
    const admin = await requireAdmin();

    if (!admin) {
      return unauthorizedResponse();
    }

    return handler(request, admin);
  };
}
