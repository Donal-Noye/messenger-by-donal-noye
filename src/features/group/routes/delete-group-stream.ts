import { getCurrentUser } from "@/entities/user/server";
import { NextRequest } from "next/server";
import { getGroupById } from "@/entities/group/services/get-group";
import { sseStream } from "@/shared/lib/sse/server";
import {
  deleteGroup,
  getGroupList,
  groupEvents,
} from "@/entities/group/server";

export async function deleteGroupStream(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  const { id } = params;

  if (!user) {
    return new Response(`User not found`, { status: 404 });
  }

  const group = await getGroupById(id);

  if (!group || group.creator.id !== user.id) {
    return new Response(`Group not found or permission denied`, {
      status: 403,
    });
  }

  const { write, response, addCloseListener } = sseStream(req);

  write({ type: "group-deleted", groupId: group.id });

  await deleteGroup(group.id);

  write(await getGroupList(user.id));

  addCloseListener(
    await groupEvents.addGroupChangedListener(async () => {
      write(await getGroupList(user.id));
    }),
  );

  return response;
}
