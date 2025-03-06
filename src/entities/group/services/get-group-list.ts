import { groupRepository } from "@/entities/group/repositories/group";
import { GroupDomain } from "@/entities/group";

export async function getGroupList(userId: string): Promise<GroupDomain.GroupEntity[]> {
  return groupRepository.groupList(userId);
}
