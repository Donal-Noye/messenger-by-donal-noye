import { Sidebar } from "@/features/sidebar";
import { sessionService } from "@/entities/user/services/session";
import { GroupList } from "@/features/group-list/server";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await sessionService.verifySession();

  return (
    <div className="grid grid-cols-[0.1fr_0.35fr_1fr] bg-[#191E20] h-screen">
      <Sidebar {...session} />
      <GroupList userId={session.id} />
      <main className="relative p-4 h-screen">{children}</main>
    </div>
  );
}
