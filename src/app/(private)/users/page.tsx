import {Users} from "@/features/users/server";

export default function UsersPage() {
	return (
		<div className="bg-background h-full rounded-3xl z-10 overflow-hidden relative">
			<Users />
		</div>
	)
}