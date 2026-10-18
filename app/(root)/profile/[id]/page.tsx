import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import IdeaList from "@/components/cards/IdeaList";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import { fetchIdeasByAuthor } from "@/lib/actions/idea.action";
import { fetchUser, fetchUserStats } from "@/lib/actions/user.action";
import { getViewer } from "@/lib/viewer";

// "Tagged" needs mentions, which do not exist yet, so only these two render
const TABS = profileTabs.filter(
  (tab): tab is (typeof profileTabs)[number] & { value: "ideas" | "replies" } =>
    tab.value === "ideas" || tab.value === "replies",
);

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const activeTab =
    (await searchParams).tab === "replies" ? "replies" : "ideas";

  const [profile, viewer] = await Promise.all([fetchUser(id), getViewer()]);
  if (!profile?.onboarded) notFound();

  const profileId = String(profile._id);
  const [stats, ideas] = await Promise.all([
    fetchUserStats(profileId),
    fetchIdeasByAuthor(profileId, activeTab),
  ]);

  return (
    <section>
      <ProfileHeader
        name={profile.name}
        username={profile.username}
        image={profile.image}
        bio={profile.bio}
        isOwner={viewer.sessionUserId === profile.id}
        stats={stats}
      />

      <nav
        aria-label="Profile tabs"
        className="mt-9 flex w-full rounded-lg bg-dark-2"
      >
        {TABS.map((tab) => {
          const isActive = tab.value === activeTab;
          const count = tab.value === "ideas" ? stats.ideas : stats.replies;
          return (
            <Link
              key={tab.value}
              href={
                tab.value === "ideas"
                  ? `/profile/${id}`
                  : `/profile/${id}?tab=${tab.value}`
              }
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-[50px] flex-1 items-center justify-center gap-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#0e0e12] text-light-1"
                  : "text-light-3 hover:text-light-1"
              }`}
            >
              <Image
                src={tab.icon}
                alt=""
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="text-base-medium">{tab.label}</span>
              <span className="rounded-sm bg-light-4 px-2 py-0.5 text-tiny-medium tabular-nums text-light-2">
                {count}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-9 flex flex-col gap-10">
        <IdeaList
          ideas={ideas}
          viewer={viewer}
          emptyText={activeTab === "ideas" ? "No ideas yet" : "No replies yet"}
        />
      </div>
    </section>
  );
}
