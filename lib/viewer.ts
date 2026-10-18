import { fetchUser } from "./actions/user.action";
import { getSessionUserId } from "./session";

/**
 * Who is looking at a page, and where a vote or reply click should send them
 * if they cannot act yet: signed out goes to /sign-in, signed in without a
 * finished profile goes to /onboarding, everyone else stays put (null).
 */
export async function getViewer() {
  const sessionUserId = await getSessionUserId();
  const user = sessionUserId ? await fetchUser(sessionUserId) : null;

  let actionRedirect: string | null = null;
  if (!sessionUserId) actionRedirect = "/sign-in";
  else if (!user?.onboarded) actionRedirect = "/onboarding";

  return { sessionUserId, user, actionRedirect };
}

export type Viewer = Awaited<ReturnType<typeof getViewer>>;
