import { Prisma } from "@prisma/client";

export interface QueryParams {
  where?: Prisma.UserWhereInput;
  page?: number;
  limit?: number;
  orderBy?: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>;
}
