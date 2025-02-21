import { messageRepository } from "@/entities/message/repositories/message";

export const getMessages = async (groupId: string) => {
  return messageRepository.getMessages({
    groupId,
  });
};
