"use client";

import { useGroupEditForm } from "@/features/group/model/use-group-edit-form";
import { GroupDomain } from "@/entities/group";
import { useSendMessageForm } from "@/features/group/model/use-send-message-form";
import { routes } from "@/kernel/routes";
import { useEventSource } from "@/shared/lib/sse/client";
import { TypingEvent, useTyping } from "@/features/group/model/use-typing";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

export function useGroupClient({
  defaultGroup,
  userId,
  initialMessages,
  initialMembers,
}: {
  defaultGroup: GroupDomain.GroupEntity;
  userId: string;
  initialMessages: GroupDomain.MessageEntity[];
  initialMembers: GroupDomain.MemberEntity[];
}) {
  const { dataStream: group = defaultGroup } =
    useEventSource<GroupDomain.GroupEntity>(
      useMemo(() => routes.groupStream(defaultGroup.id), [defaultGroup.id]),
    );

  const { dataStream: members = initialMembers, setData: setMembersData } =
    useEventSource<GroupDomain.MemberEntity[]>(
      useMemo(() => routes.membersStream(defaultGroup.id), [defaultGroup.id]),
    );

  const {
    dataStream: messages = initialMessages,
    setData: setMessagesData,
  } = useEventSource<GroupDomain.MessageEntity[]>(
    useMemo(() => routes.messageStream(defaultGroup.id), [defaultGroup.id]),
  );

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

  const handleDeleteMessage = useCallback(
    (deletedMessageId: string) => {
      setMessagesData((prev) => prev?.filter((m) => m.id !== deletedMessageId));
    },
    [setMessagesData],
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

  return {
    group,
    messages,
    form,
    formMessage,
    typingUsers,
    isSubmitting,
    isPending,
    onSubmit,
    onDelete,
    isDialogOpen,
    setIsDialogOpen,
    isPendingDelete,
    onSubmitMessage,
    editingMessage,
    setEditingMessage,
    handleDeleteMessage,
    handleEditMessage,
    messagesEndRef,
    members,
    setMembersData,
  };
}
