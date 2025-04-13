export function MobileSidebarLayout({
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
    <nav className="grid grid-cols-[1fr_2fr_1fr] items-center sm:gap-1 bg-[#14181A] fixed z-40 bottom-0 left-0 h-[76px] w-full">
      <div className="flex justify-center items-center">{logo}</div>
      <div className="flex justify-center sm:gap-1 w-full">
        {children}
        {bottomLink}
      </div>
      <div className="flex justify-center items-center">{menu}</div>
    </nav>
  );
}
