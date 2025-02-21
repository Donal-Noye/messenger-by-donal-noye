"use server";

import { sendMessageService } from "@/entities/message/server";
import { getCurrentUser } from "@/entities/user/services/get-current-user";
import { left } from "@/shared/lib/either";
import { getGroupById } from "@/entities/group/server";

export const sendMessageAction = async (
  userId: string,
  groupId: string,
  content: string,
) => {
  const user = await getCurrentUser();
  const group = await getGroupById(groupId);

  if (!user) {
    return left("user-not-found" as const);
  }

  if (!group) {
    return left("group-not-found" as const);
  }

  return sendMessageService(userId, groupId, content);
};
