import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchActivity } from "@/lib/actions/user.action";
import { getViewer } from "@/lib/viewer";
import { formatDateString } from "@/lib/utils";

export default async function ActivityPage() {
  const viewer = await getViewer();
  if (!viewer.sessionUserId) redirect("/sign-in");
  if (!viewer.user?.onboarded) redirect("/onboarding");

  const activity = await fetchActivity();

  return (
    <>
      <h1 className="head-text">Activity</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Replies to and upvotes on your ideas
      </p>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length === 0 ? (
          <p className="no-result">No activity yet</p>
        ) : (
          activity.map((item) => (
            <Link key={item.key} href={`/idea/${item.ideaId}`}>
              <article className="activity-card items-start max-xs:px-4">
                <Image
                  src={item.actor.image}
                  alt={item.actor.name}
                  width={24}
                  height={24}
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-small-regular text-light-1">
                    <span className="text-primary-500">{item.actor.name}</span>{" "}
                    {item.kind === "reply"
                      ? "replied to your idea"
                      : "upvoted your idea"}
                  </p>
                  <p className="mt-1 line-clamp-2 break-words text-small-regular text-light-3">
                    {item.text}
                  </p>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {formatDateString(new Date(item.createdAt).toISOString())}
                  </p>
                </div>
              </article>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
