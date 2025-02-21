import { messageRepository } from "@/entities/message/repositories/message";
import { messageEvents } from "@/entities/message/server";
import {left, right} from "@/shared/lib/either";
import { groupRepository } from "@/entities/group/repositories/group";
import {groupEvents} from "@/entities/group/services/group-events";
import {getGroupById} from "@/entities/group/services/get-group";

export const sendMessageService = async (
  userId: string,
  groupId: string,
  content: string,
) => {
  const updatedGroup = await getGroupById(groupId);

  if (!updatedGroup) {
    return left("Group not found");
  }

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

  await groupRepository.updateGroup(
    groupId,
    { lastMessageAt: new Date() },
  );

  await messageEvents.emit({
    type: "message-created",
    data: newMessage,
  });

  await groupEvents.emit({
    type: "group-changed",
    data: updatedGroup,
  });

  return right(newMessage);
};
