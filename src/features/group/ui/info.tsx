import { MembersDialog } from "@/features/group/containers/members-dialog";
import { GroupDomain } from "@/entities/group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import {memo, useCallback} from "react";

export const GroupInfo = memo(function GroupInfo({
  userId,
  group,
  members,
  setMembersData,
}: {
  userId: string;
  group?: GroupDomain.GroupEntity;
  members: GroupDomain.MemberEntity[];
  setMembersData: React.Dispatch<
    React.SetStateAction<GroupDomain.MemberEntity[] | undefined>
  >;
}) {
  const handleAddMember = useCallback((newMember: GroupDomain.MemberEntity) => {
    setMembersData((prev) => {
      const existingMember = prev?.some((m) => m.id === newMember.id);
      if (existingMember) return prev;
      return [...(prev ?? []), newMember];
    });
  }, [setMembersData]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    setMembersData((prev) => prev?.filter((m) => m.id !== memberId));
  }, [setMembersData]);

  if (!group) {
    return null;
  }

  return (
    <div className="flex flex-col items-start">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <h2 className="scroll-m-20 text-lg min-[400px]:text-xl sm:text-3xl font-semibold tracking-tight text-heading truncate max-w-[200px] sm:max-w-[400px] overflow-hidden whitespace-nowrap block pr-4">
              {group.name}
            </h2>
          </TooltipTrigger>
          <TooltipContent>
            <p>{group.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <MembersDialog
        userId={userId}
        groupId={group.id}
        members={members}
        onAddMember={handleAddMember}
        handleRemoveMember={handleRemoveMember}
        creatorId={group.creatorId}
      />
    </div>
  );
});
