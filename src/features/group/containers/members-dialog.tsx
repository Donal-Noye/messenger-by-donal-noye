import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Card, CardDescription, CardTitle } from "@/shared/ui/card";
import { useMembersDialog } from "@/features/group/model/use-members-dialog";
import { DialogLayout } from "@/shared/ui/dialog-layout";
import { GroupDomain } from "@/entities/group";
import { Loader, SearchIcon } from "lucide-react";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { SubmitButton } from "@/features/auth/ui/submit-button";
import { memo, startTransition } from "react";

export const MembersDialog = memo(function MembersDialog({
  userId,
  groupId,
  members,
  onAddMember,
  handleRemoveMember,
  creatorId,
}: {
  userId: string;
  groupId: string;
  members: GroupDomain.MemberEntity[];
  onAddMember: (newMember: GroupDomain.MemberEntity) => void;
  handleRemoveMember: (memberId: string) => void;
  creatorId: string;
}) {
  const {
    form,
    searchTerm,
    setSearchTerm,
    filteredMembers,
    handleAddMember,
    isPending,
    dispatchRemove,
    isPendingRemove,
  } = useMembersDialog(
    userId,
    groupId,
    members,
    onAddMember,
    handleRemoveMember,
  );

  return (
    <DialogLayout
      className="sm:min-w-[640px]"
      trigger={
        <Button variant="link" className="text-[#6E6E6E] p-0 h-auto">
          {members.length} members
        </Button>
      }
      title="Members"
      description="Manage group members. Add or remove them as needed."
      footer={
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={form.handleSubmit(handleAddMember)}
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter user ID to add" {...field} />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <SubmitButton
              className="w-full mt-3"
              isPending={isPending}
              disabled={!form.formState.isDirty}
            >
              Add member
            </SubmitButton>
          </form>
        </Form>
      }
    >
      <div className="my-4">
        <div className="relative">
          <SearchIcon className="text-[#CEE2EB] w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11"
          />
        </div>
      </div>
      <ScrollArea className="h-48">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="flex items-center py-2 justify-between"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="" alt="" />
                <AvatarFallback>
                  {member.user?.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <CardTitle>{member.user?.name}</CardTitle>
                {member.userId === creatorId && (
                  <CardDescription>Creator</CardDescription>
                )}
              </div>
            </div>
            {userId === creatorId && member.userId !== creatorId && (
              <Button
                disabled={isPendingRemove}
                onClick={() => startTransition(() => dispatchRemove(member.id))}
                variant="destructive"
                size="sm"
              >
                {isPendingRemove ? (
                  <Loader className="animate-spin" />
                ) : (
                  <p>Remove</p>
                )}
              </Button>
            )}
          </Card>
        ))}
      </ScrollArea>
    </DialogLayout>
  );
});
