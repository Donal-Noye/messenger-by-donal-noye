import { groupRepository } from "@/entities/group/repositories/group";
import { groupEvents } from "@/entities/group/services/group-events";
import { left, right } from "@/shared/lib/either";

export const removeMember = async (groupId: string, memberId: string) => {
  const removedMember = await groupRepository.removeMemberInGroup(memberId);

  if (!removedMember) {
    return left("Member not found" as const);
  }

  await groupEvents.emit({
    type: "member-removed",
    data: {
      groupId,
      memberId,
    },
  });

  return right(removedMember);
};
