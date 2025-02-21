"use server";

import {updateUserPassword} from "@/entities/user/server";
import {right} from "@/shared/lib/either";

export const updatePasswordAction = async (
	id: string,
	currentPassword: string,
	newPassword: string
) => {
	const updatedPassword = await updateUserPassword(id, currentPassword, newPassword);

	return right(updatedPassword);
};
