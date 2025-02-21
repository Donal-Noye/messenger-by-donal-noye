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
import { SearchIcon } from "lucide-react";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { SubmitButton } from "@/features/auth/ui/submit-button";

export function MembersDialog({
  groupId,
  members,
  onAddMember,
  creatorId,
}: {
  groupId: string;
  members: GroupDomain.MemberEntity[];
  onAddMember: (newMember: GroupDomain.MemberEntity) => void;
  creatorId: string;
}) {
  const {
    form,
    searchTerm,
    setSearchTerm,
    filteredMembers,
    handleAddMember,
    isPending,
  } = useMembersDialog(groupId, members, onAddMember);

  return (
    <DialogLayout
      className="min-w-[640px]"
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
      <ScrollArea>
        {filteredMembers.map((member) => (
          <Card key={member.id} className="flex items-center space-x-4 py-2">
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
          </Card>
        ))}
      </ScrollArea>
    </DialogLayout>
  );
}
