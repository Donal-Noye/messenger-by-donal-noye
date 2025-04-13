import { GroupDomain } from "@/entities/group";

export const Typing = ({
  typingUsers,
  userId,
  members,
}: {
  typingUsers: Record<string, boolean>;
  userId: string;
  members: GroupDomain.MemberEntity[];
}) => {
  const otherUsers = Object.keys(typingUsers).filter((id) => id !== userId);
  if (otherUsers.length === 0) return null;

  const names = otherUsers
    .map((id) => {
      const member = members.find((m) => m.userId === id);
      return member?.user?.name || "Unknown user";
    })
    .filter(Boolean)
    .join(", ");

  return (
    <div className="text-sm text-secondary animate-pulse">
      {names} is typing...
    </div>
  );
};
