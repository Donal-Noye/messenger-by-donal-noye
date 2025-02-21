import {startTransition, useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupDomain } from "@/entities/group";
import {searchItems} from "@/shared/lib/search-items";
import {matchEither, right} from "@/shared/lib/either";
import { useToast } from "@/shared/lib/react/use-toast";
import { useActionState } from "@/shared/lib/react";
import {addMemberToGroupAction} from "@/features/group/actions/add-member-to-group";
import {useRouter} from "next/navigation";

const formSchema = z.object({
	userId: z.string().nonempty("User ID is required"),
});

export function useMembersDialog(
	groupId: string,
	members: GroupDomain.MemberEntity[],
	onAddMember: (newMember: GroupDomain.MemberEntity) => void
) {
	const { toast } = useToast();
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState("");

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
			matchEither(result.value, {
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
					router.refresh();
				},
			});
			form.reset();
		},
		right(undefined),
	);

	const handleAddMember = (values: z.infer<typeof formSchema>) => {
		startTransition(() => {
			dispatch(values);
		});
	};

	const filteredMembers = searchItems(members, searchTerm, "user.name");

	return {
		form,
		searchTerm,
		setSearchTerm,
		filteredMembers,
		handleAddMember,
		isPending
	};
}
