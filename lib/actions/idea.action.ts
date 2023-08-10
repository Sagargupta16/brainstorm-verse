"use server";

import { revalidatePath } from "next/cache";
import Idea from "../models/idea.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createIdea({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Idea.find({ parentID: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Idea.countDocuments({
    parentID: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}
