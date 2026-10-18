import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { deleteUserData } from "@/lib/user-cleanup";

// Clerk calls this when a user is deleted from the Clerk dashboard or deletes
// their own account, so MongoDB does not keep orphaned profiles and ideas.
// proxy.ts leaves this path public; the Standard Webhooks signature
// (CLERK_WEBHOOK_SIGNING_SECRET) is the only thing that authenticates it.
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (evt.type === "user.deleted") {
    if (!evt.data.id) {
      return new Response("Missing user id", { status: 400 });
    }
    const result = await deleteUserData(evt.data.id);
    return Response.json(result);
  }

  // Other event types are acknowledged so Clerk does not retry them
  return new Response(null, { status: 204 });
}
