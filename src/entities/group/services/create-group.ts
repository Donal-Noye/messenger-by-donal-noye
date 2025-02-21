import { groupRepository } from "@/entities/group/repositories/group";
import { right } from "@/shared/lib/either";
import { groupEvents } from "./group-events";

export async function createGroup(name: string | null, creatorId: string) {
  const groupName = name || "Group";

  const createdGroup = await groupRepository.createGroup({
    name: groupName,
    lastMessageAt: new Date(),
    creator: {
      connect: { id: creatorId },
    },
    members: {
      create: {
        user: { connect: { id: creatorId } },
        joinedAt: new Date(),
      },
    },
  });

  await groupEvents.emit({
    type: "group-created",
  });

  return right(createdGroup);
}
