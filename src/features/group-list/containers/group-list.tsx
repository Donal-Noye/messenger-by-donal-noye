import { getGroupList } from "@/entities/group/services/get-group-list";
import { GroupListClient } from "@/features/group-list/containers/group-list-client";

export const GroupList = async ({
  userId,
}: {
  userId: string;
}) => {
  const groups = await getGroupList(userId);

  return <GroupListClient groups={groups} />;
};
