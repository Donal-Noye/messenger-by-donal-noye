import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/css";
import { routes } from "@/kernel/routes";
import { Button } from "@/shared/ui/button";

export function GroupCard({ name, id }: { name: string; id: string; }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      className={cn(
        "justify-start h-14 rounded-2xl",
        pathname === routes.group(id) ? "bg-accent" : "",
      )}
      onClick={() => router.push(routes.group(id))}
    >
      <p>{name}</p>
    </Button>
  );
}
