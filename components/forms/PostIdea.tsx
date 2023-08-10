"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { usePathname, useRouter } from "next/navigation";

// import { updateUser  } from "@/lib/actions/user.action";
import { IdeaValidation } from "@/lib/validations/idea";
import { createIdea } from "@/lib/actions/idea.action";

interface props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostIdea({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(IdeaValidation),
    defaultValues: {
      idea: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof IdeaValidation>) => {
    await createIdea({
      text: values.idea,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="idea"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Idea
        </Button>
      </form>
    </Form>
  );
}

export default PostIdea;
