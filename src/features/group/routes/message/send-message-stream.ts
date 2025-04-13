import {NextRequest, NextResponse} from "next/server";
import { getCurrentUser } from "@/entities/user/server";
import { getGroupById } from "@/entities/group/server";

import {
  sendMessageService,
} from "@/entities/message/server";

export async function sendMessageStream(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await req.json();
    const user = await getCurrentUser();
    const group = await getGroupById(id);

    if (!user || !group?.id) {
      return new Response(`Group not found`, {
        status: 404,
      });
    }

    if (!data.content || typeof data.content !== "string") {
      return new Response("Invalid message content", { status: 400 });
    }

    await sendMessageService(user.id, group.id, data.content);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return new Response("An error occurred", { status: 500 });
  }
}
