import {
  deleteMessageStream,
  getMessagesStream,
  sendMessageStream,
  updateMessageStream
} from "@/features/group/server";

export const GET = getMessagesStream;
export const POST = sendMessageStream;
export const PATCH = updateMessageStream;
export const DELETE = deleteMessageStream;
