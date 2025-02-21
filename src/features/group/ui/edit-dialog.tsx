import { Button } from "@/shared/ui/button";
import { Ellipsis } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { updateGroupFormSchema } from "@/features/group/containers/group-client";
import { DeleteButton } from "@/features/group/ui/delete-button";
import { DialogLayout } from "@/shared/ui/dialog-layout";
import { SubmitButton } from "@/features/auth/ui/submit-button";

export function GroupEditDialog({
  onDeleteAction,
  onSubmitAction,
  form,
  isDialogOpen,
  isSubmitting,
  isPendingDelete,
  setIsDialogOpen,
}: {
  onDeleteAction: () => void;
  onSubmitAction: () => void;
  form?: UseFormReturn<z.infer<typeof updateGroupFormSchema>>;
  isDialogOpen: boolean;
  isSubmitting: boolean;
  isPendingDelete: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DialogLayout
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={
        <Button size="icon">
          <Ellipsis />
        </Button>
      }
      title="Edit group"
      description="Make changes to your group here. Click save when you're done."
      footer={
        <DeleteButton isPending={isPendingDelete} onConfirm={onDeleteAction} />
      }
    >
      {form && (
        <Form {...form}>
          <form onSubmit={onSubmitAction} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <SubmitButton
              disabled={!form.formState.isDirty}
              isPending={isSubmitting}
            >
              Save changes
            </SubmitButton>
          </form>
        </Form>
      )}
    </DialogLayout>
  );
}
