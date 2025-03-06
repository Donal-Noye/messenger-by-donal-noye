import {ScrollArea} from "@/shared/ui/scroll-area";

export function GroupListLayout({actions, search, children}: {
  children: React.ReactNode;
  search: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className="bg-background my-4 rounded-3xl space-y-6 p-6 overflow-x-auto">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-xl font-medium tracking-tight lg:text-3xl">
          Groups
        </h1>
        {actions}
      </div>
      {search}
      <ScrollArea className="h-[75%]" autoScroll={false}>
        <div className="flex flex-col gap-2">
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}
