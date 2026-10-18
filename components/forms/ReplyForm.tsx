"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommentValidation } from "@/lib/validations/idea";
import { addReply } from "@/lib/actions/idea.action";

interface Props {
  ideaId: string;
  currentUserImg: string | null;
  // Set when the viewer cannot reply yet: link them there instead of a form
  redirectTo: string | null;
}

function ReplyForm({ ideaId, currentUserImg, redirectTo }: Props) {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: { idea: "" },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addReply({ parentId: ideaId, text: values.idea, path: pathname });
    form.reset();
  };

  if (redirectTo) {
    return (
      <div className="comment-form">
        <p className="flex-1 text-small-regular text-light-2">
          Sign in and finish your profile to join the thread.
        </p>
        <Link href={redirectTo} className="comment-form_btn text-center">
          {redirectTo === "/onboarding" ? "Finish profile" : "Sign in"}
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="idea"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              {currentUserImg && (
                <Image
                  src={currentUserImg}
                  alt="Your profile photo"
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              )}
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Reply to this idea..."
                  aria-label="Reply"
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="comment-form_btn"
        >
          {form.formState.isSubmitting ? "Replying..." : "Reply"}
        </Button>
      </form>
    </Form>
  );
}

export default ReplyForm;
