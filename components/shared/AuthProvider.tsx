import { ClerkProvider } from "@clerk/nextjs";
import { isDemoMode } from "@/lib/demo";

// Demo mode runs without Clerk keys, so the provider is skipped entirely
function AuthProvider({ children }: { children: React.ReactNode }) {
  if (isDemoMode) return <>{children}</>;
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default AuthProvider;
