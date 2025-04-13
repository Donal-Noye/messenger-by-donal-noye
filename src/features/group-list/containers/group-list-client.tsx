"use client";

import { CreateButton } from "@/features/group-list/server";
import { GroupListLayout } from "@/features/group-list/ui/layout";
import { SearchGroup } from "@/features/group-list/containers/search-group";
import { GroupCard } from "@/features/group-list/ui/group-card";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/kernel/routes";
import { useEventSource } from "@/shared/lib/sse/client";
import { GroupDomain } from "@/entities/group";
import { searchItems } from "@/shared/lib/search-items";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

export const GroupListClient = memo(function GroupListClient({
  groups,
}: {
  groups: GroupDomain.GroupEntity[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { dataStream = groups } = useEventSource<GroupDomain.GroupEntity[]>(
    routes.groupsStream(),
  );

  const filteredGroups = useMemo(
    () => searchItems(dataStream, searchTerm, "name"),
    [dataStream, searchTerm],
  );

  const handleSuccess = useCallback(
    (groupId: string) => {
      router.push(routes.group(groupId));
    },
    [router],
  );

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldHide = (
    /^\/group\/[^/]+$/.test(pathname) ||
    pathname.startsWith(routes.users()) ||
    pathname.startsWith(routes.settings())
  ) && isMobile;

  if (shouldHide) return null;

  return (
    <GroupListLayout
      search={<SearchGroup onSearchTerm={setSearchTerm} />}
      actions={<CreateButton onSuccess={handleSuccess} />}
    >
      {filteredGroups.map((group) => (
        <GroupCard
          isActive={pathname === routes.group(group.id)}
          key={group.id}
          group={group}
        />
      ))}
    </GroupListLayout>
  );
});
