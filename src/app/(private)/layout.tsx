import { MobileSidebar, Sidebar } from "@/features/sidebar";
import { sessionService } from "@/entities/user/services/session";
import { GroupList } from "@/features/group-list/server";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await sessionService.verifySession();

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] lg:grid-cols-[auto_auto_1fr] h-screen bg-[#191E20] overflow-hidden">
        <div className="hidden sm:block">
          <Sidebar {...session} />
        </div>

        <div className="block sm:hidden">
          <MobileSidebar name={session.name} />
        </div>
        <GroupList userId={session.id} />
        <div className="overflow-hidden">
          <main className="h-full overflow-auto sm:py-4 px-0 lg:px-4 relative pb-20 sm:pb-0">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
