import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteGroupAction } from "@/features/group/actions/delete-group";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { routes } from "@/kernel/routes";
import { updateGroupAction } from "@/features/group/actions/update-group";
import { useActionState } from "@/shared/lib/react";
import { right } from "@/shared/lib/either";
import { GroupDomain } from "@/entities/group";

export const updateGroupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
});

type UpdateGroupFormSchema = z.infer<typeof updateGroupFormSchema>;

interface UseGroupEditFormParams {
  group: GroupDomain.GroupEntity;
  groupName: string;
}

export function useGroupEditForm({
  group,
  groupName,
}: UseGroupEditFormParams) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateGroupFormSchema>({
    resolver: zodResolver(updateGroupFormSchema),
    defaultValues: {
      name: groupName,
    },
  });

  useEffect(() => {
    form.reset({ name: group.name });
  }, [group.name, form]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatchUpdate, isPendingUpdate] = useActionState(
    async (_: any, values: UpdateGroupFormSchema) => {
      const result = await updateGroupAction(values.name, group.id);

      if (result.type === "right") {
        setIsDialogOpen(false);
        router.refresh();
      }
    },
    right(undefined),
  );

  const onSubmit = async (values: UpdateGroupFormSchema) => {
    startTransition(() => {
      dispatchUpdate(values);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, dispatchDelete, isPendingDelete] = useActionState(
    async () => {
      const result = await deleteGroupAction(group.id);

      if (result.type === "right") {
        setIsDialogOpen(false);
        router.push(routes.home());
      }
    },
    right(undefined),
  );

  const onDelete = async () => {
    startTransition(() => {
      dispatchDelete()
    })
  };

  return {
    form,
    isSubmitting: isPendingUpdate,
    isPendingDelete,
    onSubmit: form.handleSubmit(onSubmit),
    onDelete,
    isDialogOpen,
    setIsDialogOpen,
  };
}
