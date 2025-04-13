import { getGroupMembers } from "@/entities/group/server";

export const getMembersAction = async (groupId: string) => {
  return getGroupMembers(groupId);
};
