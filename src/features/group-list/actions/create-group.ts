"use server";

import { getCurrentUser } from "@/entities/user/server";
import { left } from "@/shared/lib/either";
import { createGroup } from "@/entities/group/services/create-group";

export const createGroupAction = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return left("user-not-found" as const);
  }

  return createGroup(null, user.id);
};
