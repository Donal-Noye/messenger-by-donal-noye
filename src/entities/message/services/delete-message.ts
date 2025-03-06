import { right } from "@/shared/lib/either";
import { messageRepository } from "@/entities/message/repositories/message";
import { messageEvents } from "@/entities/message/server";

export async function deleteMessage(groupId: string, messageId: string) {
  const deletedMessage = await messageRepository.deleteMessage(messageId);

  await messageEvents.emit({
    type: "message-deleted",
    data: {
      groupId,
      messageId,
    },
  });

  return right(deletedMessage);
}
