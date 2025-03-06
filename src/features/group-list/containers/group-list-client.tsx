"use client";

import { CreateButton } from "@/features/group-list/server";
import { GroupListLayout } from "@/features/group-list/ui/layout";
import { SearchGroup } from "@/features/group-list/containers/search-group";
import { GroupCard } from "@/features/group-list/ui/group-card";
import { useRouter } from "next/navigation";
import { routes } from "@/kernel/routes";
import { useEventSource } from "@/shared/lib/sse/client";
import { GroupDomain } from "@/entities/group";
import { searchItems } from "@/shared/lib/search-items";
import { useState } from "react";

export const GroupListClient = ({
  groups,
  userId
}: {
  groups: GroupDomain.GroupEntity[];
  userId: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { dataStream = groups } = useEventSource<GroupDomain.GroupEntity[]>(
    routes.groupsStream(),
  );

  const filteredGroups = searchItems(dataStream, searchTerm, "name");

  const router = useRouter();

  const handleSuccess = (groupId: string) => {
    router.push(routes.group(groupId));
  };

  return (
    <GroupListLayout
      search={<SearchGroup setSearchTerm={setSearchTerm} />}
      actions={<CreateButton onSuccess={handleSuccess} />}
    >
      {filteredGroups.map((group) => (
        <GroupCard userId={userId} key={group.id} group={group} />
      ))}
    </GroupListLayout>
  );
};
