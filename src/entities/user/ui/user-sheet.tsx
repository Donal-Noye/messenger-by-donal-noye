import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {UserDomain} from "@/entities/user";
import { Phone } from "lucide-react";

export function UserSheet({
  trigger,
  user,
  isOnline
}: {
  trigger: React.ReactNode;
  user: UserDomain.UserEntity;
  isOnline?: boolean
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="h-[210px] w-full bg-[#C6DEE7]"></div>
          <div className="px-6 !-mt-12">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar!} alt="" />
              <AvatarFallback className="font-medium text-4xl">
                {user.name && user.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <SheetTitle className="mt-4 text-3xl text-heading text-left">
              {user.name}
            </SheetTitle>
            {/*<Badge*/}
            {/*  variant={isOnline ? "successful" : "destructive"}*/}
            {/*  className="text-xs"*/}
            {/*>*/}
            {/*  {isOnline ? "Online" : "Offline"}*/}
            {/*</Badge>*/}
            <SheetDescription className="text-left">
              {user.status}
            </SheetDescription>
            {user.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <p className="text-lg font-medium mt-2 text-left">
                  {user.phone}
                </p>
              </div>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
