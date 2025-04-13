"use server";

import { sessionService } from "@/entities/user/services/session";
import { redirect } from "next/navigation";
import { routes } from "@/kernel/routes";

export async function logout() {
	await sessionService.deleteSession();
	redirect(routes.signIn());
}