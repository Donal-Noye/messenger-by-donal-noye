import { NextRequest } from "next/server";
import { sseStream } from "@/shared/lib/sse/server";
import { getGroupById, groupEvents } from "@/entities/group/server";

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

    const unwatchDelete = await groupEvents.addGroupDeletedListener(
      ({ data }) => {
        if (data.groupId === group.id) {
          write({ type: "group-deleted", data });
        }
      },
    );

    addCloseListener(() => {
      unwatchChange();
      unwatchDelete();
    });

    return response;
  } catch (error) {
    console.error("Error in getGroupStream:", error);
    return new Response(`Internal Server Error`, {
      status: 500,
    });
  }
}
