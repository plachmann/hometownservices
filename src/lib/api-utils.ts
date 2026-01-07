import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function validationErrorResponse(
  zodError: ZodError
): NextResponse<ApiResponse> {
  const errors: Record<string, string[]> = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  }

  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      errors,
    },
    { status: 400 }
  );
}

export function notFoundResponse(
  resource: string = "Resource"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: `${resource} not found` },
    { status: 404 }
  );
}

export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}

export function serverErrorResponse(
  message: string = "Internal server error"
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  );
}
