import {UserDomain, UserSheet} from "@/entities/user";
import { GroupDomain } from "@/entities/group";
import { cn } from "@/shared/lib/css";
import { format } from "date-fns";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {memo, useMemo} from "react";

export const MessageCard = memo(function MessageCard({
  message,
  userId,
  deleteAction,
  onEdit,
}: {
  message: GroupDomain.MessageEntity;
  userId: string;
  deleteAction: React.ReactNode;
  onEdit: (message: GroupDomain.MessageEntity) => void;
}) {
  const isCurrentUser = message.userId === userId;
  const formattedTime = useMemo(
    () => format(new Date(message.createdAt), "HH:mm"),
    [message.createdAt],
  );

  if (!message.user) return null;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={!isCurrentUser}
        className={cn(
          "sm:max-w-[80%] w-fit flex gap-3 items-start",
          isCurrentUser ? "ml-auto" : "mr-auto",
        )}
      >
        <MemoizedAvatar user={message.user} isCurrentUser={isCurrentUser} />
        <div>
          <UserName isCurrentUser={isCurrentUser} name={message.user.name} />
          <MessageContent
            message={message}
            isCurrentUser={isCurrentUser}
            formattedTime={formattedTime}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="space-y-1.5">
        <ContextMenuItem
          className="cursor-pointer justify-center"
          onClick={() => onEdit(message)}
        >
          Change
        </ContextMenuItem>
        <ContextMenuItem asChild>{deleteAction}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

const MemoizedAvatar = memo(function MemoizedAvatar({
  user,
  isCurrentUser,
}: {
  user: UserDomain.UserEntity;
  isCurrentUser: boolean;
}) {
  return !isCurrentUser ? (
    <UserSheet
      user={user}
      trigger={
        <Avatar className="w-9 h-9 border-2 border-[#4E4E4E] cursor-pointer">
          <AvatarImage src={user.avatar!} alt="" />
          <AvatarFallback className="font-medium text-sm">
            {user.name?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      }
    />
  ) : null;
});

const UserName = memo(function UserName({
  isCurrentUser,
  name,
}: {
  isCurrentUser: boolean;
  name?: string;
}) {
  return (
    <div className={cn("mb-1.5", isCurrentUser ? "text-right" : "text-left")}>
      <p className="text-xs font-medium text-primary">
        {!isCurrentUser ? name : "You"}
      </p>
    </div>
  );
});

const MessageContent = memo(function MessageContent({
  message,
  isCurrentUser,
  formattedTime,
}: {
  message: GroupDomain.MessageEntity;
  isCurrentUser: boolean;
  formattedTime: string;
}) {
  return (
    <div
      className={cn(
        "px-4 pt-3 pb-4 pr-14 rounded-2xl min-w-[100px] relative",
        "break-all whitespace-pre-wrap",
        isCurrentUser
          ? "bg-primary-foreground rounded-tr-none"
          : "bg-muted rounded-tl-none",
      )}
    >
      {message.content}
      <p
        className={cn(
          "text-xs text-secondary mt-1.5 absolute bottom-4 right-3",
          isCurrentUser ? "" : "",
        )}
      >
        {formattedTime}
      </p>
    </div>
  );
});
