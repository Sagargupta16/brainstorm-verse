import Link from "next/link";
import IdeaList from "@/components/cards/IdeaList";
import { fetchPosts } from "@/lib/actions/idea.action";
import { FEED_SORTS, parseFeedSort } from "@/lib/ranking";
import { getViewer } from "@/lib/viewer";

const SORT_LABELS = { hot: "Hot", new: "New", top: "Top" } as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sort = parseFeedSort((await searchParams).sort);
  const [result, viewer] = await Promise.all([
    fetchPosts(1, 30, sort),
    getViewer(),
  ]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="head-text text-left">Home</h1>
        <nav
          aria-label="Sort ideas"
          className="flex rounded-full bg-dark-2 p-1"
        >
          {FEED_SORTS.map((option) => (
            <Link
              key={option}
              href={option === "hot" ? "/" : `/?sort=${option}`}
              aria-current={option === sort ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-small-semibold transition-colors ${
                option === sort
                  ? "bg-primary-500 text-light-1"
                  : "text-light-3 hover:text-light-1"
              }`}
            >
              {SORT_LABELS[option]}
            </Link>
          ))}
        </nav>
      </div>
      <section className="mt-9 flex flex-col gap-10">
        <IdeaList ideas={result.posts} viewer={viewer} emptyText="No Posts" />
      </section>
    </>
  );
}
