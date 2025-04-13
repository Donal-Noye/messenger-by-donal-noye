import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { LogOut } from "lucide-react";
import { cn } from "@/shared/lib/css";
import {logout} from "@/features/auth/actions/logout";

export function UserAvatar({
  name,
  avatar = "",
  className,
}: {
  name?: string;
  avatar?: string;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className={cn("w-14 h-14", className)}>
          <AvatarImage src={avatar} alt="" />
          <AvatarFallback className="font-bold">
            {name ? name[0].toUpperCase() : "G"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel className="text-lg">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-base">Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-base text-red-500">
          <form
            className="w-full"
            action={logout}
          >
            <button className="flex items-center justify-between w-full">
              Logout
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
