import { Prisma } from "@prisma/client";

export interface QueryParams {
	where?: Prisma.MessageWhereInput;
	page?: number;
	limit?: number;
	orderBy?: Prisma.Enumerable<Prisma.MessageOrderByWithRelationInput>;
}