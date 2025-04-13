import { Button } from "@/shared/ui/button";
import { Check, CornerDownRight, Pen, X } from "lucide-react";
import { z } from "zod";
import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { messageFormSchema } from "@/features/group/model/use-send-message-form";
import {AutosizeTextarea} from "@/shared/ui/autosize-textarea";
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import { useTypingMessage } from "@/features/group/model/use-typing-message";

const MemoPen = memo(Pen);
const MemoX = memo(X);
const MemoCheck = memo(Check);
const MemoCornerDownRight = memo(CornerDownRight);

type FormValues = z.infer<typeof messageFormSchema>;

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

  const handleCancelEdit = useCallback(() => {
    form.reset();
    form.setFocus("content")
    onCancelEdit?.();
  }, [form, onCancelEdit]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSubmitAction();
        form.setFocus("content")
      }
    },
    [form, onSubmitAction],
  );

  useEffect(() => {
    const content = editingMessage?.content || "";
    form.setValue("content", content);
  }, [editingMessage, form]);

  useEffect(() => {
    startTransition(() => {
      dispatchTyping(debouncedTyping);
    });
  }, [debouncedTyping, dispatchTyping]);

  const formField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<FormValues, "content">;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<FormValues>;
    }) => (
      <FormItem>
        <FormControl>
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
        </FormControl>
        <FormMessage className="text-rose-500" />
      </FormItem>
    ),
    [handleKeyDown, isPending],
  );

  return (
    <Form {...form}>
      {editingMessage && (
        <div className="flex items-center justify-between">
          <div className="mb-4 flex items-center gap-5">
            <MemoPen className="w-5 h-5" />
            <div className="text-[15px]">
              <p className="text-primary">Editing</p>
              <p>{editingMessage.content}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancelEdit}
          >
            <MemoX className="h-4 w-4" />
          </Button>
        </div>
      )}
      <form
        className="relative"
        onSubmit={() => {
          onSubmitAction();
          form.setFocus("content")
        }}
      >
        <FormField control={form.control} name="content" render={formField} />
        <div className="absolute right-2 bottom-[13px]">
          <Button
            disabled={isPending || !form.formState.isDirty}
            type="submit"
            size="icon"
          >
            {editingMessage ? <MemoCheck /> : <MemoCornerDownRight />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
