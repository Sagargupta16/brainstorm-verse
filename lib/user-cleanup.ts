import Idea from "./models/idea.model";
import User from "./models/user.model";
import Vote from "./models/vote.model";
import { connectToDB } from "./mongoose";

// Deliberately NOT a "use server" module: anything exported from one becomes
// a public server action, and this must only run from the signed Clerk
// webhook.

export interface CleanupResult {
  deleted: boolean;
  ideas: number;
  votes: number;
}

// Add every reply below `frontier` to `doomed`, one thread level per query
async function collectReplies(
  frontier: string[],
  doomed: Set<string>,
): Promise<void> {
  if (frontier.length === 0) return;
  const replies = await Idea.find({ parentID: { $in: frontier } })
    .select("_id")
    .lean<{ _id: unknown }[]>();
  const next = replies
    .map((reply) => String(reply._id))
    .filter((id) => !doomed.has(id));
  next.forEach((id) => doomed.add(id));
  return collectReplies(next, doomed);
}

/**
 * Remove a Clerk user from MongoDB: their profile, every idea they wrote, the
 * replies under those ideas (a thread without its root has nowhere to show),
 * the votes on all of those, and their own votes on other ideas, with the
 * upvote counters moved back down.
 */
export async function deleteUserData(
  clerkUserId: string,
): Promise<CleanupResult> {
  await connectToDB();

  const user = await User.findOne({ id: clerkUserId }).select("_id");
  if (!user) return { deleted: false, ideas: 0, votes: 0 };

  // Collect the user's ideas plus every reply below them, level by level
  const authored = await Idea.find({ author: user._id })
    .select("_id")
    .lean<{ _id: unknown }[]>();
  const doomed = new Set(authored.map((idea) => String(idea._id)));
  await collectReplies([...doomed], doomed);
  const doomedIds = [...doomed];

  // Their votes on ideas that survive: take each one back off the counter
  const castVotes = await Vote.find({
    user: user._id,
    idea: { $nin: doomedIds },
  })
    .select("idea")
    .lean<{ idea: unknown }[]>();
  if (castVotes.length > 0) {
    await Idea.updateMany(
      { _id: { $in: castVotes.map((vote) => vote.idea) }, upvotes: { $gt: 0 } },
      { $inc: { upvotes: -1 } },
    );
  }

  const { deletedCount: votes } = await Vote.deleteMany({
    $or: [{ user: user._id }, { idea: { $in: doomedIds } }],
  });
  await Idea.updateMany(
    { children: { $in: doomedIds } },
    { $pull: { children: { $in: doomedIds } } },
  );
  await User.updateMany(
    { ideas: { $in: doomedIds } },
    { $pull: { ideas: { $in: doomedIds } } },
  );
  const { deletedCount: ideas } = await Idea.deleteMany({
    _id: { $in: doomedIds },
  });
  await User.deleteOne({ _id: user._id });

  return { deleted: true, ideas, votes };
}
