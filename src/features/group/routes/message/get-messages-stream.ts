import { NextRequest } from "next/server";
import { getCurrentUser } from "@/entities/user/server";
import { getGroupById } from "@/entities/group/server";
import { sseStream } from "@/shared/lib/sse/server";
import { getMessages, messageEvents } from "@/entities/message/server";

export async function getMessagesStream(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  const group = await getGroupById(id);

  if (!user || !group?.id) {
    return new Response(`Group not found`, {
      status: 404,
    });
  }

  const { response, write, addCloseListener } = sseStream(req);

  write(await getMessages(group.id));

  const unsubscribeMessageChanged = await messageEvents.addMessageUpdatedListener(
    group.id,
    async () => {
      write(await getMessages(group.id));
    },
  );

  const unsubscribeMessageCreated = await messageEvents.addMessageCreatedListener(
    group.id,
    async () => {
      write(await getMessages(group.id));
    },
  );

  const unwatchDeleteMessage = await messageEvents.addMessageDeletedListener(
    async () => {
      write(await getMessages(group.id));
    },
  );

  addCloseListener(() => {
    unsubscribeMessageChanged();
    unsubscribeMessageCreated();
    unwatchDeleteMessage()
  });

  return response;
}