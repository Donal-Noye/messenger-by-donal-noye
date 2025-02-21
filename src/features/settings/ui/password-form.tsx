import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { SubmitButton } from "@/features/auth/ui/submit-button";
import { passwordSchema } from "@/features/settings/model/schema";
import { Input } from "@/shared/ui/input";

export function PasswordForm({
  form,
  onSubmit,
  isPending,
}: {
  form: UseFormReturn<z.infer<typeof passwordSchema>>;
  onSubmit: (values: z.infer<typeof passwordSchema>) => void;
  isPending: boolean;
}) {
  return (
    <>
      <h3 className="text-2xl font-medium text-primary mb-8">Password</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 items-center">
                <FormLabel className="text-secondary">
                  Current Password
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    className="h-12"
                    placeholder="Enter current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 items-center">
                <FormLabel className="text-secondary">New Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    className="h-12"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 items-center">
                <FormLabel className="text-secondary">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="password"
                    className="h-12"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton isPending={isPending} className="w-auto">
            Update Password
          </SubmitButton>
        </form>
      </Form>
    </>
  );
}
