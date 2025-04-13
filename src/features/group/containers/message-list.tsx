import { GroupDomain } from "@/entities/group";
import { DeleteMessageButton } from "@/features/group/containers/delete-message-button";
import { Badge } from "@/shared/ui/badge";
import { MessageCard } from "@/features/group/ui/message-card";
import { groupMessagesByDate } from "@/shared/lib/groupMessagesByDate";
import { memo, useMemo } from "react";

export const MessageList = memo(function MessageList({
  messages,
  userId,
  handleDelete,
  handleEditMessage,
}: {
  messages: GroupDomain.MessageEntity[];
  userId: string;
  handleDelete: (id: string) => void;
  handleEditMessage: (message: GroupDomain.MessageEntity) => void;
}) {
  const groupedMessages = useMemo(
    () => groupMessagesByDate(messages),
    [messages],
  );

  if (!messages.length) return null;

  return Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
    <div key={dateLabel} className="space-y-4">
      <div className="flex justify-center">
        <Badge className="text-xs sm:text-sm py-2 bg-muted text-white">
          {dateLabel}
        </Badge>
      </div>

      {msgs.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          userId={userId}
          onEdit={handleEditMessage}
          deleteAction={
            <DeleteMessageButton
              onSuccess={() => handleDelete(message.id)}
              messageId={message.id}
            />
          }
        />
      ))}
    </div>
  ));
});
