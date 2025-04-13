
import { MessagesSquare, Settings, Users } from "lucide-react";
import { routes } from "@/kernel/routes";
import { UserDropdown } from "@/entities/user";
import { Logo } from "@/features/sidebar/ui/logo";
import { MobileSidebarLayout } from "@/features/sidebar/ui/mobile-layout";
import { MobileNavLink } from "@/features/sidebar/ui/mobile-nav-link";

export function MobileSidebar({ name }: { name: string }) {
  return (
    <MobileSidebarLayout
      logo={<Logo />}
      bottomLink={
        <MobileNavLink
          route={routes.settings()}
          icon={<Settings className="w-5 h-5 sm:w-6 sm:h-6" />}
        />
      }
      menu={<UserDropdown name={name} />}
    >
      <MobileNavLink
        route={routes.home()}
        icon={<MessagesSquare className="w-5 h-5 sm:w-6 sm:h-6" />}
      />
      <MobileNavLink
        route={routes.users()}
        icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
      />
    </MobileSidebarLayout>
  );
}
