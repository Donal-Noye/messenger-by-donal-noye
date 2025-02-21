import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {sendMessageAction} from "@/features/group/actions/send-message";
import {useActionState} from "@/shared/lib/react";
import { startTransition, useState } from "react";
import { GroupDomain } from "@/entities/group";

export const messageFormSchema = z.object({
  content: z.string().max(1000, { message: "Message is too long" }).nonempty(),
});

type MessageFormSchema = z.infer<typeof messageFormSchema>;

export function useSendMessageForm({
  userId,
  groupId,
}: {
  userId: string;
  groupId: string;
}) {
  const [localMessages, setLocalMessages] = useState<GroupDomain.MessageEntity[]>([])

  const form = useForm<MessageFormSchema>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      content: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch, isPending] = useActionState(
    async (_: any, content: string) => {
      const result = await sendMessageAction(userId, groupId, content);
      if (result.type === "right") {
        const newMessage = result.value;

        setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
        form.reset();
      }
    },
    null,
  );

  return {
    localMessages,
    formMessage: form,
    onSubmitMessage: form.handleSubmit((values) => {
      startTransition(() => {
        dispatch(values.content);
      });
    }),
    isPending
  };
}
