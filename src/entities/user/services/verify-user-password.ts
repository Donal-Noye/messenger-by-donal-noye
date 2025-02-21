import { userRepository } from "@/entities/user/repositories/user";
import { passwordService } from "@/entities/user/services/password";
import { left, right } from "@/shared/lib/either";

export async function verifyUserPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await userRepository.getUser({ email });

  if (!user) {
    return left("wrong-email-or-password" as const);
  }

  const isCompare = await passwordService.comparePassword({
    hash: user.passwordHash,
    salt: user.salt,
    password,
  });

  if (!isCompare) {
    return left("wrong-email-or-password" as const);
  }

  return right(user);
}
