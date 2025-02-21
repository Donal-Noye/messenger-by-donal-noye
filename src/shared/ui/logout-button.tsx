import { sessionService } from "@/entities/user/services/session";
import { redirect } from "next/navigation";
import { routes } from "@/kernel/routes";
import { LogOut } from "lucide-react";

export function LogoutButton() {
	return (
		<form
			className="w-full"
			action={async () => {
				"use server";
				await sessionService.deleteSession();
				redirect(routes.signIn());
			}}
		>
			<button className="flex items-center justify-between w-full">
				Logout
				<LogOut className="w-4 h-4" />
			</button>
		</form>
	);
}
