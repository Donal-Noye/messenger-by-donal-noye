"use server";

import { updateGroup } from "@/entities/group/server";

export const updateGroupAction = async (name: string, groupId: string) => {
  return updateGroup(groupId, name);
};
