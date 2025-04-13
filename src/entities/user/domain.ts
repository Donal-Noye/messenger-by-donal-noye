export type SessionEntity = {
	id: string;
	email: string;
	avatar?: string;
	isOnline?: boolean;
	status?: string;
	phone?: string;
	lastSeen?: Date;
	name: string;
	expiredAt: string;
}

export type UserEntity = {
	id: string;
	name: string;
	email: string;
	avatar?: string | null;
	isOnline?: boolean | null;
	status?: string | null;
	phone?: string | null;
	lastSeen?: Date;
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