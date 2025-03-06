"use server";

import {getGroupById, groupEvents, updateGroup} from "@/entities/group/server";
import {left} from "@/shared/lib/either";

export const updateGroupAction = async (name: string, groupId: string) => {
  const updatedNameGroup = updateGroup(groupId, name);
  const updatedGroup = await getGroupById(groupId);

  if (!updatedGroup) {
    return left("Group not found" as const);
  }

  await groupEvents.emit({
    type: "group-changed",
    data: updatedGroup,
  });

  return updatedNameGroup;
};
