import IdeaCard from "@/components/cards/IdeaCard";
import { fetchVotedIdeaIds } from "@/lib/actions/idea.action";
import type { Viewer } from "@/lib/viewer";

interface Props {
  ideas: any[];
  viewer: Viewer;
  isComment?: boolean;
  emptyText: string;
}

// Renders populated Idea documents as cards, with the viewer's own votes
// looked up in one query for the whole list
async function IdeaList({
  ideas,
  viewer,
  isComment = false,
  emptyText,
}: Readonly<Props>) {
  const visible = ideas.filter((idea) => idea.author);
  if (visible.length === 0) {
    return <p className="no-result">{emptyText}</p>;
  }

  const voted = new Set(
    await fetchVotedIdeaIds(visible.map((idea) => String(idea._id))),
  );

  return (
    <>
      {visible.map((idea) => (
        <IdeaCard
          key={String(idea._id)}
          id={String(idea._id)}
          currentUserId={viewer.sessionUserId || ""}
          parentId={idea.parentID ?? null}
          content={idea.text}
          author={idea.author}
          community={idea.community}
          createdAt={idea.createdAt}
          comments={idea.children}
          isComment={isComment}
          upvotes={idea.upvotes ?? 0}
          hasVoted={voted.has(String(idea._id))}
          voteRedirect={viewer.actionRedirect}
        />
      ))}
    </>
  );
}

export default IdeaList;
