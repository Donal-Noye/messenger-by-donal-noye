"use server";

import {
  getGroupById,
  groupEvents,
  removeMember,
} from "@/entities/group/server";
import { left } from "@/shared/lib/either";

export const removeMemberAction = async (memberId: string, groupId: string) => {
  const removedMember = await removeMember(groupId, memberId);

  const updatedGroup = await getGroupById(groupId);
  if (!updatedGroup) {
    return left("Group not found" as const);
  }

  await groupEvents.emit({
    type: "group-changed",
    data: updatedGroup,
  });

  return removedMember;
};
