import { NextRequest } from "next/server";
import { sseStream } from "@/shared/lib/sse/server";
import { getGroupById, groupEvents } from "@/entities/group/server";
import { messageEvents } from "@/entities/message/server";

export async function getGroupStream(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const group = await getGroupById(id);

    if (!group) {
      const { response } = sseStream(req);

      return response;
    }

    const { addCloseListener, write, response } = sseStream(req);

    write(group);

    const unwatchChange = await groupEvents.addGroupChangedListener((event) =>
      write(event.data),
    );

    const unwatchMember = await groupEvents.addMemberAddedListener(
      group.id,
      (event) => write(event.data),
    );

    const unwatchDelete = await groupEvents.addGroupDeletedListener(
      ({ data }) => {
        if (data.groupId === group.id) {
          write({ type: "group-deleted", data });
        }
      },
    );

    const unwatchDeleteMessage = await messageEvents.addMessageDeletedListener(
      ({ data }) => {
        write({ type: "message-deleted", data });
      },
    );

    addCloseListener(() => {
      unwatchChange();
      unwatchMember();
      unwatchDelete();
      unwatchDeleteMessage();
    });

    return response;
  } catch (error) {
    console.error("Error in getGroupStream:", error);
    return new Response(`Internal Server Error`, {
      status: 500,
    });
  }
}
