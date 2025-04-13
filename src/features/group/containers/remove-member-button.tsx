import { removeMemberAction } from "@/features/group/actions/remove-member";
import { useActionState } from "@/shared/lib/react";
import { right } from "@/shared/lib/either";
import { startTransition } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function RemoveMemberButton({
  userId,
  groupId,
  onSuccess,
}: {
  userId: string;
  groupId: string;
  onSuccess: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch, isPending] = useActionState(async () => {
    const result = await removeMemberAction(userId, groupId);
    if (result.type === "right") {
      onSuccess();
    }
  }, right(undefined));

  return (
    <Button
      disabled={isPending}
      onClick={() => startTransition(dispatch)}
      variant="destructive"
      size="sm"
    >
      {isPending ? <Loader className="animate-spin" /> : <p>Remove</p>}
    </Button>
  );
}
