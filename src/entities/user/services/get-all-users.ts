import { userRepository } from "@/entities/user/repositories/user";
import { UserDomain } from "@/entities/user";

export const getAllUsers = async ({
  page = 1,
  limit = 20,
  searchTerm = "",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  const users = await userRepository.getAllUsers({
    page,
    limit,
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive"
      }
    },
  });

  return users as UserDomain.UserEntity[];
};
