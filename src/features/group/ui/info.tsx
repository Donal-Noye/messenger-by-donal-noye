import { MembersDialog } from "@/features/group/containers/members-dialog";
import { GroupDomain } from "@/entities/group";
import { useState } from "react";

export function GroupInfo({
  group,
  members: initialMembers,
}: {
  group?: GroupDomain.GroupEntity;
  members: GroupDomain.MemberEntity[];
}) {
  const [members, setMembers] =
    useState<GroupDomain.MemberEntity[]>(initialMembers);

  if (!group) {
    return null;
  }

  const handleAddMember = async (newMember: GroupDomain.MemberEntity) => {
    setMembers((prev) => [...prev, newMember]);
  };

  return (
    <div>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-heading">
        {group.name}
      </h2>
      <MembersDialog
        groupId={group.id}
        members={members}
        onAddMember={handleAddMember}
        creatorId={group.creatorId}
      />
    </div>
  );
}
