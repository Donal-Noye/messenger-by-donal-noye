import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/entities/user/services/get-current-user";
import { getGroupById } from "@/entities/group/services/get-group";
import { sseStream } from "@/shared/lib/sse/server";
import { addMemberToGroupAction } from "@/features/group/actions/add-member-to-group";

export async function addMemberToGroupStream(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getCurrentUser();
  const { id } = params;

  if (!user) {
    return new Response(`User not found`, { status: 404 });
  }

  const group = await getGroupById(id);

  if (!group) {
    const { response } = sseStream(req);

    return response;
  }

  const result = await addMemberToGroupAction(group.id, user.id);

  return NextResponse.json(result);
}
