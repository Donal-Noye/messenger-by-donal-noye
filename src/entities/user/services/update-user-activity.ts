import {userRepository} from "@/entities/user/repositories/user";

export const updateUserActivity = async (userId: string) => {
	return userRepository.updateUser(userId, {
		lastSeen: new Date(),
	});
};