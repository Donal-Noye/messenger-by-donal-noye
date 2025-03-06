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
  return (
    Object.keys(typingUsers).filter((id) => id !== userId).length > 0 && (
      <div className="text-sm text-secondary animate-pulse">
        {Object.keys(typingUsers)
          .filter((id) => id !== userId)
          .map((id) => {
            const member = members.find((m) => m.userId === id);
            return member?.user?.name || "Unknown user";
          })
          .filter(Boolean)
          .join(", ")}{" "}
        is typing...
      </div>
    )
  );
};
