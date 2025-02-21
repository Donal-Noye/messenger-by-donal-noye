import { userRepository } from "@/entities/user/repositories/user";
import { right } from "@/shared/lib/either";
import { userEvents } from "@/entities/user/server";

export async function updateOnlineStatus(userId: string, isOnline: boolean) {
  const updatedUser = await userRepository.updateUser(userId, {
    isOnline,
    lastSeen: new Date(),
  });

  await userEvents.emit({
    type: "user-online",
    data: updatedUser,
  });

  return right(updatedUser);
}
