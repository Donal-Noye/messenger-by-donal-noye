import { useActionState } from "@/shared/lib/react";
import { right } from "@/shared/lib/either";
import { updatePasswordAction } from "@/features/settings/actions/update-password";
import { useToast } from "@/shared/lib/react/use-toast";
import { useRouter } from "next/navigation";
import { passwordSchema } from "./schema";
import { matchEither } from "@/shared/lib/either";
import { z } from "zod";

export function usePasswordForm(userId: string) {
  const { toast } = useToast();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, dispatchPassword, isPasswordPending] = useActionState(
    async (_: any, values: z.infer<typeof passwordSchema>) => {
      const result = await updatePasswordAction(
        userId,
        values.currentPassword,
        values.newPassword,
      );
      matchEither(result.value, {
        left: (errorMessage) => {
          toast({
            description: errorMessage,
            variant: "destructive",
          });
        },
        right: () => {
          toast({
            description: `Password updated successfully!`,
            variant: "successful",
          });
          // passwordForm.reset();
          router.refresh();
        },
      });
    },
    right(undefined),
  );

  return { dispatchPassword, isPasswordPending };
}
