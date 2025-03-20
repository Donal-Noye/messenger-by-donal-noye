"use server";

import {addMember, getGroupById, groupEvents} from "@/entities/group/server";
import {left} from "@/shared/lib/either";

export const addMemberToGroupAction = async (
  groupId: string,
  userId: string,
) => {
  const addedMember = await addMember(groupId, userId);

  const updatedGroup = await getGroupById(groupId);
  if (!updatedGroup) {
    return left("Group not found" as const);
  }

  await groupEvents.emit({
    type: "group-changed",
    data: updatedGroup,
  });

  return addedMember
};
