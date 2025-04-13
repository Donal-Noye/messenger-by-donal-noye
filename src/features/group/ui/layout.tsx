export function GroupLayout({
  avatar,
  info,
  actions,
  children,
  messageInput,
  back
}: {
  avatar: React.ReactNode;
  info: React.ReactNode;
  actions: React.ReactNode;
  children: React.ReactNode;
  messageInput: React.ReactNode;
  back: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-4 px-6 sm:py-6 sm:px-8 border-b-2 border-b-primary/30">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            {back}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {avatar}
            {info}
          </div>
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
        {children}
      <div className="mt-auto p-6">
        {messageInput}
      </div>
    </div>
  );
}
