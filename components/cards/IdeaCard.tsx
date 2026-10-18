import Image from "next/image";
import Link from "next/link";
import VoteButton from "@/components/shared/VoteButton";
import { formatDateString } from "@/lib/utils";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string | Date;
  comments: {
    author: {
      image: string;
    } | null;
  }[];
  isComment?: boolean;
  upvotes?: number;
  hasVoted?: boolean;
  voteRedirect?: string | null;
}

function replyLabel(count: number) {
  return `${count} ${count === 1 ? "reply" : "replies"}`;
}

const IdeaCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment = false,
  upvotes = 0,
  hasVoted = false,
  voteRedirect = null,
}: Props) => {
  const replyAvatars = comments
    .map((comment) => comment.author?.image)
    .filter((image): image is string => Boolean(image))
    .slice(0, 3);

  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-5 sm:p-7"
      }`}
    >
      <div className="flex items-start justify-between ">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.id}`}
              className="relative h-11 w-11 shrink-0"
            >
              <Image
                src={author.image}
                alt={author.name}
                fill
                sizes="44px"
                className="cursor-pointer rounded-full object-cover"
              />
            </Link>
            <div className="idea-card_bar" />
          </div>
          <div className="flex w-full min-w-0 flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 whitespace-pre-line break-words text-small-regular text-light-2">
              {content}
            </p>
            <div
              className={`${isComment ? "mb-8" : ""} mt-5 flex flex-col gap-3`}
            >
              <div className="flex items-center gap-4">
                <VoteButton
                  ideaId={id}
                  upvotes={upvotes}
                  hasVoted={hasVoted}
                  redirectTo={voteRedirect}
                />
                <Link href={`/idea/${id}`} aria-label="Reply">
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                  />
                </Link>
                {/* <Image src="/assets/repost.svg" alt="repost" width={24} height={24} /> */}
                {/* <Image src="/assets/share.svg" alt="share" width={24} height={24} /> */}
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/idea/${id}`}>
                  <p className="text-subtle-medium text-gray-1">
                    {replyLabel(comments.length)}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isComment && comments.length > 0 && (
        <Link
          href={`/idea/${id}`}
          className="ml-1 mt-3 flex items-center gap-2"
        >
          <span className="flex">
            {replyAvatars.map((image, index) => (
              <Image
                key={image + index}
                src={image}
                alt=""
                width={24}
                height={24}
                className={`${index !== 0 ? "-ml-2" : ""} rounded-full border-2 border-dark-2 object-cover`}
              />
            ))}
          </span>
          <p className="text-subtle-medium text-gray-1">
            {replyLabel(comments.length)}
          </p>
        </Link>
      )}

      {!isComment && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(new Date(createdAt).toISOString())}
          </p>
          {parentId && (
            <Link
              href={`/idea/${parentId}`}
              className="text-subtle-medium text-primary-500"
            >
              Replying to an idea
            </Link>
          )}
        </div>
      )}
    </article>
  );
};

export default IdeaCard;
