import { prisma } from "@/shared/lib/db";
import { Prisma } from "@prisma/client";

async function groupList(userId: string) {
  return prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      creator: true,
      members: {
        include: {
          user: true,
        },
      },
      messages: {
	      include: {
		      user: true,
	      },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

async function getGroup(where: Prisma.GroupWhereUniqueInput) {
  return prisma.group.findUnique({
    where,
    include: {
      creator: true,
      members: {
        include: {
          user: true
        }
      },
      messages: {
        include: {
          user: true
        }
      }
    }
  });
}

async function createGroup(
  data: Prisma.GroupCreateInput,
) {
  const group = await prisma.group.create({
    data,
    include: {
      creator: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  return {
    ...group,
    members: group.members || [],
  };
}

async function updateGroup(
  groupId: string,
  data: Prisma.GroupUpdateInput,
) {
  return prisma.group.update({
    where: { id: groupId },
    data,
    include: {
      creator: true,
      messages: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

async function deleteGroup(groupId: string) {
  await prisma.message.deleteMany({
    where: { groupId },
  });

  await prisma.groupMember.deleteMany({
    where: { groupId },
  });

  await prisma.group.delete({
    where: { id: groupId },
  });
}

async function addMemberToGroup(
  data: Prisma.GroupMemberCreateInput,
) {
  return prisma.groupMember.create({
    data,
    include: {
      user: true,
    },
  });
}

async function getMembersByGroupId(
  groupId: string,
) {
  return prisma.groupMember.findMany({
    where: {
      groupId: groupId,
    },
    include: {
      user: true,
    },
  });
}

export const groupRepository = {
  groupList,
  getGroup,
  createGroup,
  deleteGroup,
  addMemberToGroup,
  updateGroup,
  getMembersByGroupId,
};
