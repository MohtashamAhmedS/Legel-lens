import { cookies } from "next/headers";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { env } from "@/lib/config/env";

/**
 * Wraps a route handler, guaranteeing a session User document exists
 * before the handler runs. No login, no password — just a random token
 * in an httpOnly cookie, generated transparently on first visit.
 *
 * handler signature: (req, context, session) => Response
 */
export function withSession(handler) {
  return async (req, context) => {
    await connectDB();

    const cookieStore = await cookies();
    let token = cookieStore.get(env.sessionCookieName)?.value;
    let isNew = false;

    if (!token) {
      token = crypto.randomBytes(32).toString("hex");
      isNew = true;
    }

    let session = await User.findOne({ sessionToken: token });
    if (!session) {
      session = await User.create({ sessionToken: token });
      isNew = true;
    }

    const response = await handler(req, context, session);

    if (isNew) {
      response.cookies.set(env.sessionCookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  };
}
