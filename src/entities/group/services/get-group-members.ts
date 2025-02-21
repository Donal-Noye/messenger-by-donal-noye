import { groupRepository } from "@/entities/group/repositories/group";

export const getGroupMembers = async (groupId: string) => {
  return groupRepository.getMembersByGroupId(groupId);
};
