import {getAllUsers, getCurrentUser} from "@/entities/user/server";
import {redirect} from "next/navigation";
import {routes} from "@/kernel/routes";
import {UsersClient} from "@/features/users/containers/users-client";

export async function Users() {
	const user = await getCurrentUser()
	const users = await getAllUsers({ page: 1, limit: 20 })

	if (!user) {
		redirect(routes.signIn());
	}

	return <UsersClient users={users} />
}