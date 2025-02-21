import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export function GroupAvatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: string;
}) {
  return (
    <>
      <Avatar className="w-16 h-16">
        <AvatarImage src={avatar} alt="" />
        <AvatarFallback className="font-bold">
          {name ? name[0].toUpperCase() : "G"}
        </AvatarFallback>
      </Avatar>
    </>
  );
}
