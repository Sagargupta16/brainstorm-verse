"use server";

import { isValidObjectId, type SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import Idea from "../models/idea.model";
import User from "../models/user.model";
import Vote from "../models/vote.model";
import { connectToDB } from "../mongoose";
import { type FeedSort, hotScoreExpression } from "../ranking";
import { getSessionUserId } from "../session";
import { escapeRegExp } from "../utils";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

// `parentID: null` matches both null and a missing field, i.e. top-level ideas
const TOP_LEVEL = { parentID: null };
const AUTHOR_FIELDS = "_id id name username image";

const replyText = z.string().trim().min(3).max(2000);

// Resolves the session to its Mongo user and refuses anyone who has not
// finished onboarding. Not exported, so it is not callable from the client.
async function requireOnboardedUser() {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) throw new Error("Unauthorized");

  const user = await User.findOne({ id: sessionUserId }).select(
    "_id onboarded",
  );
  if (!user?.onboarded) throw new Error("Unauthorized");
  return user;
}

export async function createIdea({ text, author, communityId, path }: Params) {
  try {
    await connectToDB();

    const sessionUserId = await getSessionUserId();
    if (!sessionUserId) throw new Error("Unauthorized");

    const sessionUser = await User.findOne({ id: sessionUserId }).select("_id");
    if (!sessionUser || String(sessionUser._id) !== String(author)) {
      throw new Error("Unauthorized");
    }

    const createdIdea = await Idea.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { ideas: createdIdea._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating idea: ${error.message}`);
  }
}

function populateCard(query: any) {
  return query
    .populate({ path: "author", model: User, select: AUTHOR_FIELDS })
    .populate({
      path: "children",
      model: Idea,
      select: "_id author",
      populate: { path: "author", model: User, select: "_id id name image" },
    });
}

export async function fetchPosts(
  pageNumber = 1,
  pageSize = 20,
  sort: FeedSort = "new",
) {
  await connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;
  let posts: any[];

  if (sort === "hot") {
    // Score and sort inside MongoDB, then hydrate just the page of ids
    const ranked: { _id: unknown }[] = await Idea.aggregate([
      { $match: TOP_LEVEL },
      { $addFields: { hotScore: hotScoreExpression(new Date()) } },
      { $sort: { hotScore: -1, createdAt: -1 } },
      { $skip: skipAmount },
      { $limit: pageSize },
      { $project: { _id: 1 } },
    ]);
    const order = ranked.map((row) => String(row._id));
    const docs = await populateCard(Idea.find({ _id: { $in: order } })).exec();
    posts = docs.sort(
      (a: any, b: any) =>
        order.indexOf(String(a._id)) - order.indexOf(String(b._id)),
    );
  } else {
    const sortBy: Record<string, SortOrder> =
      sort === "top"
        ? { upvotes: "desc", createdAt: "desc" }
        : { createdAt: "desc" };
    posts = await populateCard(
      Idea.find(TOP_LEVEL).sort(sortBy).skip(skipAmount).limit(pageSize),
    ).exec();
  }

  const totalPostsCount = await Idea.countDocuments(TOP_LEVEL);
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

/** One idea with its replies and each reply's own reply count. */
export async function fetchIdeaById(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectToDB();

  return Idea.findById(id)
    .populate({ path: "author", model: User, select: AUTHOR_FIELDS })
    .populate({
      path: "children",
      model: Idea,
      options: { sort: { createdAt: 1 } },
      populate: [
        { path: "author", model: User, select: AUTHOR_FIELDS },
        {
          path: "children",
          model: Idea,
          select: "_id author",
          populate: {
            path: "author",
            model: User,
            select: "_id id name image",
          },
        },
      ],
    })
    .exec();
}

export async function addReply({
  parentId,
  text,
  path,
}: {
  parentId: string;
  text: string;
  path: string;
}) {
  try {
    const body = replyText.parse(text);
    await connectToDB();
    const me = await requireOnboardedUser();

    if (!isValidObjectId(parentId)) throw new Error("Idea not found");
    const parent = await Idea.findById(parentId).select("_id");
    if (!parent) throw new Error("Idea not found");

    // The author comes from the session, never from the client
    const reply = await Idea.create({
      text: body,
      author: me._id,
      parentID: String(parent._id),
    });

    await Idea.updateOne(
      { _id: parent._id },
      { $push: { children: reply._id } },
    );
    await User.updateOne({ _id: me._id }, { $push: { ideas: reply._id } });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding reply: ${error.message}`);
  }
}

/**
 * Idempotent upvote: `voted: true` adds the session user's vote, `false`
 * removes it. Retrying either call changes nothing, because the unique
 * (idea, user) index rejects a second insert and the counter only moves
 * when a Vote document was actually inserted or deleted.
 */
export async function setVote({
  ideaId,
  voted,
  path,
}: {
  ideaId: string;
  voted: boolean;
  path: string;
}): Promise<{ voted: boolean; upvotes: number }> {
  await connectToDB();
  const me = await requireOnboardedUser();

  if (!isValidObjectId(ideaId) || !(await Idea.exists({ _id: ideaId }))) {
    throw new Error("Idea not found");
  }

  // The unique index has to exist before it can stop a double vote
  await Vote.init();

  if (voted) {
    try {
      await Vote.create({ idea: ideaId, user: me._id });
      await Idea.updateOne({ _id: ideaId }, { $inc: { upvotes: 1 } });
    } catch (error: any) {
      if (error?.code !== 11000) throw error; // already voted: no-op
    }
  } else {
    const { deletedCount } = await Vote.deleteOne({
      idea: ideaId,
      user: me._id,
    });
    if (deletedCount) {
      await Idea.updateOne(
        { _id: ideaId, upvotes: { $gt: 0 } },
        { $inc: { upvotes: -1 } },
      );
    }
  }

  const idea = await Idea.findById(ideaId).select("upvotes");
  revalidatePath(path);
  return { voted, upvotes: idea?.upvotes ?? 0 };
}

/** Which of these ideas the session user has upvoted. */
export async function fetchVotedIdeaIds(ideaIds: string[]): Promise<string[]> {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId || ideaIds.length === 0) return [];

  await connectToDB();
  const me = await User.findOne({ id: sessionUserId }).select("_id");
  if (!me) return [];

  const votes = await Vote.find({ user: me._id, idea: { $in: ideaIds } })
    .select("idea")
    .lean<{ idea: unknown }[]>();
  return votes.map((vote) => String(vote.idea));
}

/** A profile tab: the author's top-level ideas or their replies, newest first. */
export async function fetchIdeasByAuthor(
  authorId: string,
  tab: "ideas" | "replies",
) {
  if (!isValidObjectId(authorId)) return [];
  await connectToDB();

  const filter =
    tab === "ideas"
      ? { author: authorId, ...TOP_LEVEL }
      : { author: authorId, parentID: { $ne: null } };

  return populateCard(
    Idea.find(filter).sort({ createdAt: "desc" }).limit(50),
  ).exec();
}

/** Case-insensitive substring search over idea text, top-level and replies. */
export async function searchIdeas(query: string, limit = 20) {
  const term = query.trim();
  if (term.length < 2) return [];
  await connectToDB();

  return populateCard(
    Idea.find({ text: { $regex: escapeRegExp(term), $options: "i" } })
      .sort({ upvotes: "desc", createdAt: "desc" })
      .limit(limit),
  ).exec();
}
