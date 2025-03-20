import { UserDomain } from "../user";

export type GroupEntity = {
	id: string;
	name: string;
	creatorId: string;
	creator: UserDomain.UserEntity;
	// members: MemberEntity[];
};

export type MemberEntity = {
	id: string;
	userId: string;
	groupId: string;
	joinedAt: Date;
	user: UserDomain.UserEntity;
}

export type MessageEntity = {
	id: string;
	content: string;
	userId: string;
	groupId: string;
	user?: UserDomain.UserEntity;
	createdAt: Date;
};

