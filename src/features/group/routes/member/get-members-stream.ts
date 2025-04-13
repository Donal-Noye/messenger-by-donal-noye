"use server"

import { NextRequest } from "next/server";
import {
  getGroupById,
  getGroupMembers,
  groupEvents,
} from "@/entities/group/server";
import { getCurrentUser } from "@/entities/user/server";
import { sseStream } from "@/shared/lib/sse/server";

export async function getMembersStream(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const group = await getGroupById(id);

    if (!user || !group?.id) {
      return new Response(`Group not found`, {
        status: 404,
      });
    }

    const { response, write, addCloseListener } = sseStream(req);

    const getMembers = async () => {
      write(await getGroupMembers(group.id));
    };

    await getMembers();

    const unsubscribeMemberAdded = await groupEvents.addMemberAddedListener(
      group.id,
      async () => {
        await getMembers();
      },
    );

    const unwatchMembersRemoved = await groupEvents.addMemberDeletedListener(
      group.id,
      async () => {
        await getMembers();
      },
    );

    addCloseListener(() => {
      unsubscribeMemberAdded();
      unwatchMembersRemoved();
    });

    return response;
  } catch (error) {
    console.error("Error in getMembersStream:", error);
    return new Response(`Internal Server Error`, {
      status: 500,
    });
  }
}
