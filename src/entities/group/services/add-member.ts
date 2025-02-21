import { prisma } from "@/shared/lib/db";
import { groupRepository } from "@/entities/group/repositories/group";
import { left, right } from "@/shared/lib/either";
import { getGroupById } from "@/entities/group/services/get-group";
import {groupEvents} from "@/entities/group/server";

export async function addMember(groupId: string, userId: string) {
  const group = await getGroupById(groupId);

  if (!group || !groupId) {
    return left("Group not found" as const);
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    return left("User not found" as const);
  }

  const existingMember = await prisma.groupMember.findFirst({
    where: {
      groupId,
      userId,
    },
  });

  if (existingMember) {
    return left("User already a member" as const);
  }

  const addedMember = await groupRepository.addMemberToGroup({
    group: {
      connect: { id: groupId },
    },
    user: {
      connect: { id: userId },
    },
    joinedAt: new Date(),
  });

  await groupEvents.emit({
    type: "member-added",
    data: {
      groupId,
      member: addedMember
    }
  });

  return right(addedMember);
}
