import { notFound } from "next/navigation";
import IdeaList from "@/components/cards/IdeaList";
import ReplyForm from "@/components/forms/ReplyForm";
import { fetchIdeaById } from "@/lib/actions/idea.action";
import { getViewer } from "@/lib/viewer";

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [idea, viewer] = await Promise.all([fetchIdeaById(id), getViewer()]);
  if (!idea?.author) notFound();

  return (
    <section className="relative">
      <div className="flex flex-col gap-10">
        <IdeaList ideas={[idea]} viewer={viewer} emptyText="Idea not found" />
      </div>

      <div className="mt-7">
        <ReplyForm
          ideaId={String(idea._id)}
          currentUserImg={viewer.user?.image ?? null}
          redirectTo={viewer.actionRedirect}
        />
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <IdeaList
          ideas={idea.children}
          viewer={viewer}
          isComment
          emptyText="No replies yet. Start the thread."
        />
      </div>
    </section>
  );
}
