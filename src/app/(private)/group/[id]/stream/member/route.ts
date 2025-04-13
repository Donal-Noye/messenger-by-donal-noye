import {
  getMembersStream,
  removeMemberStream,
  addMemberToGroupStream,
} from "@/features/group/server";

export const GET = getMembersStream;
export const POST = addMemberToGroupStream;
export const DELETE = removeMemberStream;
