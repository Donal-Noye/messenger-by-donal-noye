import { Button } from "@/shared/ui/button";
import { Loader } from "lucide-react";

export function SubmitButton({
  children,
  isPending,
  className = "w-full",
  disabled
}: {
  className?: string;
  children: React.ReactNode;
  isPending?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button disabled={isPending || disabled} size="lg" className={className} type="submit">
      {isPending ? <Loader className="animate-spin" /> : children}
    </Button>
  );
}
