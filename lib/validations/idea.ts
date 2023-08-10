import * as z from "zod";

export const IdeaValidation = z.object({
  idea: z.string().min(3, { message: "Minimum 3 characters" }).nonempty(),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  idea: z.string().min(3, { message: "Minimum 3 characters" }).nonempty(),
});
