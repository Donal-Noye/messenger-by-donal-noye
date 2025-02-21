import { sessionService } from "@/entities/user/server";
import { userRepository } from "@/entities/user/repositories/user";

export const getCurrentUser = async () => {
  const { session } = await sessionService.verifySession();
  return userRepository.getUser({ id: session.id });
};
