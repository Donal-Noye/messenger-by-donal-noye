"use client";

import { Button } from "@/shared/ui/button";
import { Loader, PlusIcon } from "lucide-react";
import { useActionState } from "@/shared/lib/react";
import { createGroupAction } from "@/features/group-list/actions/create-group";
import { right } from "@/shared/lib/either";
import { startTransition } from "react";

export function CreateButton({
  onSuccess,
}: {
  onSuccess?: (groupId: string) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, dispatch, isPending] = useActionState(async () => {
    const result = await createGroupAction();
    if (result.type === "right") {
      onSuccess?.(result.value.id);
    }
  }, right(undefined));

  return (
    <Button
      size="icon"
      disabled={isPending}
      onClick={() => startTransition(dispatch)}
    >
      {isPending ? <Loader className="animate-spin" /> : <PlusIcon />}
    </Button>
  );
}
