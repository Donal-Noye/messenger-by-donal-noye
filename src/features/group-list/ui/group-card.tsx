import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/css";
import { routes } from "@/kernel/routes";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { memo, useCallback } from "react";

const GroupAvatar = memo(({ name }: { name?: string }) => (
  <Avatar className="w-12 h-12 lg:w-9 lg:h-9">
    <AvatarFallback className="font-medium text-sm lg:text-xs">
      {name ? name[0].toUpperCase() : "G"}
    </AvatarFallback>
  </Avatar>
));
GroupAvatar.displayName = "GroupAvatar";

const GroupName = memo(({ name }: { name: string }) => (
  <div className="flex flex-col items-start truncate">
    <p className="text-primary text-lg lg:text-base">{name}</p>
  </div>
));
GroupName.displayName = "GroupName";

export const GroupCard = memo(
  function GroupCard({
    group: { id, name },
    isActive,
  }: {
    group: { id: string; name?: string };
    isActive: boolean;
  }) {
    const router = useRouter();

    const handleClick = useCallback(() => {
      router.push(routes.group(id));
    }, [router, id]);

    return (
      <Button
        variant="ghost"
        className={cn(
          "justify-start h-14 rounded-2xl gap-4 sm:gap-3",
          isActive ? "bg-accent" : "",
        )}
        onClick={handleClick}
      >
        <GroupAvatar name={name} />
        {name && <GroupName name={name} />}
      </Button>
    );
  },
  (prev, next) =>
    prev.group.id === next.group.id &&
    prev.group.name === next.group.name &&
    prev.isActive === next.isActive,
);
