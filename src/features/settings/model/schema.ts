import { z } from "zod";

export const formSchema = z.object({
	name: z.string().min(1, {
		message: "Username must be at least 1 characters.",
	}),
	email: z.string().email(),
});

export const passwordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(6, "Current password must be at least 6 characters."),
		newPassword: z
			.string()
			.min(6, "New password must be at least 6 characters."),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});