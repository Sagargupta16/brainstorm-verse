"use server";

import { isValidObjectId, Types } from "mongoose";
import { connectToDB } from "../mongoose";
import Idea from "../models/idea.model";
import User from "../models/user.model";
import Vote from "../models/vote.model";
import { revalidatePath } from "next/cache";
import { getSessionUserId } from "../session";
import { escapeRegExp } from "../utils";

interface Params {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: Params): Promise<void> {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId || sessionUserId !== userId) {
    throw new Error("Unauthorized");
  }

  await connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: "Community",
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

/** Profile header numbers: top-level ideas, replies, and upvotes received. */
export async function fetchUserStats(userObjectId: string) {
  if (!isValidObjectId(userObjectId)) {
    return { ideas: 0, replies: 0, upvotes: 0 };
  }
  await connectToDB();

  const [row] = await Idea.aggregate([
    {
      $match: {
        author: new Types.ObjectId(userObjectId),
      },
    },
    {
      $group: {
        _id: null,
        ideas: { $sum: { $cond: [{ $ifNull: ["$parentID", false] }, 0, 1] } },
        replies: { $sum: { $cond: [{ $ifNull: ["$parentID", false] }, 1, 0] } },
        upvotes: { $sum: { $ifNull: ["$upvotes", 0] } },
      },
    },
  ]);

  return {
    ideas: row?.ideas ?? 0,
    replies: row?.replies ?? 0,
    upvotes: row?.upvotes ?? 0,
  };
}

/** Name or username contains the query, case-insensitive. */
export async function searchUsers(query: string, limit = 20) {
  const term = query.trim();
  if (term.length < 2) return [];
  await connectToDB();

  const pattern = { $regex: escapeRegExp(term), $options: "i" };
  return User.find({
    onboarded: true,
    $or: [{ name: pattern }, { username: pattern }],
  })
    .select("_id id name username image")
    .limit(limit)
    .lean();
}

/** The authors whose ideas have collected the most upvotes. */
export async function fetchTopContributors(limit = 4) {
  await connectToDB();

  return Idea.aggregate([
    {
      $group: {
        _id: "$author",
        upvotes: { $sum: { $ifNull: ["$upvotes", 0] } },
      },
    },
    { $match: { upvotes: { $gt: 0 } } },
    { $sort: { upvotes: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: User.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        upvotes: 1,
        id: "$user.id",
        name: "$user.name",
        username: "$user.username",
        image: "$user.image",
      },
    },
  ]);
}

export interface ActivityItem {
  kind: "reply" | "upvote";
  key: string;
  createdAt: Date;
  actor: { id: string; name: string; image: string };
  ideaId: string;
  text: string;
}

/** Replies to, and upvotes on, the session user's ideas by other people. */
export async function fetchActivity(limit = 30): Promise<ActivityItem[]> {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) return [];

  await connectToDB();
  const me = await User.findOne({ id: sessionUserId }).select("_id");
  if (!me) return [];

  const mine = await Idea.find({ author: me._id })
    .select("_id text")
    .lean<{ _id: unknown; text: string }[]>();
  if (mine.length === 0) return [];
  const myIds = mine.map((idea) => String(idea._id));
  const textById = new Map(mine.map((idea) => [String(idea._id), idea.text]));

  const [replies, votes] = await Promise.all([
    Idea.find({ parentID: { $in: myIds }, author: { $ne: me._id } })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .populate({ path: "author", model: User, select: "id name image" })
      .lean<any[]>(),
    Vote.find({ idea: { $in: myIds }, user: { $ne: me._id } })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .populate({ path: "user", model: User, select: "id name image" })
      .lean<any[]>(),
  ]);

  const items: ActivityItem[] = [
    ...replies
      .filter((reply) => reply.author)
      .map((reply) => ({
        kind: "reply" as const,
        key: `reply-${reply._id}`,
        createdAt: reply.createdAt,
        actor: reply.author,
        ideaId: String(reply.parentID),
        text: reply.text,
      })),
    ...votes
      .filter((vote) => vote.user)
      .map((vote) => ({
        kind: "upvote" as const,
        key: `vote-${vote._id}`,
        createdAt: vote.createdAt,
        actor: vote.user,
        ideaId: String(vote.idea),
        text: textById.get(String(vote.idea)) ?? "",
      })),
  ];

  return items
    .toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}
