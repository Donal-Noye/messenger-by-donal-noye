import { groupRepository } from "@/entities/group/repositories/group";

export async function getGroupById(groupId: string) {
  return groupRepository.getGroup({ id: groupId });
}
