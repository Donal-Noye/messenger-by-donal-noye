import { messageRepository } from "@/entities/message/repositories/message";

export const getMessageById = async (messageId: string) => {
  return messageRepository.getMessage({ id: messageId });
};
