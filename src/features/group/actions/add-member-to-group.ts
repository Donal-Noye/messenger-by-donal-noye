"use server";

import { addMember } from "@/entities/group/server";
import {right} from "@/shared/lib/either";

export const addMemberToGroupAction = async (
  groupId: string,
  userId: string,
) => {
  const addedMember = await addMember(groupId, userId);

  return right(addedMember)
};
