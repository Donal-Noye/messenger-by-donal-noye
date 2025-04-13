import { useToast } from "@/shared/lib/react/use-toast";
import { UserDomain } from "@/entities/user";
import {useActionState} from "@/shared/lib/react";
import { useRouter } from "next/navigation";
import {z} from "zod";
import {updateUserAction} from "@/features/settings/actions/update-user";
import {right} from "@/shared/lib/either";
import {formSchema} from "@/features/settings/model/schema";

export function useAccountForm(session: UserDomain.SessionEntity) {
	const { toast } = useToast();
	const router = useRouter();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, dispatch, isPending] = useActionState(
		async (_: any, values: z.infer<typeof formSchema>) => {
			const result = await updateUserAction(session, {
				name: values.name,
				email: values.email,
				status: values.status,
				phone: values.phone,
			});
			if (result.type === "right") {
				toast({
					description: `User updated successfully!`,
					variant: "successful",
				});
				router.refresh();
			} else {
				console.error("Ошибка при обновлении пользователя");
			}
		},
		right(undefined),
	);

	return { dispatch, isPending };
}