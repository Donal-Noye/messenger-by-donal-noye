export type SessionEntity = {
	id: string;
	email: string;
	avatar?: string | null;
	isOnline?: boolean;
	status?: string | null;
	phone?: number | null;
	lastSeen?: Date | string;
	name: string;
	expiredAt: string;
}

export type UserEntity = {
	id: string;
	name: string;
	email: string;
	avatar?: string | null;
	isOnline?: boolean;
	status?: string | null;
	phone?: number | null;
	lastSeen?: Date | string;
	passwordHash: string;
	salt: string;
}

export const userToSession = (user: UserEntity, expiredAt: string): SessionEntity => {
  return {
		id: user.id,
	  email: user.email,
	  name: user.name,
	  expiredAt
  }
}