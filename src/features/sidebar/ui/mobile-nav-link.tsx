"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/css";

export function MobileNavLink({
  route,
  icon,
}: {
  route: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        "py-3 px-5 min-[400px]:py-4 min-[400px]:px-6 rounded-3xl flex items-center justify-center",
        pathname === route && "bg-[#090909] text-accent-foreground",
      )}
      href={route}
    >
      {icon}
    </Link>
  );
}
