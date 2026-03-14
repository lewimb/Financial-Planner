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
      secrets: ["s3cret1"],
    },
  });

export { getSession, commitSession, destroySession };
