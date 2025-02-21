"use client"

import { Button } from "@/shared/ui/button";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/shared/lib/css";

export function NavLink({
  route,
  icon,
}: {
  route: string;
  icon: React.ReactNode;
}) {
  const pathname = usePathname()
  
  return (
    <Button className={cn("h-12", pathname === route && "bg-accent text-accent-foreground")} asChild variant="outline" size="lg">
      <Link href={route}>{icon}</Link>
    </Button>
  );
}
