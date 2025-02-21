export function SidebarLayout({
  logo,
  children,
  menu,
  bottomLink,
}: {
  logo: React.ReactNode;
  children: React.ReactNode;
  bottomLink: React.ReactNode;
  menu: React.ReactNode;
}) {
  return (
    <aside className="flex flex-col items-center py-12 h-screen">
      {logo}
      <nav className="flex flex-col gap-2 mt-6">{children}</nav>
      <div className="flex flex-col items-center gap-3 mt-auto px-3">
        {bottomLink}
        {menu}
      </div>
    </aside>
  );
}
