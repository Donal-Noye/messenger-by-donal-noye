"use client";

import { GroupLayout } from "@/features/group/ui/layout";
import { GroupInfo } from "@/features/group/ui/info";
import { GroupAvatar } from "@/features/group/ui/avatar";
import { MessageInput } from "@/features/group/containers/message-input";
import { GroupEditDialog } from "@/features/group/ui/edit-dialog";
import { z } from "zod";
import { useGroupEditForm } from "@/features/group/model/use-group-edit-form";
import { GroupDomain } from "@/entities/group";
import { useSendMessageForm } from "@/features/group/model/use-send-message-form";
import { routes } from "@/kernel/routes";
import { useEventSource } from "@/shared/lib/sse/client";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { MessageCard } from "@/features/group/ui/message-card";
import { useEffect, useState } from "react";

export const updateGroupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export function GroupClient({
  defaultGroup,
  userId,
  initialMessages,
}: {
  defaultGroup: GroupDomain.GroupEntity;
  userId: string;
  initialMessages: GroupDomain.MessageEntity[];
}) {
  const { dataStream: group = defaultGroup } =
    useEventSource<GroupDomain.GroupEntity>(
      routes.groupStream(defaultGroup.id),
    );

  const { dataStream: messages = initialMessages } = useEventSource<
    GroupDomain.MessageEntity[]
  >(routes.messageStream(defaultGroup.id));

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const { dataStream: typingEvents } = useEventSource<{
    type: "typing";
    data: { userId: string; isTyping: boolean };
  }>(routes.typingStream(defaultGroup.id));

  useEffect(() => {
    if (typingEvents?.type === "typing") {
      setTypingUsers((prev) => {
        const updatedUsers = {
          ...prev,
          [typingEvents.data.userId]: typingEvents.data.isTyping,
        };

        if (!typingEvents.data.isTyping) {
          setTypingUsers((prev) => {
            const newState = { ...prev };
            delete newState[typingEvents.data.userId];
            return newState;
          });
        }

        return updatedUsers;
      });
    }
  }, [typingEvents]);

  const {
    form,
    isSubmitting,
    onSubmit,
    onDelete,
    isDialogOpen,
    setIsDialogOpen,
    isPendingDelete,
  } = useGroupEditForm({
    group,
    groupName: group?.name ?? "",
  });

  const { formMessage, onSubmitMessage, isPending } = useSendMessageForm({
    groupId: group.id,
    userId,
  });

  return (
    <GroupLayout
      info={<GroupInfo members={group.members} group={group} />}
      actions={
        group.creatorId === userId && (
          <GroupEditDialog
            onDeleteAction={onDelete}
            onSubmitAction={onSubmit}
            form={form}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            isSubmitting={isSubmitting}
            isPendingDelete={isPendingDelete}
          />
        )
      }
      avatar={<GroupAvatar name={group.name} />}
      messageInput={
        <MessageInput
          onSubmitAction={onSubmitMessage}
          form={formMessage}
          isPending={isPending}
          groupId={group.id}
          userId={userId}
        />
      }
    >
      <ScrollArea autoScroll>
        <div className="flex flex-col space-y-5 justify-end h-full p-6">
          {messages.map((message) => (
            <MessageCard message={message} key={message.id} userId={userId} />
          ))}
          {Object.keys(typingUsers).filter((id) => id !== userId).length > 0 && (
            <div className="text-sm text-secondary animate-pulse">
              {Object.keys(typingUsers)
                .filter((id) => id !== userId)
                .map((id) => {
                  const member = group.members.find((m) => m.userId === id);
                  return member?.user?.name || "Unknown user";
                })
                .filter(Boolean)
                .join(", ")}{" "}
              is typing...
            </div>
          )}
        </div>
      </ScrollArea>
    </GroupLayout>
  );
}
