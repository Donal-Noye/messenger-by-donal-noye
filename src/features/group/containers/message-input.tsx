import { Button } from "@/shared/ui/button";
import { CornerDownRight } from "lucide-react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { messageFormSchema } from "@/features/group/model/use-send-message-form";
import { AutosizeTextarea } from "@/shared/ui/autosize-textarea";
import { startTransition, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useTypingMessage } from "@/features/group/model/use-typing-message";

export function MessageInput({
  form,
  onSubmitAction,
  isPending,
  groupId,
  userId,
}: {
  form: UseFormReturn<z.infer<typeof messageFormSchema>>;
  onSubmitAction: () => void;
  isPending: boolean;
  groupId: string;
  userId: string;
}) {
  const [typing, setTyping] = useState(false);
  const [debouncedTyping] = useDebounce(typing, 500);
  const { dispatchTyping } = useTypingMessage(userId, groupId);

  useEffect(() => {
    const controller = new AbortController();

    startTransition(() => {
      dispatchTyping(debouncedTyping);
    });

    return () => controller.abort();
  }, [debouncedTyping, dispatchTyping]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmitAction();
    }
  };

  return (
    <Form {...form}>
      <form className="relative" onSubmit={onSubmitAction}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AutosizeTextarea
                  autoFocus
                  maxHeight={200}
                  className="bg-transparent border border-[#4E4E4E] pr-20 focus-visible:ring-offset-0 focus-visible:ring-0"
                  placeholder="Type here..."
                  disabled={isPending}
                  onKeyDown={handleKeyDown}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setTyping(!!e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage className="text-rose-500" />
            </FormItem>
          )}
        />
        <div className="absolute right-2 bottom-[13px]">
          <Button
            disabled={isPending || !form.formState.isDirty}
            type="submit"
            size="icon"
          >
            <CornerDownRight />
          </Button>
        </div>
      </form>
    </Form>
  );
}
