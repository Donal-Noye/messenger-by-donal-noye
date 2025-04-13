import { userRepository } from "@/entities/user/repositories/user";
import { right } from "@/shared/lib/either";
import { userEvents } from "@/entities/user/server";

export async function updateOnlineStatus(userId: string, isOnline: boolean) {
  const updatedUser = await userRepository.updateUser(userId, {
    isOnline,
  });

  await userEvents.emit({
    type: "user-online",
    data: {
      userId: updatedUser.id,
      isOnline,
    }
  });

  return right(updatedUser);
}
