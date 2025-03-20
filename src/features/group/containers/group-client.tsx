"use client";

import { GroupLayout } from "@/features/group/ui/layout";
import { GroupInfo } from "@/features/group/ui/info";
import { GroupAvatar } from "@/features/group/ui/avatar";
import { MessageInput } from "@/features/group/containers/message-input";
import { GroupEditDialog } from "@/features/group/containers/edit-dialog";
import { GroupDomain } from "@/entities/group";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Typing } from "@/features/group/ui/typing";
import { useGroupClient } from "@/features/group/model/use-group-client";
import { MessageList } from "@/features/group/containers/message-list";

export function GroupClient({
  defaultGroup,
  userId,
  initialMessages,
  members,
}: {
  defaultGroup: GroupDomain.GroupEntity;
  userId: string;
  initialMessages: GroupDomain.MessageEntity[];
  members: GroupDomain.MemberEntity[];
}) {
  const {
    group,
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
    handleDelete,
    handleEditMessage,
    messagesEndRef,
    messages,
  } = useGroupClient({ defaultGroup, userId, initialMessages });

  return (
    <GroupLayout
      info={<GroupInfo members={members} group={group} />}
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
          <MessageList
            messages={messages}
            userId={userId}
            handleEditMessage={handleEditMessage}
            handleDelete={handleDelete}
          />
          <Typing
            typingUsers={typingUsers}
            members={members}
            userId={userId}
          />
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
    </GroupLayout>
  );
}
