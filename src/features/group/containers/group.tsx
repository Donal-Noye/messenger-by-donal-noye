import { getCurrentUser } from "@/entities/user/server";
import { redirect } from "next/navigation";
import { routes } from "@/kernel/routes";
import { GroupClient } from "@/features/group/containers/group-client";
import { getGroupById } from "@/entities/group/server";
import { getMessagesAction } from "@/features/group/actions/get-messages";
import { getMembersAction } from "@/features/group/actions/get-members-action";

export async function Group({ groupId }: { groupId: string }) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.signIn());

  const [group, messages, members] = await Promise.all([
    getGroupById(groupId),
    getMessagesAction(groupId),
    getMembersAction(groupId),
  ]);

  if (!group) redirect(routes.home());

  const isMember = members.some(member => member.userId === user.id);
  if (!isMember) redirect(routes.home());

  return (
    <GroupClient
      userId={user.id}
      defaultGroup={group}
      initialMessages={messages}
      initialMembers={members}
    />
  );
}
