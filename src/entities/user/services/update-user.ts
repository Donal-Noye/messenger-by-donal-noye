import { userRepository } from "@/entities/user/repositories/user";
import { right } from "@/shared/lib/either";
import { UserDomain } from "../index";

export const updateUser = async (id: string, data: Partial<UserDomain.UserEntity>) => {
  const userById = await userRepository.getUser({ id });
  if (!userById) {
    throw new Error("User not found");
  }

  const sanitizedData = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(data).filter(([_, value]) => value !== null)
  );

  const updatedUser = await userRepository.updateUser(id, sanitizedData);
  return right(updatedUser);
};
