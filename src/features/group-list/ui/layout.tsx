import { ScrollArea } from "@/shared/ui/scroll-area";

export function GroupListLayout({
  actions,
  search,
  children,
}: {
  children: React.ReactNode;
  search: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className="bg-background md:my-4 md:rounded-3xl space-y-6 p-6 overflow-x-auto 2xl:w-80 h-screen sm:h-auto">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 font-medium tracking-tight text-3xl">
          Groups
        </h1>
        {actions}
      </div>
      {search}
      <ScrollArea autoScroll={false}>
        <div className="flex flex-col gap-2">{children}</div>
      </ScrollArea>
    </div>
  );
}
