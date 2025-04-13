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
import { Button } from "@/shared/ui/button";
import { ArrowLeft } from "lucide-react";
import { routes } from "@/kernel/routes";
import { useRouter } from "next/navigation";
import {memo} from "react";

export const GroupClient = memo(function GroupClient({
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
  const router = useRouter();
  const group = useGroupClient({
    defaultGroup,
    userId,
    initialMessages,
    initialMembers,
  });

  return (
    <GroupLayout
      info={
        <GroupInfo
          userId={userId}
          members={group.members}
          group={group.group}
          setMembersData={group.setMembersData}
        />
      }
      actions={
        group.group.creatorId === userId && (
          <GroupEditDialog
            onDeleteAction={group.onDelete}
            onSubmitAction={group.onSubmit}
            form={group.form}
            isDialogOpen={group.isDialogOpen}
            setIsDialogOpen={group.setIsDialogOpen}
            isSubmitting={group.isSubmitting}
            isPendingDelete={group.isPendingDelete}
          />
        )
      }
      back={
        <Button size="icon" onClick={() => router.push(routes.home())}>
          <ArrowLeft />
        </Button>
      }
      avatar={<GroupAvatar name={group.group.name} />}
      messageInput={
        <MessageInput
          key={group.editingMessage?.id || "new-message"}
          onSubmitAction={group.onSubmitMessage}
          form={group.formMessage}
          isPending={group.isPending}
          groupId={group.group.id}
          userId={userId}
          editingMessage={group.editingMessage}
          onCancelEdit={() => group.setEditingMessage(null)}
        />
      }
    >
      <ScrollArea autoScroll className="h-full">
        <div className="flex flex-col space-y-5 h-full p-6 overflow-auto">
          <MessageList
            messages={group.messages}
            userId={userId}
            handleEditMessage={group.handleEditMessage}
            handleDelete={group.handleDeleteMessage}
          />
          <Typing
            typingUsers={group.typingUsers}
            members={group.members}
            userId={userId}
          />
        </div>
        <div ref={group.messagesEndRef} />
      </ScrollArea>
    </GroupLayout>
  );
})
