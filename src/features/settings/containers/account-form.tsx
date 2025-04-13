import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SubmitButton } from "@/features/auth/ui/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { formSchema } from "@/features/settings/model/schema";
import { Input } from "@/shared/ui/input";

export function AccountForm({
  form,
  onSubmit,
  isPending,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}) {
  return (
    <>
      <h3 className="text-2xl font-medium text-primary mb-8">Account</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col md:grid md:grid-cols-[0.5fr_1fr] lg:grid-cols-2 md:items-center">
                <FormLabel className="text-secondary">Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    className="h-12"
                    placeholder="Your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col md:grid md:grid-cols-[0.5fr_1fr] lg:grid-cols-2 md:items-center">
                <FormLabel className="text-secondary">Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="email"
                    className="h-12"
                    placeholder="Your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col md:grid md:grid-cols-[0.5fr_1fr] lg:grid-cols-2 md:items-center">
                <FormLabel className="text-secondary">Phone</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    className="h-12"
                    placeholder="Your phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col md:grid md:grid-cols-[0.5fr_1fr] lg:grid-cols-2 md:items-center">
                <FormLabel className="text-secondary">Status</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    className="h-12"
                    placeholder="Your status"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            className="w-auto"
            isPending={isPending}
            disabled={!form.formState.isDirty}
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </>
  );
}
