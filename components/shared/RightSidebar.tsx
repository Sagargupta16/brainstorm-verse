import Image from "next/image";
import Link from "next/link";
import { fetchTopContributors } from "@/lib/actions/user.action";

async function RightSidebar() {
  const contributors = await fetchTopContributors(4);

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <p className="mt-1 text-subtle-medium text-gray-1">
          Most upvoted authors
        </p>
        <div className="mt-6 flex w-[300px] flex-col gap-6">
          {contributors.length === 0 ? (
            <p className="text-small-regular text-light-3">No upvotes yet</p>
          ) : (
            contributors.map((user: any) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="flex items-center gap-3"
              >
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base-semibold text-light-1">
                    {user.name}
                  </p>
                  <p className="truncate text-small-medium text-gray-1">
                    @{user.username}
                  </p>
                </div>
                <span className="text-small-semibold tabular-nums text-light-3">
                  {user.upvotes}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
