import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupDomain } from "@/entities/group";
import { searchItems } from "@/shared/lib/search-items";
import { matchEither, right } from "@/shared/lib/either";
import { useToast } from "@/shared/lib/react/use-toast";
import { useActionState } from "@/shared/lib/react";
import { addMemberToGroupAction } from "@/features/group/actions/add-member-to-group";
import { useRouter } from "next/navigation";
import { removeMemberAction } from "../actions/remove-member";

const formSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

export function useMembersDialog(
  currentUserId: string,
  groupId: string,
  members: GroupDomain.MemberEntity[],
  onAddMember: (newMember: GroupDomain.MemberEntity) => void,
  handleRemoveMember: (memberId: string) => void,
) {
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const isUserStillMember = useMemo(
    () => members.some((member) => member.userId === currentUserId),
    [members, currentUserId],
  );

  useEffect(() => {
    if (!isUserStillMember) {
      router.push("/");
    }
  }, [isUserStillMember, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch, isPending] = useActionState(
    async (_: any, values: z.infer<typeof formSchema>) => {
      const result = await addMemberToGroupAction(groupId, values.userId);
      matchEither(result, {
        left: (errorMessage) => {
          toast({
            description: errorMessage,
            variant: "destructive",
          });
        },
        right: (newMember) => {
          onAddMember(newMember);
          toast({
            description: `User added!`,
            variant: "successful",
          });
          // router.refresh();
        },
      });
      form.reset();
    },
    right(undefined),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, dispatchRemove, isPendingRemove] = useActionState(
    async (_: void, memberId: string) => {
      const result = await removeMemberAction(memberId, groupId);
      if (result.type === "right") {
        const member = members.find((m) => m.id === memberId);
        handleRemoveMember(memberId);

        toast({
          description: `Member ${member?.user.name} removed`,
          variant: "destructive",
        });

        router.refresh();
      }
    },
    right(undefined),
  );

  const filteredMembers = useMemo(
    () => searchItems(members, searchTerm, "user.name"),
    [members, searchTerm],
  );

  const handleAddMember = useCallback(
    (values: z.infer<typeof formSchema>) => {
      startTransition(() => {
        dispatch(values);
      });
    },
    [dispatch],
  );

  return {
    form,
    searchTerm,
    setSearchTerm,
    filteredMembers,
    handleAddMember,
    isPending,
    dispatchRemove,
    isPendingRemove,
  };
}
