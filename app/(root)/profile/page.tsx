import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";

// The sidebar's "Profile" link: send the signed-in user to their own page
export default async function MyProfile() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/sign-in");
  redirect(`/profile/${userId}`);
}
