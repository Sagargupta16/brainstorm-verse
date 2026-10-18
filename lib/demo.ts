// Demo mode runs the app without Clerk: every request acts as one seeded
// "visitor" account. `npm run demo` turns it on together with an in-memory
// MongoDB, so a fresh clone can be browsed with no accounts or keys.
// NEXT_PUBLIC_ so client components (sidebar, top bar) see the same value.
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Clerk-style user id of the seeded visitor that demo sessions act as
export const DEMO_USER_ID = "demo_visitor";
