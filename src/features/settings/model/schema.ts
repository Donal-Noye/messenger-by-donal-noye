import { z } from "zod";
import validator from "validator";

export const formSchema = z.object({
	name: z.string().min(1, {
		message: "Username must be at least 1 characters.",
	}),
	email: z.string().email(),
	phone: z.string().optional().refine(
		(val) => !val || validator.isMobilePhone(val),
		{ message: "Invalid phone number" }
	),
	status: z.string().max(50, { message: "Status must be at least 50 characters." }).optional(),
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