import { groupRepository } from "@/entities/group/repositories/group";
import { cache } from "react";

export const getGroupById = cache(async (groupId: string) => {
  return groupRepository.getGroup({ id: groupId });
});
