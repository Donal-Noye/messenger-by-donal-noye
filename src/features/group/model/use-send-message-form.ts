import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessageAction } from "@/features/group/actions/send-message";
import { useActionState } from "@/shared/lib/react";
import {startTransition} from "react";
import { updateMessageAction } from "@/features/group/actions/update-message";

export const messageFormSchema = z.object({
  content: z.string().max(1000, { message: "Message is too long" }).nonempty(),
});

type MessageFormSchema = z.infer<typeof messageFormSchema>;

export function useSendMessageForm({
  userId,
  groupId,
  editingMessage,
  onEditComplete,
}: {
  userId: string;
  groupId: string;
  editingMessage?: { id: string; content: string } | null;
  onEditComplete: () => void;
}) {
  const form = useForm<MessageFormSchema>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: editingMessage ? editingMessage.content : "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch, isPending] = useActionState(
    async (_: any, content: string) => {
      let result;
      if (editingMessage) {
        result = await updateMessageAction(editingMessage.id, content);
      } else {
        result = await sendMessageAction(userId, groupId, content);
      }
      if (result.type === "right") {
        form.reset();
        onEditComplete?.();
        form.setFocus("content")
      }
    },
    null,
  );

  return {
    formMessage: form,
    onSubmitMessage: form.handleSubmit((values) => {
      startTransition(() => {
        dispatch(values.content);
      });
    }),
    isPending,
  };
}
