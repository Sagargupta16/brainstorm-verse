import * as z from "zod";

export const userValidation = z.object({
  // An uploaded URL, a data: URL fresh from the file picker, or a path under
  // public/ (the seeded demo avatars)
  profile_photo: z
    .string()
    .nonempty()
    .refine((value) => /^\/(?!\/)/.test(value) || URL.canParse(value), {
      message: "Upload a profile photo",
    }),
  name: z.string().min(3).max(50),
  username: z.string().min(3).max(50),
  bio: z.string().min(3).max(1000),
});
