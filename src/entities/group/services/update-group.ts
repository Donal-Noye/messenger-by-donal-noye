import { groupRepository } from "../repositories/group";
import { groupEvents } from "@/entities/group/server";
import { right } from "@/shared/lib/either";

export async function updateGroup(groupId: string, name: string) {
  const updatedGroup = await groupRepository.updateGroup(groupId, {
    name,
  });

  await groupEvents.emit({
    type: "group-changed",
    data: updatedGroup,
  });

  return right(updatedGroup);
}
