import { userRepository } from "@/entities/user/repositories/user";
import { UserDomain } from "@/entities/user";

export const getAllUsers = async () => {
  const users = await userRepository.getAllUsers();

  return users as UserDomain.UserEntity[];
};
