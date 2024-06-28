"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import PocketBase from "pocketbase";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  comment: z.string().min(1, {
    message: "Comment must be at least 1 characters.",
  }),
});

export default function AARPage() {
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
      const pb_cookie: any = Cookies.get("pb_auth");
      pb.authStore.loadFromCookie(pb_cookie);

      if (!pb.authStore.model?.id) {
        throw new Error("User is not authenticated");
      }

      const userRecord = await pb
        .collection("users")
        .getOne(pb.authStore.model?.id, {
          expand: "branch,courses,roles",
        });

      console.log(userRecord);

      const user = {
        name: `${userRecord.rank} ${userRecord.last_name}, ${userRecord.first_name}`,
        id: userRecord.id,
        avatar: userRecord.avatar,
        branch: userRecord.branch,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/collections/after_action_reports/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            report: values.comment,
            user: user.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);

      // Show the thank you dialog
      setShowDialog(true);

      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input placeholder="This course was..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thank You</DialogTitle>
            <DialogDescription>
              Thank you for your feedback! Your comment has been submitted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
