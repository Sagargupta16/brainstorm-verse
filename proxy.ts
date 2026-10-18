import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo";

// Everything not listed here needs a Clerk session. Reading ideas, profiles
// and search is public so a visitor can browse before signing up; posting,
// replying and voting are re-checked inside each server action anyway.
// See https://clerk.com/docs/references/nextjs/clerk-middleware
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook/clerk",
  "/idea/(.*)",
  "/profile/(.*)",
  "/search",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

// Demo mode has no Clerk instance; lib/session.ts supplies the demo visitor
export default isDemoMode ? () => NextResponse.next() : clerkProxy;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
