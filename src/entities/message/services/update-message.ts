import { right } from "@/shared/lib/either";
import { messageRepository } from "@/entities/message/repositories/message";
import { messageEvents } from "@/entities/message/server";

export async function updateMessage(messageId: string, content: string) {
  const updatedMessage = await messageRepository.updateMessage(
    messageId,
    content,
  );

  await messageEvents.emit({
    type: "message-updated",
    data: { content },
  });

  return right(updatedMessage);
}
