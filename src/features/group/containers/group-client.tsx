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
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { groupMessagesByDate } from "@/shared/lib/groupMessagesByDate";
import { Badge } from "@/shared/ui/badge";

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

  const { dataStream: messages = initialMessages, setData } = useEventSource<
    GroupDomain.MessageEntity[]
  >(routes.messageStream(defaultGroup.id));

  const [editingMessage, setEditingMessage] = useState<{
    id: string;
    content: string;
  } | null>(null);

  const handleEditMessage = useCallback(
    (message: GroupDomain.MessageEntity) => {
      setEditingMessage({ id: message.id, content: message.content });
    },
    [],
  );

  const handleDelete = useCallback(
    (deletedMessageId: string) => {
      setData((prev) => prev?.filter((m) => m.id !== deletedMessageId));
    },
    [setData],
  );

  const { typingUsers } = useTyping(
    useEventSource<TypingEvent>(routes.typingStream(defaultGroup.id))
      .dataStream!,
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
    editingMessage,
    onEditComplete: () => setEditingMessage(null),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

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
          key={editingMessage?.id || "new-message"}
          onSubmitAction={onSubmitMessage}
          form={formMessage}
          isPending={isPending}
          groupId={group.id}
          userId={userId}
          editingMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
        />
      }
    >
      <ScrollArea autoScroll className="h-full">
        <div className="flex flex-col space-y-5 justify-end h-full p-6">
          {Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
            <div key={dateLabel} className="space-y-3">
              <div className="flex justify-center">
                <Badge className="py-2 bg-muted text-white">{dateLabel}</Badge>
              </div>

              {msgs.map((message) => (
                <MessageCard
                  deleteAction={
                    <DeleteMessageButton
                      onSuccess={() => handleDelete(message.id)}
                      messageId={message.id}
                    />
                  }
                  message={message}
                  key={message.id}
                  userId={userId}
                  onEdit={handleEditMessage}
                />
              ))}
            </div>
          ))}
          <Typing
            typingUsers={typingUsers}
            members={group.members}
            userId={userId}
          />
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
    </GroupLayout>
  );
}
