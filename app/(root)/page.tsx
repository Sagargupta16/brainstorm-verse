import { fetchPosts } from "@/lib/actions/idea.action";
import { currentUser } from "@clerk/nextjs";
import IdeaCard from "@/components/cards/IdeaCard";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <div className="flex justify-center items-center">
            <h1 className="text-2xl text-gray-500">No Posts</h1>
          </div>
        ) : (
          <>
            {result.posts.map((post) => (
              <IdeaCard
                key={post.id}
                id={post.id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
            ;
          </>
        )}
      </section>
    </>
  );
}
