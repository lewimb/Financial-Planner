import { createCookieSessionStorage } from "react-router";

type SessionData = {
  accessToken: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "accessToken",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
      secrets: [process.env.SESSION_SECRET ?? "CHANGE_ME_IN_PRODUCTION"],
    },
  });

export { getSession, commitSession, destroySession };
