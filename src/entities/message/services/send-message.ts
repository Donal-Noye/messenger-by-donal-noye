import { messageRepository } from "@/entities/message/repositories/message";
import { messageEvents } from "@/entities/message/server";
import { right } from "@/shared/lib/either";

export const sendMessageService = async (
  userId: string,
  groupId: string,
  content: string,
) => {
  await messageEvents.emit({
    type: "typing",
    data: { userId, groupId, isTyping: false },
  });

  const newMessage = await messageRepository.sendMessage({
    user: {
      connect: {
        id: userId,
      },
    },
    group: {
      connect: {
        id: groupId,
      },
    },
    content,
  });

  // await groupRepository.updateGroup(groupId, { lastMessageAt: new Date() });

  await messageEvents.emit({
    type: "message-created",
    data: newMessage,
  });

  return right(newMessage);
};
