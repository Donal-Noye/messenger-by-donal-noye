import { getOnlineStatus } from "@/features/user/server";
import { getCurrentUser, updateUserActivity } from "@/entities/user/server";
import { NextResponse } from "next/server";

export const GET = getOnlineStatus;
export const POST = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    await updateUserActivity(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ping error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
