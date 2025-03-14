import { GroupDomain } from "@/entities/group";
import { cn } from "@/shared/lib/css";
import { format } from "date-fns";
import { UserSheet } from "@/features/group/ui/user-sheet";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/ui/context-menu";

export function MessageCard({
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

  if (!message.user) {
    return null;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        disabled={!isCurrentUser}
        className={cn(
          "max-w-[80%] w-fit flex gap-3 items-start",
          isCurrentUser ? "ml-auto" : "mr-auto",
        )}
      >
        <UserSheet user={message.user} isCurrentUser={isCurrentUser} />
        <div>
          <div
            className={cn("mb-1.5", isCurrentUser ? "text-right" : "text-left")}
          >
            <p className="text-xs font-medium text-primary">
              {!isCurrentUser ? message.user.name : "You"}
            </p>
          </div>
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
              {format(new Date(message.createdAt), "HH:mm")}
            </p>
          </div>
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
}
