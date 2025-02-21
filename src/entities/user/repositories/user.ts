import { UserEntity } from "@/entities/user/domain";
import { prisma } from "@/shared/lib/db";
import { Prisma } from "@prisma/client";

function saveUser(user: UserEntity): Promise<UserEntity> {
  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: user,
    update: user,
  }) as Promise<UserEntity>;
}

function getUser(where: Prisma.UserWhereInput) {
  return prisma.user.findFirst({ where });
}

function getAllUsers(): Promise<UserEntity[]> {
  return prisma.user.findMany() as Promise<UserEntity[]>;
}

function updateUser(id: string, data: Prisma.UserUpdateInput): Promise<UserEntity> {
  return prisma.user.update({
    where: { id },
    data,
  }) as Promise<UserEntity>;
}

export const userRepository = { saveUser, getUser, getAllUsers, updateUser };
