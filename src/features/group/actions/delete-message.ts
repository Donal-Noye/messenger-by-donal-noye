"use server";

import { left } from "@/shared/lib/either";
import {
  deleteMessage,
  getMessageById,
  messageEvents,
} from "@/entities/message/server";

export const deleteMessageAction = async (messageId: string) => {
  const message = await getMessageById(messageId);

  if (!message) {
    return left("message-not-found" as const);
  }

  await messageEvents.emit({
    type: "message-deleted",
    data: { messageId },
  });

  return deleteMessage(messageId);
};
