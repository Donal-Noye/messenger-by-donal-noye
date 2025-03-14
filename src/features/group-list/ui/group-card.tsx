import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/css";
import { routes } from "@/kernel/routes";
import { Button } from "@/shared/ui/button";
import { GroupDomain } from "@/entities/group";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";

export function GroupCard({
  group,
  userId,
}: {
  group: GroupDomain.GroupEntity;
  userId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // const lastMessage = group.messages.at(-1);
  // const senderName =
  //   lastMessage?.user?.id === userId ? "You" : lastMessage?.user?.name || "";

  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start h-14 rounded-2xl gap-3",
        pathname === routes.group(group.id) ? "bg-accent" : "",
      )}
      onClick={() => router.push(routes.group(group.id))}
    >
      <Avatar className="w-9 h-9">
        <AvatarFallback className="font-medium text-xs">
          {group.name ? group.name[0].toUpperCase() : "G"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start truncate">
        <p className="text-primary text-base">{group.name}</p>
        {/*{group.messages.length !== 0 && (*/}
        {/*  <div className="flex items-center gap-1 text-secondary">*/}
        {/*    <p>{senderName}</p>*/}
        {/*    <span>-</span>*/}
        {/*    <p>*/}
        {/*      {lastMessage?.content}*/}
        {/*    </p>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </Button>
  );
}
