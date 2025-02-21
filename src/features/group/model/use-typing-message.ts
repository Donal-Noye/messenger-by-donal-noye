import { useActionState } from "@/shared/lib/react";
import { right } from "@/shared/lib/either";
import {routes} from "@/kernel/routes";

export function useTypingMessage(userId: string, groupId: string) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, dispatchTyping] = useActionState(
		async (_: any, isTyping: boolean) => {
			const controller = new AbortController();

			const response = await fetch(routes.typingStream(groupId), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, groupId, isTyping }),
				signal: controller.signal,
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error("Typing endpoint error:", response.status, errorText);
				throw new Error("Failed to update typing status");
			}

			return right(undefined);
		},
		right(undefined)
	);

	return { dispatchTyping };
}
