import { getCurrentUser } from "@/entities/user/server";
import { NextRequest, NextResponse } from "next/server";
import { getGroupById } from "@/entities/group/services/get-group";
import { updateGroup } from "@/entities/group/server";
import { sseStream } from "@/shared/lib/sse/server";

export async function updateGroupStream(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  const updatedGroupName = await req.json();
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

  const { write } = sseStream(req);

  const updatedGroup = await updateGroup(id, updatedGroupName);

  write({ type: "group-changed", data: updatedGroup });

  return NextResponse.json(updatedGroup.value);
}
