import { groupRepository } from "@/entities/group/repositories/group";
import { GroupDomain } from "@/entities/group";

export async function getGroupList(userId: string): Promise<GroupDomain.GroupEntity[]> {
  const groups = await groupRepository.groupList(userId);

  return groups as GroupDomain.GroupEntity[];
}
