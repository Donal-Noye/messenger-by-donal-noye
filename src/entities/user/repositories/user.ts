import { UserEntity } from "@/entities/user/domain";
import { prisma } from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { QueryParams } from "@/entities/user/types";

function saveUser(user: UserEntity): Promise<UserEntity> {
  const sanitizedUser = {
    ...user,
    isOnline: user.isOnline === null ? undefined : user.isOnline,
  };

  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: sanitizedUser,
    update: sanitizedUser,
  }) as Promise<UserEntity>;
}

function getUser(where: Prisma.UserWhereInput) {
  return prisma.user.findFirst({ where });
}

async function getAllUsers(params: QueryParams = {}): Promise<UserEntity[]> {
  const {
    page = 1,
    limit = 20,
    where = {},
    orderBy = { createdAt: "desc" },
  } = params;

  return prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy,
  }) as unknown as UserEntity[];
}

function updateUser(
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<UserEntity> {
  return prisma.user.update({
    where: { id },
    data,
  }) as Promise<UserEntity>;
}

export const userRepository = { saveUser, getUser, getAllUsers, updateUser };
