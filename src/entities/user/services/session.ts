import "server-only";
import { jwtVerify, SignJWT } from "jose";
import {
  SessionEntity,
  UserEntity,
  userToSession,
} from "@/entities/user/domain";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/kernel/routes";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionEntity) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionEntity;
  } catch (error) {
    console.log("Failed to verify session: ", error);
  }
}

async function addSession(user: UserEntity) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionData = userToSession(user, expiresAt.toISOString());

  const session = await encrypt(sessionData);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    // secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

async function updateSession(sessionData: SessionEntity) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const encryptedSession = await encrypt({
    ...sessionData,
    expiredAt: expiresAt.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set("session", encryptedSession, {
    httpOnly: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

async function verifySession() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    redirect(routes.signIn());
  }

  return { isAuth: true, session };
}

export const sessionService = {
  addSession,
  deleteSession,
  verifySession,
  updateSession,
};
