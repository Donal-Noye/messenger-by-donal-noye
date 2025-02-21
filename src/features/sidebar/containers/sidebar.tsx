import { MessagesSquare, Users } from "lucide-react";
import { routes } from "@/kernel/routes";
import { SidebarLayout } from "@/features/sidebar/ui/layout";
import { BottomLink } from "@/features/sidebar/ui/bottom-link";
import { UserDropdown } from "@/entities/user";
import { Logo } from "@/features/sidebar/ui/logo";
import { NavLink } from "@/features/sidebar/ui/nav-link";
import {SessionEntity} from "@/entities/user/domain";

export async function Sidebar(session: SessionEntity) {
  return (
    <SidebarLayout
      logo={<Logo />}
      bottomLink={<BottomLink />}
      menu={<UserDropdown name={session?.name} />}
    >
      <NavLink route={routes.home()} icon={<MessagesSquare />} />
      <NavLink route={routes.users()} icon={<Users />} />
    </SidebarLayout>
  );
}
