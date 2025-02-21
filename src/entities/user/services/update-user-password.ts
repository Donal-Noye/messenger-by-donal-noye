import { userRepository } from "@/entities/user/repositories/user";
import { passwordService } from "./password";
import { sessionService } from "./session";
import {left, right} from "@/shared/lib/either";

export async function updateUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await userRepository.getUser({ id });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await passwordService.comparePassword({
    password: currentPassword,
    hash: user.passwordHash,
    salt: user.salt,
  });

  if (!isValid) {
    return left("Current password is incorrect" as const);
  }

  const { hash, salt } =
    await passwordService.hashPassword(newPassword);

  await userRepository.updateUser(id, {
    passwordHash: hash,
    salt: salt,
  });

  await sessionService.updateSession({
    ...user,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: user.avatar ?? undefined,
  });

  return right(user)
}
