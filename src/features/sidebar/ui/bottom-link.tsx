import { NavLink } from "@/features/sidebar/ui/nav-link";
import { routes } from "@/kernel/routes";
import { Settings } from "lucide-react";

export function BottomLink() {
  return <NavLink route={routes.settings()} icon={<Settings />} />;
}
