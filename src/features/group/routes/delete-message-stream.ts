import { getCurrentUser } from "@/entities/user/server";
import { NextRequest } from "next/server";
import { sseStream } from "@/shared/lib/sse/server";
import {deleteMessage, getMessageById, messageEvents} from "@/entities/message/server";
import {getGroupById, groupEvents} from "@/entities/group/server";

export async function deleteMessageStream(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  const { id } = params;
  const { id: messageId } = await req.json();

  if (!user) {
    return new Response(`User not found`, { status: 404 });
  }

  const group = await getGroupById(id);
  const message = await getMessageById(messageId);

  if (!group || !message) {
    return new Response(`Group not found or permission denied`, {
      status: 403,
    });
  }

  const { write, response } = sseStream(req);

  write({ type: "message-deleted", messageId: message.id });

  await messageEvents.emit({
    type: "message-deleted",
    data: {
      messageId
    },
  });

  await deleteMessage(group.id, message.id);

  return response;
}
