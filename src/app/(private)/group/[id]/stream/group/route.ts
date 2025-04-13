import {
  deleteGroupStream,
  getGroupStream,
  updateGroupStream,
} from "@/features/group/server";

export const GET = getGroupStream;
export const DELETE = deleteGroupStream;
export const PATCH = updateGroupStream;
