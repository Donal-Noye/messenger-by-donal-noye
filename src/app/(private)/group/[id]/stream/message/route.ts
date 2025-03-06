import {
  deleteMessageStream,
  getMessagesStream,
  sendMessageStream,
} from "@/features/group/server";

export const GET = getMessagesStream;
export const POST = sendMessageStream;
export const DELETE = deleteMessageStream;
