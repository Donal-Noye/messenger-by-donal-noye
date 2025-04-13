import { NextRequest } from "next/server";
import { getGroupById } from "@/entities/group/services/get-group";
import { sseStream } from "@/shared/lib/sse/server";
import { messageEvents } from "@/entities/message/services/message-events";

export async function getTypingStream(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const group = await getGroupById(id);

  if (!group) {
    const { response } = sseStream(request);

    return response;
  }

  const { response, write, addCloseListener } = sseStream(request);

  const unwatchTyping = await messageEvents.addTypingListener(
    group.id,
    (event) => {
      write(event);
    },
  );

  addCloseListener(() => {
    unwatchTyping();
  });

  return response;
}
