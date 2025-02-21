import { NextRequest } from "next/server";
import { getCurrentUser } from "@/entities/user/server";
import { getGroupById } from "@/entities/group/server";
import { sseStream } from "@/shared/lib/sse/server";
import {getMessages, messageEvents} from "@/entities/message/server";
import { groupEvents } from "@/entities/group/services/group-events";

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

  const unsubscribeGroupChanged = await groupEvents.addGroupChangedListener(
    async () => {
      write(await getMessages(group.id));
    },
  );

  const unsubscribeGroupCreated = await messageEvents.addMessageCreatedListener(
    group.id,
    async () => {
      write(await getMessages(group.id));
    },
  );

  addCloseListener(() => {
    unsubscribeGroupChanged();
    unsubscribeGroupCreated();
  });

  return response;
}
