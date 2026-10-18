import { redirect } from "next/navigation";
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { getSessionUserId } from "@/lib/session";

export default async function EditProfile() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/sign-in");

  const userInfo = await fetchUser(userId);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: userId,
    objectId: String(userInfo._id),
    username: userInfo.username,
    name: userInfo.name,
    bio: userInfo.bio || "",
    image: userInfo.image || "",
  };

  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>
      <section className="mt-12">
        <AccountProfile user={userData} btnTitle="Save" />
      </section>
    </>
  );
}
