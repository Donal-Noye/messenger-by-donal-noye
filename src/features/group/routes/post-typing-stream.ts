import { NextRequest, NextResponse } from "next/server";
import { messageEvents } from "@/entities/message/services/message-events";

export async function postTypingStream(request: NextRequest) {
  try {
    const { userId, groupId, isTyping } = await request.json();

    if (!userId || !groupId || typeof isTyping !== "boolean") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    await messageEvents.emit({
      type: "typing",
      data: { userId, groupId, isTyping },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in typing endpoint:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
