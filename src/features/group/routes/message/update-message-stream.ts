import { getCurrentUser } from "@/entities/user/server";
import { NextRequest, NextResponse } from "next/server";
import { getGroupById } from "@/entities/group/services/get-group";
import { sseStream } from "@/shared/lib/sse/server";
import {updateMessage} from "@/entities/message/server";

export async function updateMessageStream(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const user = await getCurrentUser();
  const updatedContent = await req.json();
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

	const updatedMessage = await updateMessage(id, updatedContent);

	write({ type: "message-changed", data: updatedMessage });

	return NextResponse.json(updatedMessage.value);
}
