import { groupRepository } from "@/entities/group/repositories/group";
import { right } from "@/shared/lib/either";
import { groupEvents } from "@/entities/group/services/group-events";

export async function deleteGroup(groupId: string) {
  const deletedGroup = await groupRepository.deleteGroup(groupId);

  await groupEvents.emit({
    type: "group-deleted",
    data: {
      groupId,
    },
  });

  return right(deletedGroup);
}
