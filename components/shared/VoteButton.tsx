"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { setVote } from "@/lib/actions/idea.action";

interface Props {
  ideaId: string;
  upvotes: number;
  hasVoted: boolean;
  // Where a click goes when the viewer cannot vote yet (sign-in or onboarding)
  redirectTo: string | null;
}

function VoteButton({ ideaId, upvotes, hasVoted, redirectTo }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Flip the heart and count at once; the server's revalidated props replace
  // this as soon as setVote resolves (or roll it back if it throws)
  const [state, flip] = useOptimistic(
    { upvotes, hasVoted },
    (current, voted: boolean) => ({
      hasVoted: voted,
      upvotes: Math.max(0, current.upvotes + (voted ? 1 : -1)),
    }),
  );

  const onClick = () => {
    if (redirectTo) {
      router.push(redirectTo);
      return;
    }
    const next = !state.hasVoted;
    startTransition(async () => {
      flip(next);
      await setVote({ ideaId, voted: next, path: pathname });
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state.hasVoted}
      aria-label={state.hasVoted ? "Remove upvote" : "Upvote"}
      className="flex items-center gap-1.5 rounded-full transition-transform duration-150 active:scale-90"
    >
      <Image
        key={String(state.hasVoted)}
        src={
          state.hasVoted ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"
        }
        alt=""
        width={24}
        height={24}
        className={state.hasVoted ? "animate-in zoom-in-50 duration-300" : ""}
      />
      <span className="min-w-4 text-small-medium tabular-nums text-light-3">
        {state.upvotes}
      </span>
    </button>
  );
}

export default VoteButton;
