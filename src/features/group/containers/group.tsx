import { getCurrentUser } from "@/entities/user/server";
import { redirect } from "next/navigation";
import { routes } from "@/kernel/routes";
import { GroupClient } from "@/features/group/containers/group-client";
import { getGroupById } from "@/entities/group/server";
import {getMessagesAction} from "@/features/group/actions/get-messages";

export async function Group({ groupId }: { groupId: string }) {
  const user = await getCurrentUser();
  const group = await getGroupById(groupId);
  const messages = await getMessagesAction(groupId);

  if (!user) {
    redirect(routes.signIn());
  }

  if (!group) {
    redirect(routes.home());
  }

  return (
    <GroupClient
      userId={user.id}
      defaultGroup={group}
      initialMessages={messages}
    />
  );
}
