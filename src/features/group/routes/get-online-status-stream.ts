import { NextRequest } from "next/server";
import { userEvents } from "@/entities/user/server";
import { sseStream } from "@/shared/lib/sse/server";

export const getOnlineStatusStream = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const { response, write, addCloseListener } = sseStream(req);

  const unsubscribe = await userEvents.addUserOnlineListener((event) => {
    if (event.data.id === id) {
      write(event);
    }
  });

  addCloseListener(() => {
    unsubscribe();
  });

  return response;
};
