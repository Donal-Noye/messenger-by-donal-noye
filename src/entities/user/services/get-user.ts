import {userRepository} from "@/entities/user/repositories/user";
import {right} from "@/shared/lib/either";

export const getUser = async (name: string) => {
  const user = await userRepository.getUser({ name });

	return right(user)
}