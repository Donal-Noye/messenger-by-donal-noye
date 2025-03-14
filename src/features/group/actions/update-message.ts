"use server";

import { left } from "@/shared/lib/either";
import {getMessageById, messageEvents, updateMessage} from "@/entities/message/server";

export const updateMessageAction = async (messageId: string, content: string) => {
  const updatedContent = updateMessage(messageId, content);
  const updatedMessage = await getMessageById(messageId);

  if (!updatedMessage) {
    return left("Message not found" as const);
  }

  await messageEvents.emit({
    type: "message-updated",
    data: { content },
  });

  return updatedContent;
};
