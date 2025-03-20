import { Button } from "@/shared/ui/button";
import { Check, CornerDownRight, Pen, X } from "lucide-react";
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
import {startTransition, useEffect, useState} from "react";
import { useDebounce } from "use-debounce";
import { useTypingMessage } from "@/features/group/model/use-typing-message";

export function MessageInput({
  form,
  onSubmitAction,
  isPending,
  groupId,
  userId,
  editingMessage,
  onCancelEdit,
}: {
  form: UseFormReturn<z.infer<typeof messageFormSchema>>;
  onSubmitAction: () => void;
  isPending: boolean;
  groupId: string;
  userId: string;
  editingMessage: { id: string; content: string } | null;
  onCancelEdit?: () => void;
}) {
  const [typing, setTyping] = useState(false);
  const [debouncedTyping] = useDebounce(typing, 500);
  const { dispatchTyping } = useTypingMessage(userId, groupId);

  useEffect(() => {
    if (editingMessage) {
      form.setValue("content", editingMessage.content);
    } else {
      form.reset();
    }
  }, [editingMessage, form]);

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
      {editingMessage && (
        <div className="flex items-center justify-between">
          <div className="mb-4 flex items-center gap-5">
            <Pen className="w-5 h-5" />
            <div className="text-[15px]">
              <p className="text-primary">Editing</p>
              <p>{editingMessage.content}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              form.reset();
              onCancelEdit?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <form className="relative" onSubmit={onSubmitAction}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <AutosizeTextarea
                    {...field}
                    autoFocus
                    maxHeight={200}
                    className="bg-transparent border border-[#4E4E4E] pr-20 focus-visible:ring-offset-0 focus-visible:ring-0"
                    placeholder="Type here..."
                    disabled={isPending}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                      field.onChange(e);
                      setTyping(!!e.target.value);
                    }}
                  />
                </div>
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
            {editingMessage ? <Check /> : <CornerDownRight />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
