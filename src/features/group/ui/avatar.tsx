import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { memo } from "react";

export const GroupAvatar = memo(function GroupAvatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: string;
}) {
  return (
    <>
      <Avatar className="w-12 h-12 min-[400px]:w-14 min-[400px]:h-14 sm:w-16 sm:h-16">
        <AvatarImage src={avatar} alt="" />
        <AvatarFallback className="font-bold">
          {name ? name[0].toUpperCase() : "G"}
        </AvatarFallback>
      </Avatar>
    </>
  );
});
