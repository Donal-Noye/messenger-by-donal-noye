"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {UserDomain, UserSheet} from "@/entities/user/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Copy, Mail } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { memo, useCallback, useMemo, useState } from "react";
import { useToast } from "@/shared/lib/react/use-toast";
import { cn } from "@/shared/lib/css";

const MemoCopy = memo(Copy);
const MemoMail = memo(Mail);

export const UserCard = memo(
  function UserCard({ user }: { user: UserDomain.UserEntity }) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = useCallback(async () => {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      toast({
        description: "User ID copied!",
        variant: "successful",
      });
      setTimeout(() => setCopied(false), 2000);
    }, [user.id, toast]);

    const statusText = useMemo(
      () => user.status || "No status provided",
      [user.status],
    );

    return (
      <Card className="overflow-hidden transition-colors hover:bg-primary/10 border-primary/20 bg-background/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <MemoAvatar user={user} />
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl">{user.name}</CardTitle>
            <CardDescription onClick={handleCopy} className="flex items-center">
              <UserIdBadge id={user.id} copied={copied} />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div
            className={cn(
              "text-primary",
              !user.status && "text-muted-foreground",
            )}
          >
            {statusText}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-start border-t border-primary/10 pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MemoMail className="mr-1 h-4 w-4" />
            {user.email}
          </div>
          <UserSheet
            trigger={
              <Button
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                View Profile
              </Button>
            }
            user={user}
          />
        </CardFooter>
      </Card>
    );
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id,
);

const MemoAvatar = memo(({ user }: { user: UserDomain.UserEntity }) => (
  <Avatar className="w-12 h-12 md:h-14 md:w-14 border-2 border-primary/20 ring-2 ring-primary/10">
    <AvatarImage src={user.avatar || ""} alt={user.name} />
    <AvatarFallback className="text-lg font-medium">
      {user.name.slice(0, 1).toUpperCase()}
    </AvatarFallback>
  </Avatar>
));
MemoAvatar.displayName = "MemoAvatar";

const UserIdBadge = memo(({ id, copied }: { id: string; copied: boolean }) => {
  const truncatedId = useMemo(() => `${id.slice(0, 16)}...`, [id]);

  return (
    <Badge
      variant="secondary"
      className="font-mono text-xs text-primary-foreground gap-2 cursor-pointer"
      title={id}
    >
      {copied ? "Copied!" : truncatedId}
      <MemoCopy className="w-4 h-4" />
    </Badge>
  );
});
UserIdBadge.displayName = "UserIdBadge";
