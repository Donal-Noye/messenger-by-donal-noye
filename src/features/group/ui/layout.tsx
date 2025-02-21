export function GroupLayout({
  avatar,
  info,
  actions,
  children,
  messageInput,
}: {
  avatar: React.ReactNode;
  info: React.ReactNode;
  actions: React.ReactNode;
  children: React.ReactNode;
  messageInput: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-6 px-8 border-b-2 border-b-primary/30">
        <div className="flex items-center gap-4">
          {avatar}
          {info}
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
