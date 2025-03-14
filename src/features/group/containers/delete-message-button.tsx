import { Button } from "@/shared/ui/button";
import { deleteMessageAction } from "@/features/group/actions/delete-message";
import { useActionState } from "@/shared/lib/react";
import { right } from "@/shared/lib/either";
import { startTransition } from "react";
import { Loader } from "lucide-react";

export const DeleteMessageButton = ({
  messageId,
  onSuccess,
}: {
  messageId: string;
  onSuccess: () => void;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch, isPending] = useActionState(async () => {
    const result = await deleteMessageAction(messageId);
    if (result.type === "right") {
      onSuccess();
    }
  }, right(undefined));

  return (
    <Button
      disabled={isPending}
      onClick={() => startTransition(dispatch)}
      variant="destructive"
      className="w-full"
    >
      {isPending ? <Loader className="animate-spin" /> : <p>Delete</p>}
    </Button>
  );
};
