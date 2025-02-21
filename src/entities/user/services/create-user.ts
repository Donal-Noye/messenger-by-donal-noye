import { userRepository } from "@/entities/user/repositories/user";
import cuid from "cuid";
import { passwordService } from "@/entities/user/services/password";
import { left, right } from "@/shared/lib/either";

export const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const userWithEmail = await userRepository.getUser({ email });

  if (userWithEmail) {
    return left("user-email-exists");
  }

  const { hash, salt } = await passwordService.hashPassword(password);

	const user = await userRepository.saveUser({
    id: cuid(),
    name,
    email,
    passwordHash: hash,
    salt: salt,
  });

  return right(user);
};