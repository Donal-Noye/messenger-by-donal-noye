import { prisma } from "@/shared/lib/db";
import { Prisma } from "@prisma/client";

async function sendMessage(data: Prisma.MessageCreateInput) {
  return prisma.message.create({
    data,
  });
}

async function getMessages(where: Prisma.MessageWhereInput) {
  return prisma.message.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export const messageRepository = {
  sendMessage,
  getMessages,
};
