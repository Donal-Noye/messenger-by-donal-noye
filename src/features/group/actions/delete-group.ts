"use server";

import {deleteGroup, getGroupById, groupEvents} from "@/entities/group/server";
import { left } from "@/shared/lib/either";

export const deleteGroupAction = async (groupId: string) => {
  const group = await getGroupById(groupId);

  if (!group) {
    return left("group-not-found" as const);
  }

  await groupEvents.emit({
    type: "group-deleted",
    data: {
      groupId,
    },
  });

  return deleteGroup(groupId);
};
