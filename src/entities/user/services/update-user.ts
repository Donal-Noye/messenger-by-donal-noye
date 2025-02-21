import { userRepository } from "@/entities/user/repositories/user";
import { right } from "@/shared/lib/either";
import { UserDomain } from "../index";

export const updateUser = async (id: string, data: Partial<UserDomain.UserEntity>) => {
  const userById = await userRepository.getUser({ id });

  if (!userById) {
    throw new Error("User not found");
  }

  const updatedUser = await userRepository.updateUser(id, data);

  return right(updatedUser);
};
