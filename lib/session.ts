import { auth, currentUser } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { DEMO_USER_ID, isDemoMode } from "./demo";

// One place that answers "who is signing this request", so pages and server
// actions work the same with Clerk and in demo mode.

/** Clerk user id of the signed-in user, the demo visitor in demo mode, or null. */
export async function getSessionUserId(): Promise<string | null> {
  if (isDemoMode) {
    // Reading auth() makes a page dynamic; do the same here so demo pages are
    // rendered per request instead of prerendered once at build time
    await connection();
    return DEMO_USER_ID;
  }
  const { userId } = await auth();
  return userId;
}

export interface SessionProfile {
  id: string;
  username: string | null;
  firstName: string | null;
  imageUrl: string;
}

/** Clerk profile fields used to prefill onboarding before a Mongo profile exists. */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  if (isDemoMode) {
    await connection();
    return { id: DEMO_USER_ID, username: null, firstName: null, imageUrl: "" };
  }
  const user = await currentUser();
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    imageUrl: user.imageUrl,
  };
}
