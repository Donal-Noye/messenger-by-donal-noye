import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { UserDomain } from "@/entities/user/index";

export function UserSheet({
  user,
  isCurrentUser,
}: {
  user: UserDomain.UserEntity;
  isCurrentUser: boolean;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        {!isCurrentUser && (
          <Avatar className="w-9 h-9 border-2 border-[#4E4E4E]">
            <AvatarImage src={user.avatar} alt="" />
            <AvatarFallback className="font-medium text-sm">
              {user.name && user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="h-[210px] w-full bg-[#C6DEE7]"></div>
          <div className="px-6 !-mt-12">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt="" />
              <AvatarFallback className="font-medium text-4xl">
                {user.name && user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <SheetTitle className="mt-6 text-3xl text-heading">
              {user.name}
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="">content</div>
      </SheetContent>
    </Sheet>
  );
}
