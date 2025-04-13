import { Users } from "@/features/users/server";

export default function UsersPage() {
  return (
    <div className="bg-background sm:rounded-3xl z-10 overflow-hidden relative h-full flex flex-col">
      <Users />
    </div>
  );
}
