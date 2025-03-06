"use client";

import { GroupLayout } from "@/features/group/ui/layout";
import { GroupInfo } from "@/features/group/ui/info";
import { GroupAvatar } from "@/features/group/ui/avatar";
import { MessageInput } from "@/features/group/containers/message-input";
import { GroupEditDialog } from "@/features/group/ui/edit-dialog";
import { useGroupEditForm } from "@/features/group/model/use-group-edit-form";
import { GroupDomain } from "@/entities/group";
import { useSendMessageForm } from "@/features/group/model/use-send-message-form";
import { routes } from "@/kernel/routes";
import { useEventSource } from "@/shared/lib/sse/client";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { MessageCard } from "@/features/group/ui/message-card";
import { Typing } from "@/features/group/ui/typing";
import { TypingEvent, useTyping } from "@/features/group/model/use-typing";
import { DeleteMessageButton } from "@/features/group/containers/delete-message-button";
import { useCallback, useEffect, useState } from "react";

export function GroupClient({
  defaultGroup,
  userId,
  initialMessages,
}: {
  defaultGroup: GroupDomain.GroupEntity;
  userId: string;
  initialMessages: GroupDomain.MessageEntity[];
}) {
  const [group, setGroup] = useState(defaultGroup);
  const [messages, setMessages] = useState(initialMessages);

  // const { dataStream: group = defaultGroup } =
  //   useEventSource<GroupDomain.GroupEntity>(
  //     routes.groupStream(defaultGroup.id),
  //   );

  const { dataStream: sseData } = useEventSource<any>(routes.groupStream(defaultGroup.id));

  useEffect(() => {
    if (!sseData) return;

    switch (sseData.type) {
      case "group-changed":
        setGroup(sseData.data);
        break;
      case "message-deleted":
        setMessages(prev =>
          prev.filter(msg => msg.id !== sseData.data.messageId)
        );
        break;
      case "group-deleted":
        break;
    }
  }, [sseData]);

  const { dataStream: messageStream } = useEventSource<
    GroupDomain.MessageEntity[]
  >(routes.messageStream(defaultGroup.id));

  useEffect(() => {
    if (Array.isArray(messageStream)) {
      setMessages(messageStream);
    }
  }, [messageStream]);

  const handleDeleteSuccess = useCallback((deletedMessageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== deletedMessageId));
  }, []);

  const { typingUsers } = useTyping(
    useEventSource<TypingEvent>(routes.typingStream(defaultGroup.id)).dataStream!
  );

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
            <MessageCard
              deleteAction={
                <DeleteMessageButton
                  groupId={group.id}
                  onSuccess={() => handleDeleteSuccess(message.id)}
                  messageId={message.id}
                />
              }
              message={message}
              key={message.id}
              userId={userId}
            />
          ))}
          <Typing
            typingUsers={typingUsers}
            members={group.members}
            userId={userId}
          />
        </div>
      </ScrollArea>
    </GroupLayout>
  );
}
