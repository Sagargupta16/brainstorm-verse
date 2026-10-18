import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // Prefill from the saved profile so revisiting onboarding edits it instead of starting blank
  const userInfo = await fetchUser(user.id);
  const userData = {
    id: user.id,
    objectId: userInfo?._id?.toString() || "",
    username: userInfo?.username || user.username || "",
    name: userInfo?.name || user.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl || "",
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-6 py-20 sm:px-10">
      <h1 className="head-text">OnBoarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile to get started
      </p>
      <section className="mt-9 bg-dark-2 p-6 sm:p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
