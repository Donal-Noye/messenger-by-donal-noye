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
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

async function getMessage(where: Prisma.MessageWhereInput) {
  return prisma.message.findFirst({
    where,
  });
}

async function updateMessage(
  messageId: string,
  content: string,
) {
  return prisma.message.update({
    where: { id: messageId },
    data: {
      content
    },
  });
}

async function deleteMessage(messageId: string) {
  return prisma.message.delete({
    where: { id: messageId },
  });
}

export const messageRepository = {
  sendMessage,
  getMessages,
  deleteMessage,
  getMessage,
  updateMessage,
};
