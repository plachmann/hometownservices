import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET environment variable must be set. Generate one with: openssl rand -base64 32"
  );
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "hometown-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  },
};
