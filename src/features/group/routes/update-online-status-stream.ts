import { NextRequest, NextResponse } from "next/server";
import {updateOnlineStatus, userEvents} from "@/entities/user/server";

export const updateOnlineStatusStream = async (req: NextRequest) => {
  const { userId, isOnline } = await req.json();

  if (!userId || typeof isOnline !== "boolean") {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const updatedUser = await updateOnlineStatus(userId, isOnline);

  await userEvents.emit({
    type: "user-online",
    data: updatedUser.value,
  });

  return NextResponse.json(updatedUser.value);
};
