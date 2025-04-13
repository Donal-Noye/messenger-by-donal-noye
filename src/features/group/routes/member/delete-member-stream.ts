"use server";

import { getCurrentUser } from "@/entities/user/server";
import { NextRequest } from "next/server";
import { getGroupById } from "@/entities/group/services/get-group";
import { sseStream } from "@/shared/lib/sse/server";
import {
  getGroupMembers,
  groupEvents,
  removeMember,
} from "@/entities/group/server";

export async function removeMemberStream(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  const { id } = params;
  const { id: memberId } = await req.json();

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

  write({
    type: "member-removed",
    data: { groupId: group.id, memberId: memberId },
  });

  await removeMember(group.id, memberId);

  write(await getGroupMembers(group.id));

  addCloseListener(
    await groupEvents.addMemberDeletedListener(group.id, async () => {
      write(await getGroupMembers(group.id));
    }),
  );

  return response;
}
