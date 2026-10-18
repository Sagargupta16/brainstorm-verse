import Image from "next/image";
import Link from "next/link";
import IdeaList from "@/components/cards/IdeaList";
import { searchIdeas } from "@/lib/actions/idea.action";
import { searchUsers } from "@/lib/actions/user.action";
import { getViewer } from "@/lib/viewer";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = ((await searchParams).q ?? "").trim().slice(0, 100);
  const [users, ideas, viewer] = await Promise.all([
    searchUsers(query, 8),
    searchIdeas(query),
    getViewer(),
  ]);

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* A plain GET form: works without JavaScript and keeps results shareable */}
      <form action="/search" role="search" className="searchbar">
        <Image
          src="/assets/search-gray.svg"
          alt=""
          width={24}
          height={24}
          className="object-contain"
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search ideas and people"
          aria-label="Search ideas and people"
          className="searchbar_input w-full bg-transparent px-2"
        />
      </form>

      {query.length < 2 ? (
        <p className="no-result mt-10">Type at least 2 characters</p>
      ) : (
        <>
          <h2 className="mt-10 text-heading4-medium text-light-1">People</h2>
          <div className="mt-5 flex flex-col gap-6">
            {users.length === 0 ? (
              <p className="no-result">No people match</p>
            ) : (
              users.map((user: any) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="user-card"
                >
                  <div className="user-card_avatar">
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-base-semibold text-light-1">
                        {user.name}
                      </h4>
                      <p className="truncate text-small-medium text-gray-1">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <h2 className="mt-10 text-heading4-medium text-light-1">Ideas</h2>
          <div className="mt-5 flex flex-col gap-10">
            <IdeaList
              ideas={ideas}
              viewer={viewer}
              emptyText="No ideas match"
            />
          </div>
        </>
      )}
    </section>
  );
}
