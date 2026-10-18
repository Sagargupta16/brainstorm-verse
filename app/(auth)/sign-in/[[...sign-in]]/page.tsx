import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo";

export default function Page() {
  // Demo mode has no Clerk instance; every visitor is already signed in
  if (isDemoMode) redirect("/");
  return <SignIn />;
}
