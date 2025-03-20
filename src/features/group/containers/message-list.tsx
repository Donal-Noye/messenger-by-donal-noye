import { GroupDomain } from "@/entities/group";
import {DeleteMessageButton} from "@/features/group/containers/delete-message-button";
import {Badge} from "@/shared/ui/badge";
import {MessageCard} from "@/features/group/ui/message-card";
import {groupMessagesByDate} from "@/shared/lib/groupMessagesByDate";

export function MessageList({
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
  if (!messages.length) {
    return null;
  }
  console.log("Messages:", messages);

  const groupedMessages = groupMessagesByDate(messages);

  return Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
      <div key={dateLabel} className="space-y-3">
        <div className="flex justify-center">
          <Badge className="py-2 bg-muted text-white">{dateLabel}</Badge>
        </div>

        {msgs.map((message: GroupDomain.MessageEntity) => (
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
    ))

}
