"use server";

import { getMessages } from "@/entities/message/services/get-messages";

export const getMessagesAction = async (groupId: string) => {
  return getMessages(groupId);
};
