"use server";

import {sessionService, updateUser} from "@/entities/user/server";
import { UserDomain } from "@/entities/user";

export const updateUserAction = async (
  session: UserDomain.SessionEntity,
  data: Partial<UserDomain.UserEntity>,
) => {
  const result = await updateUser(session.id, data);

  if (result.type === "right") {
    const updatedUser = result.value;

    await sessionService.updateSession({
      ...session,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  }

  return result;
};
