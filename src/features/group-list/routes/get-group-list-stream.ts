"use server";

import { NextRequest } from "next/server";
import { getCurrentUser } from "@/entities/user/server";
import { sseStream } from "@/shared/lib/sse/server";
import { getGroupList, groupEvents } from "@/entities/group/server";

export async function getGroupListStream(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response(`User not found`, {
        status: 404,
      });
    }

    const { response, write, addCloseListener } = sseStream(req);

    const sendUpdate = async () => {
      write(await getGroupList(user.id));
    };
    await sendUpdate();

    const globalSubs = await Promise.all([
      groupEvents.addGroupCreatedListener(sendUpdate),
      groupEvents.addGroupDeletedListener(sendUpdate),
      groupEvents.addGroupChangedListener(sendUpdate),
    ]);

    addCloseListener(() => {
      globalSubs.forEach(unsub => unsub());
    });

    return response;
  } catch (error) {
    console.error("Error in getGroupStream:", error);
    return new Response(`Internal Server Error`, {
      status: 500,
    });
  }
}
