import PostIdea from "@/components/forms/PostIdea";
import { fetchUser } from "@/lib/actions/user.action";
import { getSessionUserId } from "@/lib/session";
import { redirect } from "next/navigation";

async function Page() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const userInfo = await fetchUser(userId);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Idea</h1>
      <PostIdea userId={String(userInfo._id)} />
    </>
  );
}

export default Page;
